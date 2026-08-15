export const typeDefs = `#graphql
  scalar Date

  type Query {
    # User & Authentication
    profile: User
    users: [User!]!
    
    # Restaurants
    restaurants(page: Int, limit: Int, search: String): RestaurantPagination!
    restaurant(id: ID!): Restaurant
    restaurantByOwner(id: ID!): Restaurant
    nearByRestaurants(latitude: Float!, longitude: Float!, limit: Int): [Restaurant!]!
    topRatedVendors(limit: Int): [Restaurant!]!
    
    # Orders
    myOrders(page: Int, limit: Int): OrderPagination!
    order(id: ID!): Order
    getActiveOrders(restaurantId: ID, page: Int, limit: Int, status: String): OrderPagination!
    ordersByRestId(restaurant: ID!, page: Int, limit: Int, status: String): OrderPagination!
    
    # Food & Menu
    food(restaurant: ID!): [Food!]!
    categories: [Category!]!
    popularFoodItems(latitude: Float!, longitude: Float!): [Food!]!
    
    # Addons & Variations
    addons: [Addon!]!
    
    # Zones & Delivery
    zones: [Zone!]!
    zone(id: ID!): Zone
    
    # Coupons
    coupons: [Coupon!]!
    
    # Configuration
    getConfiguration: Configuration!
    getTaxation: Taxation!
    getTipping: Tipping!
    
    # Riders
    riders: [User!]!
    rider(id: ID!): User
    availableRiders(zone: ID): [User!]!
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!
    createUser(userInput: UserInput!): AuthPayload!
    updateUser(updateUserInput: UpdateUserInput!): User!
    changePassword(oldPassword: String!, newPassword: String!): SuccessMessage!
    forgotPassword(email: String!): SuccessMessage!
    resetPassword(token: String!, password: String!): SuccessMessage!
    sendOtpToEmail(email: String!): SuccessMessage!
    sendOtpToPhoneNumber(phone: String!): SuccessMessage!
    verifyOtp(phone: String, email: String, otp: String!): SuccessMessage!
    ownerLogin(email: String!, password: String!): AuthPayload!
    
    # User Management
    pushToken(token: String!): SuccessMessage!
    updateNotificationStatus(isOrderNotification: Boolean!): User!
    
    # Restaurants
    createRestaurant(restaurantInput: RestaurantInput!): Restaurant!
    editRestaurant(restaurantInput: EditRestaurantInput!): Restaurant!
    deleteRestaurant(id: ID!): SuccessMessage!
    updateRestaurantDelivery(id: ID!, deliveryBounds: [[[[Float!]!]!]!]!): Restaurant!
    
    # Food
    createFood(foodInput: FoodInput!): Food!
    editFood(foodInput: EditFoodInput!): Food!
    deleteFood(id: ID!): SuccessMessage!
    updateFoodOutOfStock(id: ID!, isAvailable: Boolean!): Food!
    
    # Orders
    placeOrder(orderInput: OrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!, reason: String): Order!
    assignRider(orderId: ID!, riderId: ID!): Order!
    cancelOrder(id: ID!, reason: String!): Order!
    reviewOrder(id: ID!, rating: Int!, description: String): Order!
    
    # Addresses
    createAddress(addressInput: AddressInput!): Address!
    editAddress(addressInput: EditAddressInput!): Address!
    deleteAddress(id: ID!): SuccessMessage!
    selectAddress(id: ID!): Address!
    
    # Favorites
    addFavouriteRestaurant(id: ID!): User!
    
    # Categories
    createCategory(categoryInput: CategoryInput!): Category!
    editCategory(categoryInput: EditCategoryInput!): Category!
    deleteCategory(id: ID!): SuccessMessage!
    
    # Addons
    createAddons(addonInput: AddonInput!): Addon!
    editAddons(addonInput: EditAddonInput!): Addon!
    deleteAddons(id: ID!): SuccessMessage!
    
    # Coupons
    createCoupon(couponInput: CouponInput!): Coupon!
    editCoupon(couponInput: EditCouponInput!): Coupon!
    deleteCoupon(id: ID!): SuccessMessage!
    applyCoupon(code: String!, restaurant: ID): Coupon!
    
    # Zones
    createZone(zoneInput: ZoneInput!): Zone!
    editZone(zoneInput: EditZoneInput!): Zone!
    deleteZone(id: ID!): SuccessMessage!
    
    # Riders
    createRider(riderInput: RiderInput!): User!
    editRider(riderInput: EditRiderInput!): User!
    deleteRider(id: ID!): SuccessMessage!
    toggleAvailablity(id: ID!): User!
  }

  type Subscription {
    subscribePlaceOrder(restaurant: ID!): Order!
    subscriptionOrder(id: ID!): Order!
    orderStatusChanged(userId: ID!): Order!
  }

  # Types
  type User {
    _id: ID!
    name: String!
    email: String!
    phone: String
    phoneVerified: Boolean!
    emailVerified: Boolean!
    role: String!
    isActive: Boolean!
    isOrderNotification: Boolean!
    notificationToken: String
    addresses: [Address!]
    favouriteRestaurants: [Restaurant!]
    avatar: String
    createdAt: Date!
    updatedAt: Date!
  }

  type Restaurant {
    _id: ID!
    name: String!
    slug: String!
    image: String!
    logo: String
    address: String!
    location: Location!
    deliveryBounds: DeliveryBounds
    orderPrefix: String!
    deliveryTime: Int!
    minimumOrder: Float!
    salesTax: Float!
    isActive: Boolean!
    isAvailable: Boolean!
    commissionRate: Float!
    owner: User!
    reviewCount: Int!
    rating: Float!
    categories: [Category!]
    openingTimes: [OpeningTime!]
    zone: Zone
    deliveryFee: Float!
    wallet: Float!
    totalOrders: Int!
    totalEarnings: Float!
    createdAt: Date!
    updatedAt: Date!
  }

  type Food {
    _id: ID!
    title: String!
    description: String!
    image: String!
    isActive: Boolean!
    isAvailable: Boolean!
    restaurant: Restaurant!
    category: Category!
    variations: [Variation!]!
    isPopular: Boolean!
    orderCount: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type Order {
    _id: ID!
    orderId: String!
    restaurant: Restaurant!
    user: User!
    items: [OrderItem!]!
    deliveryAddress: DeliveryAddress!
    orderAmount: Float!
    deliveryCharges: Float!
    tipping: Float!
    taxationAmount: Float!
    discount: Float!
    total: Float!
    paymentMethod: String!
    paidAmount: Float!
    orderStatus: String!
    paymentStatus: String!
    reason: String
    rider: User
    riderAssignedAt: Date
    acceptedAt: Date
    pickedAt: Date
    deliveredAt: Date
    completedAt: Date
    cancelledAt: Date
    estimatedDeliveryTime: Date
    review: Review
    isReviewed: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Address {
    _id: ID!
    label: String!
    deliveryAddress: String!
    details: String
    location: Location!
    user: ID!
    isSelected: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Category {
    _id: ID!
    title: String!
    description: String
    image: String
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Addon {
    _id: ID!
    title: String!
    description: String
    quantityMinimum: Int!
    quantityMaximum: Int!
    options: [Option!]!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Zone {
    _id: ID!
    title: String!
    description: String
    location: DeliveryBounds!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Coupon {
    _id: ID!
    code: String!
    discount: Float!
    isActive: Boolean!
    isEnabled: Boolean!
    restaurant: Restaurant
    createdAt: Date!
    updatedAt: Date!
  }

  type Configuration {
    _id: ID!
    email: String
    password: String
    emailName: String
    enableEmail: Boolean
    clientId: String
    clientSecret: String
    sandbox: Boolean
    publishableKey: String
    secretKey: String
    currency: String
    currencySymbol: String
    deliveryRate: Float
    twilioAccountSid: String
    twilioAuthToken: String
    twilioPhoneNumber: String
    firebaseKey: String
    authDomain: String
    projectId: String
    storageBucket: String
    msgSenderId: String
    appId: String
    measurementId: String
    googleApiKey: String
    isPaidVersion: Boolean
    skipEmailVerification: Boolean
    skipPhoneVerification: Boolean
    googleMapLibraries: String
    googleColor: String
  }

  type Taxation {
    _id: ID!
    taxationCharges: Float!
    enabled: Boolean!
  }

  type Tipping {
    _id: ID!
    tipVariations: [Float!]!
    enabled: Boolean!
  }

  # Supporting Types
  type Location {
    coordinates: [Float!]!
  }

  type DeliveryBounds {
    coordinates: [[[[Float!]!]!]!]!
  }

  type OpeningTime {
    day: String!
    times: [TimeRange!]!
  }

  type TimeRange {
    startTime: [String!]!
    endTime: [String!]!
  }

  type Variation {
    _id: ID!
    title: String!
    price: Float!
    discounted: Float!
    addons: [Addon!]
  }

  type OrderItem {
    food: Food!
    variation: VariationDetail!
    addons: [AddonDetail!]!
    quantity: Int!
    specialInstructions: String
  }

  type VariationDetail {
    _id: ID!
    title: String!
    price: Float!
  }

  type AddonDetail {
    _id: ID!
    title: String!
    options: [OptionDetail!]!
  }

  type OptionDetail {
    _id: ID!
    title: String!
    price: Float!
  }

  type Option {
    _id: ID!
    title: String!
    description: String
    price: Float!
  }

  type DeliveryAddress {
    label: String!
    deliveryAddress: String!
    details: String
    location: LocationCoords!
  }

  type LocationCoords {
    latitude: Float!
    longitude: Float!
  }

  type Review {
    rating: Int!
    description: String
    createdAt: Date!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type SuccessMessage {
    message: String!
  }

  type RestaurantPagination {
    restaurants: [Restaurant!]!
    totalCount: Int!
    currentPage: Int!
    totalPages: Int!
  }

  type OrderPagination {
    orders: [Order!]!
    totalCount: Int!
    currentPage: Int!
    totalPages: Int!
  }

  # Inputs
  input UserInput {
    name: String!
    email: String!
    password: String!
    phone: String
  }

  input UpdateUserInput {
    name: String
    phone: String
  }

  input RestaurantInput {
    name: String!
    address: String!
    image: String!
    logo: String
    deliveryTime: Int!
    minimumOrder: Float!
    salesTax: Float
    orderPrefix: String!
    location: LocationInput!
    ownerId: ID!
    deliveryFee: Float
    zone: ID
  }

  input EditRestaurantInput {
    _id: ID!
    name: String
    address: String
    image: String
    logo: String
    deliveryTime: Int
    minimumOrder: Float
    salesTax: Float
    isAvailable: Boolean
    deliveryFee: Float
  }

  input FoodInput {
    title: String!
    description: String!
    image: String!
    restaurant: ID!
    category: ID!
    variations: [VariationInput!]!
  }

  input EditFoodInput {
    _id: ID!
    title: String
    description: String
    image: String
    category: ID
    variations: [VariationInput!]
  }

  input VariationInput {
    _id: ID
    title: String!
    price: Float!
    discounted: Float
    addons: [ID!]
  }

  input OrderInput {
    restaurant: ID!
    items: [OrderItemInput!]!
    deliveryAddress: DeliveryAddressInput!
    paymentMethod: String!
    orderAmount: Float!
    deliveryCharges: Float!
    tipping: Float
    taxationAmount: Float
    discount: Float
    total: Float!
  }

  input OrderItemInput {
    food: ID!
    variation: ID!
    addons: [OrderAddonInput!]
    quantity: Int!
    specialInstructions: String
  }

  input OrderAddonInput {
    _id: ID!
    options: [ID!]!
  }

  input DeliveryAddressInput {
    label: String!
    deliveryAddress: String!
    details: String
    latitude: Float!
    longitude: Float!
  }

  input AddressInput {
    label: String!
    deliveryAddress: String!
    details: String
    latitude: Float!
    longitude: Float!
  }

  input EditAddressInput {
    _id: ID!
    label: String
    deliveryAddress: String
    details: String
    latitude: Float
    longitude: Float
  }

  input CategoryInput {
    title: String!
    description: String
    image: String
  }

  input EditCategoryInput {
    _id: ID!
    title: String
    description: String
    image: String
  }

  input AddonInput {
    title: String!
    description: String
    quantityMinimum: Int
    quantityMaximum: Int
    options: [OptionInput!]!
  }

  input EditAddonInput {
    _id: ID!
    title: String
    description: String
    quantityMinimum: Int
    quantityMaximum: Int
    options: [OptionInput!]
  }

  input OptionInput {
    _id: ID
    title: String!
    description: String
    price: Float!
  }

  input CouponInput {
    code: String!
    discount: Float!
    restaurant: ID
  }

  input EditCouponInput {
    _id: ID!
    code: String
    discount: Float
    isActive: Boolean
    isEnabled: Boolean
  }

  input ZoneInput {
    title: String!
    description: String
    coordinates: [[[[Float!]!]!]!]!
  }

  input EditZoneInput {
    _id: ID!
    title: String
    description: String
    coordinates: [[[[Float!]!]!]!]
  }

  input RiderInput {
    name: String!
    email: String!
    password: String!
    phone: String!
    zone: ID
  }

  input EditRiderInput {
    _id: ID!
    name: String
    email: String
    phone: String
    zone: ID
    isActive: Boolean
  }

  input LocationInput {
    latitude: Float!
    longitude: Float!
  }
`;
