# Shita Multi-vendor Backend - Getting Started Guide

## Overview

This is a **production-ready GraphQL API backend** for the Shita Multi-vendor Food Delivery Platform. It provides a complete backend solution with authentication, database models, and business logic for managing a multi-vendor food delivery ecosystem.

## Quick Start

### Prerequisites

- Node.js 18-20
- MongoDB 4.4+ (local or cloud)
- npm or yarn

### Installation

1. **Navigate to the backend directory**:
   ```bash
   cd shita-multivendor-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure at minimum:
   ```env
   MONGODB_URI=mongodb://localhost:27017/shita-multivendor
   JWT_SECRET=your-secure-secret-key
   JWT_REFRESH_SECRET=your-secure-refresh-key
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:4000`

## Using Docker (Recommended)

### Development with Docker

Start MongoDB and Redis for development:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Then run the backend locally:

```bash
npm run dev
```

### Production with Docker

Build and run everything:

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 4000

## Testing the API

Once the server is running, you can access:

- **GraphQL Playground**: `http://localhost:4000/graphql`
- **API Endpoint**: `http://localhost:4000`

### Example Query (User Registration)

```graphql
mutation CreateUser {
  createUser(userInput: {
    name: "John Doe"
    email: "john@example.com"
    password: "password123"
    phone: "+1234567890"
  }) {
    token
    user {
      _id
      name
      email
      role
    }
  }
}
```

### Example Query (Login)

```graphql
mutation Login {
  login(email: "john@example.com", password: "password123") {
    token
    user {
      _id
      name
      email
      role
    }
  }
}
```

### Example Query with Authentication

Add the token to HTTP headers:

```
Authorization: Bearer <your-token-here>
```

Then query your profile:

```graphql
query GetProfile {
  profile {
    _id
    name
    email
    phone
    role
    addresses {
      _id
      label
      deliveryAddress
    }
  }
}
```

## Core Features Implemented

### ✅ Authentication & User Management
- User registration with email/password
- JWT-based authentication
- Role-based access control (USER, VENDOR, RIDER, ADMIN)
- OTP verification for email/phone
- Password change functionality

### ✅ Restaurant Management
- Create, update, and delete restaurants
- Location-based restaurant search (GeoJSON)
- Delivery zones with polygon boundaries
- Restaurant ratings and reviews
- Opening hours management

### ✅ Order Management
- Place orders with multiple items
- Order status tracking (PENDING → ACCEPTED → ASSIGNED → PICKED → DELIVERED → COMPLETED)
- Rider assignment
- Order cancellation
- Order reviews and ratings

### ✅ Database Models
- User (with addresses and favorites)
- Restaurant (with location and delivery zones)
- Food (with variations and addons)
- Order (with items and delivery tracking)
- Category
- Addon
- Zone
- Coupon

### ✅ Security Features
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- MongoDB injection prevention
- Error handling

### ✅ GraphQL Subscriptions
- Real-time order placement notifications
- Order status change notifications

## Project Structure

```
shita-multivendor-backend/
├── src/
│   ├── config/          # Configuration (DB, env)
│   ├── models/          # Mongoose models
│   ├── graphql/
│   │   ├── typeDefs/    # GraphQL schema
│   │   └── resolvers/   # Query/Mutation/Subscription resolvers
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utilities (JWT, crypto, validation)
│   └── index.ts         # Server entry point
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Environment Variables

Key environment variables (see `.env.example` for complete list):

- `NODE_ENV`: development | production
- `PORT`: Server port (default: 4000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `CORS_ORIGIN`: Allowed CORS origins
- `STRIPE_SECRET_KEY`: Stripe payment gateway key
- `PAYPAL_CLIENT_ID`: PayPal payment gateway ID
- `GOOGLE_MAPS_API_KEY`: For location services
- `FIREBASE_*`: Firebase configuration for push notifications

## Next Steps

### What's Implemented
1. ✅ Core authentication system
2. ✅ User management
3. ✅ Restaurant CRUD operations
4. ✅ Order management
5. ✅ Database models with proper relationships
6. ✅ GraphQL API with type safety
7. ✅ Basic subscription support

### What's Pending
1. ⏳ Food/Menu management resolvers
2. ⏳ Category and Addon CRUD
3. ⏳ Coupon system
4. ⏳ Payment gateway integration (Stripe, PayPal)
5. ⏳ Email service (OTP sending)
6. ⏳ SMS service (Twilio for OTP)
7. ⏳ Push notifications (Firebase)
8. ⏳ File upload for images
9. ⏳ Analytics and reporting
10. ⏳ Rider management and assignment algorithm

## Connecting Frontend Applications

Update the frontend applications to point to your backend:

### Admin Dashboard (`shita-multivendor-admin/.env.dev`)
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:4000/
NEXT_PUBLIC_WS_SERVER_URL=ws://localhost:4000/
```

### Customer App (`shita-multivendor-app/app.json`)
```json
{
  "extra": {
    "GRAPHQL_URL": "http://localhost:4000/graphql",
    "WS_GRAPHQL_URL": "ws://localhost:4000/graphql"
  }
}
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker ps

# View MongoDB logs
docker logs shita-mongodb-dev

# Restart MongoDB
docker-compose -f docker-compose.dev.yml restart mongodb
```

### Port Already in Use
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>
```

### Build Issues
```bash
# Clean build
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

## Support

For issues and questions:
- GitHub Issues: [github.com/ferasshita/food-delivery-multivendor](https://github.com/ferasshita/food-delivery-multivendor)
- Documentation: See README.md in backend folder

## License

MIT License
