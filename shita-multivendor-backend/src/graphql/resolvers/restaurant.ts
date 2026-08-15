import { Restaurant } from '../../models/Restaurant';
import { User } from '../../models/User';
import { AuthContext, requireAuth, requireVendor } from '../../middleware/auth';
import { ValidationError, NotFoundError, AuthorizationError } from '../../utils/errors';
import { validateCoordinates } from '../../utils/validation';

export interface RestaurantInput {
  name: string;
  address: string;
  image: string;
  logo?: string;
  deliveryTime: number;
  minimumOrder: number;
  salesTax?: number;
  orderPrefix: string;
  location: {
    latitude: number;
    longitude: number;
  };
  ownerId: string;
  deliveryFee?: number;
  zone?: string;
}

export interface EditRestaurantInput {
  _id: string;
  name?: string;
  address?: string;
  image?: string;
  logo?: string;
  deliveryTime?: number;
  minimumOrder?: number;
  salesTax?: number;
  isAvailable?: boolean;
  deliveryFee?: number;
}

export const restaurantResolvers = {
  Query: {
    restaurants: async (
      _: any,
      { page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }
    ) => {
      const skip = (page - 1) * limit;

      const query: any = { isActive: true };
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const [restaurants, totalCount] = await Promise.all([
        Restaurant.find(query)
          .populate('owner')
          .populate('categories')
          .populate('zone')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Restaurant.countDocuments(query),
      ]);

      return {
        restaurants,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    },

    restaurant: async (_: any, { id }: { id: string }) => {
      const restaurant = await Restaurant.findById(id)
        .populate('owner')
        .populate('categories')
        .populate('zone');

      if (!restaurant) {
        throw new NotFoundError('Restaurant');
      }

      return restaurant;
    },

    restaurantByOwner: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAuth(context);

      const restaurant = await Restaurant.findOne({ owner: id })
        .populate('owner')
        .populate('categories')
        .populate('zone');

      if (!restaurant) {
        throw new NotFoundError('Restaurant');
      }

      // Check if user is the owner or admin
      if (context.user!.role !== 'ADMIN' && restaurant.owner._id.toString() !== context.user!.userId) {
        throw new AuthorizationError();
      }

      return restaurant;
    },

    nearByRestaurants: async (
      _: any,
      { latitude, longitude, limit = 20 }: { latitude: number; longitude: number; limit?: number }
    ) => {
      if (!validateCoordinates(latitude, longitude)) {
        throw new ValidationError('Invalid coordinates');
      }

      const restaurants = await Restaurant.find({
        isActive: true,
        isAvailable: true,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: 50000, // 50km
          },
        },
      })
        .populate('categories')
        .populate('zone')
        .limit(limit);

      return restaurants;
    },

    topRatedVendors: async (_: any, { limit = 10 }: { limit?: number }) => {
      const restaurants = await Restaurant.find({
        isActive: true,
        isAvailable: true,
      })
        .populate('categories')
        .populate('zone')
        .sort({ rating: -1, reviewCount: -1 })
        .limit(limit);

      return restaurants;
    },
  },

  Mutation: {
    createRestaurant: async (
      _: any,
      { restaurantInput }: { restaurantInput: RestaurantInput },
      context: AuthContext
    ) => {
      requireVendor(context);

      const { name, address, image, logo, deliveryTime, minimumOrder, salesTax, orderPrefix, location, ownerId, deliveryFee, zone } =
        restaurantInput;

      // Validate coordinates
      if (!validateCoordinates(location.latitude, location.longitude)) {
        throw new ValidationError('Invalid coordinates');
      }

      // Check if order prefix already exists
      const existingPrefix = await Restaurant.findOne({ orderPrefix: orderPrefix.toUpperCase() });
      if (existingPrefix) {
        throw new ValidationError('Order prefix already exists');
      }

      // Verify owner exists and is a vendor
      const owner = await User.findById(ownerId);
      if (!owner || owner.role !== 'VENDOR') {
        throw new ValidationError('Invalid owner');
      }

      // Generate slug
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Create restaurant
      const restaurant = await Restaurant.create({
        name,
        slug,
        address,
        image,
        logo,
        deliveryTime,
        minimumOrder,
        salesTax: salesTax || 0,
        orderPrefix: orderPrefix.toUpperCase(),
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        owner: ownerId,
        deliveryFee: deliveryFee || 5,
        zone,
      });

      return await restaurant.populate('owner');
    },

    editRestaurant: async (
      _: any,
      { restaurantInput }: { restaurantInput: EditRestaurantInput },
      context: AuthContext
    ) => {
      requireVendor(context);

      const { _id, ...updateData } = restaurantInput;

      // Find restaurant
      const restaurant = await Restaurant.findById(_id);
      if (!restaurant) {
        throw new NotFoundError('Restaurant');
      }

      // Check if user is the owner or admin
      if (context.user!.role !== 'ADMIN' && restaurant.owner.toString() !== context.user!.userId) {
        throw new AuthorizationError();
      }

      // Update slug if name changed
      const updates: any = { ...updateData };
      if (updateData.name) {
        updates.slug = updateData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }

      // Update restaurant
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        _id,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate('owner').populate('categories').populate('zone');

      return updatedRestaurant;
    },

    deleteRestaurant: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireVendor(context);

      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        throw new NotFoundError('Restaurant');
      }

      // Check if user is the owner or admin
      if (context.user!.role !== 'ADMIN' && restaurant.owner.toString() !== context.user!.userId) {
        throw new AuthorizationError();
      }

      // Soft delete
      restaurant.isActive = false;
      await restaurant.save();

      return {
        message: 'Restaurant deleted successfully',
      };
    },

    updateRestaurantDelivery: async (
      _: any,
      { id, deliveryBounds }: { id: string; deliveryBounds: number[][][][] },
      context: AuthContext
    ) => {
      requireVendor(context);

      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        throw new NotFoundError('Restaurant');
      }

      // Check if user is the owner or admin
      if (context.user!.role !== 'ADMIN' && restaurant.owner.toString() !== context.user!.userId) {
        throw new AuthorizationError();
      }

      // Update delivery bounds
      restaurant.deliveryBounds = {
        type: 'Polygon',
        coordinates: deliveryBounds as any,
      };
      await restaurant.save();

      return await restaurant.populate('owner');
    },
  },

  Restaurant: {
    owner: async (parent: any) => {
      if (parent.owner && typeof parent.owner === 'object' && parent.owner._id) {
        return parent.owner;
      }
      return await User.findById(parent.owner);
    },
  },
};
