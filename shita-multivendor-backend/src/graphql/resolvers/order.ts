import { Order } from '../../models/Order';
import { Restaurant } from '../../models/Restaurant';
import { Food } from '../../models/Food';
import { User } from '../../models/User';
import { AuthContext, requireAuth } from '../../middleware/auth';
import { ValidationError, NotFoundError, AuthorizationError } from '../../utils/errors';
import { generateOrderId } from '../../utils/crypto';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export interface OrderItemInput {
  food: string;
  variation: string;
  addons: Array<{ _id: string; options: string[] }>;
  quantity: number;
  specialInstructions?: string;
}

export interface OrderInput {
  restaurant: string;
  items: OrderItemInput[];
  deliveryAddress: {
    label: string;
    deliveryAddress: string;
    details?: string;
    latitude: number;
    longitude: number;
  };
  paymentMethod: string;
  orderAmount: number;
  deliveryCharges: number;
  tipping?: number;
  taxationAmount?: number;
  discount?: number;
  total: number;
}

export const orderResolvers = {
  Query: {
    myOrders: async (
      _: any,
      { page = 1, limit = 10 }: { page?: number; limit?: number },
      context: AuthContext
    ) => {
      requireAuth(context);

      const skip = (page - 1) * limit;

      const [orders, totalCount] = await Promise.all([
        Order.find({ user: context.user!.userId })
          .populate('restaurant')
          .populate('user')
          .populate('rider')
          .populate({
            path: 'items.food',
            model: 'Food',
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Order.countDocuments({ user: context.user!.userId }),
      ]);

      return {
        orders,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    },

    order: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAuth(context);

      const order = await Order.findById(id)
        .populate('restaurant')
        .populate('user')
        .populate('rider')
        .populate({
          path: 'items.food',
          model: 'Food',
        });

      if (!order) {
        throw new NotFoundError('Order');
      }

      // Check if user has access to this order
      const restaurant = await Restaurant.findById(order.restaurant);
      if (
        context.user!.role !== 'ADMIN' &&
        order.user._id.toString() !== context.user!.userId &&
        restaurant && restaurant.owner.toString() !== context.user!.userId &&
        (!order.rider || order.rider._id.toString() !== context.user!.userId)
      ) {
        throw new AuthorizationError();
      }

      return order;
    },

    getActiveOrders: async (
      _: any,
      {
        restaurantId,
        page = 1,
        limit = 10,
        status,
      }: { restaurantId?: string; page?: number; limit?: number; status?: string },
      context: AuthContext
    ) => {
      requireAuth(context);

      const skip = (page - 1) * limit;

      const query: any = {
        orderStatus: { $nin: ['COMPLETED', 'CANCELLED'] },
      };

      if (restaurantId) {
        query.restaurant = restaurantId;
      }

      if (status) {
        query.orderStatus = status;
      }

      const [orders, totalCount] = await Promise.all([
        Order.find(query)
          .populate('restaurant')
          .populate('user')
          .populate('rider')
          .populate({
            path: 'items.food',
            model: 'Food',
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Order.countDocuments(query),
      ]);

      return {
        orders,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    },

    ordersByRestId: async (
      _: any,
      {
        restaurant,
        page = 1,
        limit = 10,
        status,
      }: { restaurant: string; page?: number; limit?: number; status?: string },
      context: AuthContext
    ) => {
      requireAuth(context);

      const skip = (page - 1) * limit;

      const query: any = { restaurant };
      if (status) {
        query.orderStatus = status;
      }

      const [orders, totalCount] = await Promise.all([
        Order.find(query)
          .populate('restaurant')
          .populate('user')
          .populate('rider')
          .populate({
            path: 'items.food',
            model: 'Food',
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Order.countDocuments(query),
      ]);

      return {
        orders,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    },
  },

  Mutation: {
    placeOrder: async (
      _: any,
      { orderInput }: { orderInput: OrderInput },
      context: AuthContext
    ) => {
      requireAuth(context);

      // Validate restaurant
      const restaurant = await Restaurant.findById(orderInput.restaurant);
      if (!restaurant || !restaurant.isActive || !restaurant.isAvailable) {
        throw new ValidationError('Restaurant is not available');
      }

      // Validate items
      for (const item of orderInput.items) {
        const food = await Food.findById(item.food);
        if (!food || !food.isActive || !food.isAvailable) {
          throw new ValidationError(`Food item ${item.food} is not available`);
        }
      }

      // Generate order ID
      const orderId = generateOrderId(restaurant.orderPrefix);

      // Create order
      const order: any = await Order.create({
        orderId,
        restaurant: orderInput.restaurant,
        user: context.user!.userId,
        items: orderInput.items as any,
        deliveryAddress: {
          label: orderInput.deliveryAddress.label,
          deliveryAddress: orderInput.deliveryAddress.deliveryAddress,
          details: orderInput.deliveryAddress.details,
          location: {
            latitude: orderInput.deliveryAddress.latitude,
            longitude: orderInput.deliveryAddress.longitude,
          },
        },
        orderAmount: orderInput.orderAmount,
        deliveryCharges: orderInput.deliveryCharges,
        tipping: orderInput.tipping || 0,
        taxationAmount: orderInput.taxationAmount || 0,
        discount: orderInput.discount || 0,
        total: orderInput.total,
        paymentMethod: orderInput.paymentMethod,
        orderStatus: 'PENDING',
        paymentStatus: orderInput.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        paidAmount: orderInput.paymentMethod === 'COD' ? 0 : orderInput.total,
      });

      // Populate order
      const populatedOrder = await Order.findById(order._id)
        .populate('restaurant')
        .populate('user')
        .populate({
          path: 'items.food',
          model: 'Food',
        });

      // Publish order event
      pubsub.publish('ORDER_PLACED_' + orderInput.restaurant, {
        subscribePlaceOrder: populatedOrder,
      });

      return populatedOrder;
    },

    updateOrderStatus: async (
      _: any,
      { id, status, reason }: { id: string; status: string; reason?: string },
      context: AuthContext
    ) => {
      requireAuth(context);

      const order = await Order.findById(id);
      if (!order) {
        throw new NotFoundError('Order');
      }

      // Update status and relevant timestamps
      order.orderStatus = status as any;
      if (reason) order.reason = reason;

      const now = new Date();
      if (status === 'ACCEPTED') order.acceptedAt = now;
      if (status === 'PICKED') order.pickedAt = now;
      if (status === 'DELIVERED') order.deliveredAt = now;
      if (status === 'COMPLETED') order.completedAt = now;
      if (status === 'CANCELLED') order.cancelledAt = now;

      await order.save();

      const populatedOrder = await Order.findById(order._id)
        .populate('restaurant')
        .populate('user')
        .populate('rider')
        .populate({
          path: 'items.food',
          model: 'Food',
        });

      // Publish status change event
      pubsub.publish('ORDER_STATUS_' + id, {
        subscriptionOrder: populatedOrder,
      });

      return populatedOrder;
    },

    assignRider: async (
      _: any,
      { orderId, riderId }: { orderId: string; riderId: string },
      context: AuthContext
    ) => {
      requireAuth(context);

      const order = await Order.findById(orderId);
      if (!order) {
        throw new NotFoundError('Order');
      }

      const rider = await User.findById(riderId);
      if (!rider || rider.role !== 'RIDER') {
        throw new ValidationError('Invalid rider');
      }

      order.rider = rider._id as any;
      order.orderStatus = 'ASSIGNED';
      order.riderAssignedAt = new Date();
      await order.save();

      const populatedOrder = await Order.findById(order._id)
        .populate('restaurant')
        .populate('user')
        .populate('rider')
        .populate({
          path: 'items.food',
          model: 'Food',
        });

      // Publish status change event
      pubsub.publish('ORDER_STATUS_' + orderId, {
        subscriptionOrder: populatedOrder,
      });

      return populatedOrder;
    },

    cancelOrder: async (
      _: any,
      { id, reason }: { id: string; reason: string },
      context: AuthContext
    ) => {
      requireAuth(context);

      const order = await Order.findById(id);
      if (!order) {
        throw new NotFoundError('Order');
      }

      // Check if user can cancel
      if (
        context.user!.role !== 'ADMIN' &&
        order.user.toString() !== context.user!.userId
      ) {
        throw new AuthorizationError();
      }

      order.orderStatus = 'CANCELLED';
      order.reason = reason;
      order.cancelledAt = new Date();
      await order.save();

      const populatedOrder = await Order.findById(order._id)
        .populate('restaurant')
        .populate('user')
        .populate('rider')
        .populate({
          path: 'items.food',
          model: 'Food',
        });

      // Publish status change event
      pubsub.publish('ORDER_STATUS_' + id, {
        subscriptionOrder: populatedOrder,
      });

      return populatedOrder;
    },

    reviewOrder: async (
      _: any,
      { id, rating, description }: { id: string; rating: number; description?: string },
      context: AuthContext
    ) => {
      requireAuth(context);

      const order = await Order.findById(id);
      if (!order) {
        throw new NotFoundError('Order');
      }

      // Check if user is the order owner
      if (order.user.toString() !== context.user!.userId) {
        throw new AuthorizationError();
      }

      // Check if order is completed
      if (order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'DELIVERED') {
        throw new ValidationError('Order must be completed before review');
      }

      // Check if already reviewed
      if (order.isReviewed) {
        throw new ValidationError('Order already reviewed');
      }

      // Add review
      order.review = {
        rating,
        description: description || '',
        createdAt: new Date(),
      };
      order.isReviewed = true;
      await order.save();

      // Update restaurant rating
      const restaurant = await Restaurant.findById(order.restaurant);
      if (restaurant) {
        restaurant.reviewSum += rating;
        restaurant.reviewCount += 1;
        restaurant.rating = restaurant.reviewSum / restaurant.reviewCount;
        await restaurant.save();
      }

      return await Order.findById(order._id)
        .populate('restaurant')
        .populate('user')
        .populate('rider')
        .populate({
          path: 'items.food',
          model: 'Food',
        });
    },
  },

  Subscription: {
    subscribePlaceOrder: {
      subscribe: (_: any, { restaurant }: { restaurant: string }) => {
        return pubsub.asyncIterableIterator(['ORDER_PLACED_' + restaurant]);
      },
    },
    subscriptionOrder: {
      subscribe: (_: any, { id }: { id: string }) => {
        return pubsub.asyncIterableIterator(['ORDER_STATUS_' + id]);
      },
    },
  },
};

export { pubsub };
