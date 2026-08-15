# Shita Multi-vendor Backend

Production-ready GraphQL API backend for the Shita Multi-vendor Food Delivery Platform.

## Features

- ✅ **GraphQL API** with Apollo Server
- ✅ **Real-time Subscriptions** with WebSocket support
- ✅ **MongoDB Database** with Mongoose ODM
- ✅ **JWT Authentication** with role-based access control
- ✅ **TypeScript** for type safety
- ✅ **Production Ready** with security middleware
- ✅ **Rate Limiting** to prevent abuse
- ✅ **CORS** configuration
- ✅ **Helmet** for security headers
- ✅ **Error Handling** with custom error classes
- ✅ **Input Validation** and sanitization

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **GraphQL**: Apollo Server 5.x
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: GraphQL Subscriptions with WebSocket
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Validator.js
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+ (tested with 18.x)
- MongoDB 4.4 or higher
- npm or yarn

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your configuration:
   - MongoDB connection string
   - JWT secrets
   - Email/SMS service credentials
   - Payment gateway keys
   - Firebase credentials
   - etc.

3. **Build the project**:
   ```bash
   npm run build
   ```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:4000` by default.

## Production

Build and start the production server:

```bash
npm run build
npm start
```

## API Endpoints

### GraphQL

- **Endpoint**: `http://localhost:4000/graphql`
- **Subscriptions**: `ws://localhost:4000/graphql`

### Health Check

- **Endpoint**: `http://localhost:4000/health`
- **Method**: GET
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.45,
    "environment": "development"
  }
  ```

## GraphQL Schema

### Core Types

- **User**: Customer, vendor, rider, or admin accounts
- **Restaurant**: Restaurant/store information with location and delivery zones
- **Food**: Menu items with variations and addons
- **Order**: Orders with items, delivery address, and status tracking
- **Address**: User delivery addresses
- **Category**: Food categories
- **Addon**: Food addons and options
- **Zone**: Delivery zones with polygon boundaries
- **Coupon**: Discount coupons

### Queries

- `profile`: Get authenticated user profile
- `restaurants`: List all restaurants with pagination
- `restaurant(id)`: Get restaurant details
- `nearByRestaurants`: Find restaurants near a location
- `myOrders`: Get user's order history
- `order(id)`: Get order details
- `getActiveOrders`: Get active orders (for vendors/riders)

### Mutations

**Authentication**:
- `createUser`: Register new user
- `login`: User login
- `ownerLogin`: Vendor/admin login
- `updateUser`: Update user profile
- `changePassword`: Change password
- `sendOtpToEmail`: Send OTP to email
- `sendOtpToPhoneNumber`: Send OTP to phone
- `verifyOtp`: Verify OTP

**Orders**:
- `placeOrder`: Create new order
- `updateOrderStatus`: Update order status
- `assignRider`: Assign rider to order
- `cancelOrder`: Cancel order
- `reviewOrder`: Add review to order

**Restaurants**:
- `createRestaurant`: Create new restaurant
- `editRestaurant`: Update restaurant
- `deleteRestaurant`: Delete restaurant
- `updateRestaurantDelivery`: Update delivery bounds

### Subscriptions

- `subscribePlaceOrder(restaurant)`: Subscribe to new orders for a restaurant
- `subscriptionOrder(id)`: Subscribe to order status changes
- `orderStatusChanged(userId)`: Subscribe to user's order status changes

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles

- **USER**: Regular customers
- **VENDOR**: Restaurant owners
- **RIDER**: Delivery personnel
- **ADMIN**: System administrators

## Database Models

### User
- Basic information (name, email, phone)
- Role-based access (USER, VENDOR, RIDER, ADMIN)
- Email/phone verification
- Addresses and favorite restaurants
- Social login support

### Restaurant
- Basic information and images
- Location with GeoJSON Point
- Delivery bounds with GeoJSON Polygon
- Opening times
- Commission rate and sales tax
- Rating and reviews
- Wallet and earnings

### Order
- Order items with variations and addons
- Delivery address
- Payment information
- Order status tracking
- Rider assignment
- Review and rating

### Food
- Title, description, and image
- Restaurant and category
- Variations (sizes, options)
- Addons support
- Availability status

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcrypt with salt rounds
3. **Rate Limiting**: Prevents brute force attacks
4. **CORS**: Configured for allowed origins
5. **Helmet**: Security headers
6. **Input Validation**: Validates and sanitizes all inputs
7. **Role-Based Access Control**: Restricts access based on user roles

## Error Handling

The API uses custom error classes:

- `AuthenticationError` (401): Authentication failures
- `AuthorizationError` (403): Permission denied
- `ValidationError` (400): Input validation errors
- `NotFoundError` (404): Resource not found
- `ConflictError` (409): Resource conflicts

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `NODE_ENV`: development | production
- `PORT`: Server port (default: 4000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed CORS origins

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── index.ts      # Main config
│   └── database.ts   # Database connection
├── models/           # Mongoose models
│   ├── User.ts
│   ├── Restaurant.ts
│   ├── Food.ts
│   ├── Order.ts
│   └── ...
├── graphql/
│   ├── typeDefs/     # GraphQL schema
│   └── resolvers/    # GraphQL resolvers
├── middleware/       # Express middleware
│   └── auth.ts       # Authentication middleware
├── utils/            # Utility functions
│   ├── jwt.ts
│   ├── crypto.ts
│   ├── errors.ts
│   └── validation.ts
└── index.ts          # Application entry point
```

## Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server
- `npm run lint`: Run ESLint (when configured)
- `npm test`: Run tests (when configured)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@shita.com or visit our [documentation](https://shita.com/docs).
