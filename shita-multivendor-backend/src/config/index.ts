import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  mongodb: {
    uri: string;
    user?: string;
    password?: string;
    dbName: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  admin: {
    email: string;
    password: string;
  };
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
  firebase: {
    type: string;
    projectId: string;
    privateKeyId: string;
    privateKey: string;
    clientEmail: string;
    clientId: string;
    authUri: string;
    tokenUri: string;
    authProvider: string;
    clientCertUrl: string;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
  };
  paypal: {
    mode: string;
    clientId: string;
    clientSecret: string;
  };
  google: {
    mapsApiKey: string;
    clientId: string;
    clientSecret: string;
  };
  facebook: {
    appId: string;
    appSecret: string;
  };
  apple: {
    clientId: string;
    teamId: string;
    keyId: string;
    privateKey: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  fileUpload: {
    maxFileSize: number;
    uploadPath: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origin: string[];
  };
  sentry: {
    dsn: string;
  };
  amplitude: {
    apiKey: string;
  };
  urls: {
    client: string;
    admin: string;
    resetPassword: string;
  };
  delivery: {
    defaultFee: number;
    commissionRate: number;
    taxRate: number;
    minOrderAmount: number;
    maxDistanceKm: number;
  };
  otp: {
    expiryMinutes: number;
    length: number;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shita-multivendor',
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    dbName: process.env.MONGODB_DB_NAME || 'shita-multivendor',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@shita.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@shita.com',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  firebase: {
    type: process.env.FIREBASE_TYPE || 'service_account',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    clientId: process.env.FIREBASE_CLIENT_ID || '',
    authUri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    authProvider: process.env.FIREBASE_AUTH_PROVIDER || 'https://www.googleapis.com/oauth2/v1/certs',
    clientCertUrl: process.env.FIREBASE_CLIENT_CERT_URL || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  },
  paypal: {
    mode: process.env.PAYPAL_MODE || 'sandbox',
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  },
  google: {
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || '',
    teamId: process.env.APPLE_TEAM_ID || '',
    keyId: process.env.APPLE_KEY_ID || '',
    privateKey: process.env.APPLE_PRIVATE_KEY || '',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },
  amplitude: {
    apiKey: process.env.AMPLITUDE_API_KEY || '',
  },
  urls: {
    client: process.env.CLIENT_URL || 'http://localhost:3000',
    admin: process.env.ADMIN_URL || 'http://localhost:3001',
    resetPassword: process.env.RESET_PASSWORD_URL || 'http://localhost:3000/reset-password',
  },
  delivery: {
    defaultFee: parseFloat(process.env.DEFAULT_DELIVERY_FEE || '5'),
    commissionRate: parseFloat(process.env.DEFAULT_COMMISSION_RATE || '10'),
    taxRate: parseFloat(process.env.DEFAULT_TAX_RATE || '5'),
    minOrderAmount: parseFloat(process.env.MIN_ORDER_AMOUNT || '10'),
    maxDistanceKm: parseFloat(process.env.MAX_DELIVERY_DISTANCE_KM || '50'),
  },
  otp: {
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10),
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
  },
};

export default config;
