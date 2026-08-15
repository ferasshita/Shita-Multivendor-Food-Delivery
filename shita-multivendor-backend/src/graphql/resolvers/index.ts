import { GraphQLScalarType, Kind } from 'graphql';
import { authResolvers } from './auth';
import { restaurantResolvers } from './restaurant';
import { orderResolvers } from './order';

// Date scalar resolver
const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value: any) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL Date Scalar parser expected a `string`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Merge all resolvers
export const resolvers = {
  Date: dateScalar,

  Query: {
    ...authResolvers.Query,
    ...restaurantResolvers.Query,
    ...orderResolvers.Query,
    
    // Placeholder resolvers for types not yet implemented
    food: async () => [],
    categories: async () => [],
    popularFoodItems: async () => [],
    addons: async () => [],
    zones: async () => [],
    zone: async () => null,
    coupons: async () => [],
    getConfiguration: async () => ({
      _id: '1',
      currency: 'USD',
      currencySymbol: '$',
      deliveryRate: 5,
      isPaidVersion: false,
      skipEmailVerification: true,
      skipPhoneVerification: true,
    }),
    getTaxation: async () => ({
      _id: '1',
      taxationCharges: 5,
      enabled: true,
    }),
    getTipping: async () => ({
      _id: '1',
      tipVariations: [5, 10, 15, 20],
      enabled: true,
    }),
    riders: async () => [],
    rider: async () => null,
    availableRiders: async () => [],
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...restaurantResolvers.Mutation,
    ...orderResolvers.Mutation,
    
    // Placeholder mutations for types not yet implemented
    createFood: async () => { throw new Error('Not implemented'); },
    editFood: async () => { throw new Error('Not implemented'); },
    deleteFood: async () => { throw new Error('Not implemented'); },
    updateFoodOutOfStock: async () => { throw new Error('Not implemented'); },
    createAddress: async () => { throw new Error('Not implemented'); },
    editAddress: async () => { throw new Error('Not implemented'); },
    deleteAddress: async () => { throw new Error('Not implemented'); },
    selectAddress: async () => { throw new Error('Not implemented'); },
    addFavouriteRestaurant: async () => { throw new Error('Not implemented'); },
    createCategory: async () => { throw new Error('Not implemented'); },
    editCategory: async () => { throw new Error('Not implemented'); },
    deleteCategory: async () => { throw new Error('Not implemented'); },
    createAddons: async () => { throw new Error('Not implemented'); },
    editAddons: async () => { throw new Error('Not implemented'); },
    deleteAddons: async () => { throw new Error('Not implemented'); },
    createCoupon: async () => { throw new Error('Not implemented'); },
    editCoupon: async () => { throw new Error('Not implemented'); },
    deleteCoupon: async () => { throw new Error('Not implemented'); },
    applyCoupon: async () => { throw new Error('Not implemented'); },
    createZone: async () => { throw new Error('Not implemented'); },
    editZone: async () => { throw new Error('Not implemented'); },
    deleteZone: async () => { throw new Error('Not implemented'); },
    createRider: async () => { throw new Error('Not implemented'); },
    editRider: async () => { throw new Error('Not implemented'); },
    deleteRider: async () => { throw new Error('Not implemented'); },
    toggleAvailablity: async () => { throw new Error('Not implemented'); },
    forgotPassword: async () => { throw new Error('Not implemented'); },
    resetPassword: async () => { throw new Error('Not implemented'); },
  },

  Subscription: {
    ...orderResolvers.Subscription,
    orderStatusChanged: {
      subscribe: () => { throw new Error('Not implemented'); },
      resolve: (payload: any) => payload,
    },
  },

  Restaurant: {
    ...restaurantResolvers.Restaurant,
  },
};
