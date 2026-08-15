import mongoose, { Document, Schema } from 'mongoose';

interface IVariation {
  _id?: mongoose.Types.ObjectId;
  title: string;
  price: number;
  discounted: number;
  addons?: mongoose.Types.ObjectId[];
}

export interface IFood extends Document {
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  isAvailable: boolean;
  restaurant: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  variations: IVariation[];
  isPopular: boolean;
  orderCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const foodSchema = new Schema<IFood>(
  {
    title: {
      type: String,
      required: [true, 'Food title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Food description is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Food image is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    variations: [
      {
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        discounted: {
          type: Number,
          default: 0,
          min: 0,
        },
        addons: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Addon',
          },
        ],
      },
    ],
    isPopular: {
      type: Boolean,
      default: false,
    },
    orderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
foodSchema.index({ restaurant: 1 });
foodSchema.index({ category: 1 });
foodSchema.index({ isActive: 1, isAvailable: 1 });
foodSchema.index({ isPopular: -1, orderCount: -1 });

export const Food = mongoose.model<IFood>('Food', foodSchema);
