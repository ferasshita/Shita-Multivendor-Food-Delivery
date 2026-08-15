import mongoose, { Document, Schema } from 'mongoose';

interface ILocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface IOpeningTime {
  day: string;
  times: Array<{
    startTime: string[];
    endTime: string[];
  }>;
}

interface IDeliveryBounds {
  type: string;
  coordinates: number[][][];
}

export interface IRestaurant extends Document {
  name: string;
  slug: string;
  image: string;
  logo?: string;
  address: string;
  location: ILocation;
  deliveryBounds?: IDeliveryBounds;
  username?: string;
  password?: string;
  orderPrefix: string;
  deliveryTime: number;
  minimumOrder: number;
  salesTax: number;
  isActive: boolean;
  isAvailable: boolean;
  commissionRate: number;
  owner: mongoose.Types.ObjectId;
  reviewCount: number;
  reviewSum: number;
  rating: number;
  categories: mongoose.Types.ObjectId[];
  cuisines: mongoose.Types.ObjectId[];
  openingTimes: IOpeningTime[];
  zone: mongoose.Types.ObjectId;
  shopType?: string;
  deliveryFee: number;
  stripeAccountId?: string;
  paypalEmail?: string;
  bankDetails?: {
    accountTitle: string;
    accountNumber: string;
    bankName: string;
    iban?: string;
    swiftCode?: string;
  };
  notificationToken?: string;
  wallet: number;
  totalOrders: number;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, 'Restaurant image is required'],
    },
    logo: String,
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    deliveryBounds: {
      type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon',
      },
      coordinates: {
        type: [[[Number]]],
      },
    },
    username: String,
    password: {
      type: String,
      select: false,
    },
    orderPrefix: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    deliveryTime: {
      type: Number,
      required: true,
      default: 30,
      min: 0,
    },
    minimumOrder: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    salesTax: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviewSum: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    cuisines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Cuisine',
      },
    ],
    openingTimes: [
      {
        day: String,
        times: [
          {
            startTime: [String],
            endTime: [String],
          },
        ],
      },
    ],
    zone: {
      type: Schema.Types.ObjectId,
      ref: 'Zone',
    },
    shopType: String,
    deliveryFee: {
      type: Number,
      default: 5,
      min: 0,
    },
    stripeAccountId: String,
    paypalEmail: String,
    bankDetails: {
      accountTitle: String,
      accountNumber: String,
      bankName: String,
      iban: String,
      swiftCode: String,
    },
    notificationToken: String,
    wallet: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ slug: 1 });
restaurantSchema.index({ owner: 1 });
restaurantSchema.index({ zone: 1 });
restaurantSchema.index({ isActive: 1, isAvailable: 1 });
restaurantSchema.index({ rating: -1 });

// Virtual for calculating average rating
restaurantSchema.virtual('averageRating').get(function () {
  if (this.reviewCount === 0) return 0;
  return this.reviewSum / this.reviewCount;
});

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
