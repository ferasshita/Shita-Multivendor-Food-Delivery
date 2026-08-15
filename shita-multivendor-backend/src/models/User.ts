import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  role: 'USER' | 'VENDOR' | 'RIDER' | 'ADMIN';
  isActive: boolean;
  isOrderNotification: boolean;
  notificationToken?: string;
  addresses: mongoose.Types.ObjectId[];
  favouriteRestaurants: mongoose.Types.ObjectId[];
  socialProvider?: 'google' | 'facebook' | 'apple';
  socialId?: string;
  avatar?: string;
  otp?: string;
  otpExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['USER', 'VENDOR', 'RIDER', 'ADMIN'],
      default: 'USER',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOrderNotification: {
      type: Boolean,
      default: true,
    },
    notificationToken: String,
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    favouriteRestaurants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
    ],
    socialProvider: {
      type: String,
      enum: ['google', 'facebook', 'apple'],
    },
    socialId: String,
    avatar: String,
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpiry: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ socialId: 1, socialProvider: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
