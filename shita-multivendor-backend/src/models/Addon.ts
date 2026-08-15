import mongoose, { Document, Schema } from 'mongoose';

interface IOption {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  price: number;
}

export interface IAddon extends Document {
  title: string;
  description?: string;
  quantityMinimum: number;
  quantityMaximum: number;
  options: IOption[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addonSchema = new Schema<IAddon>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    quantityMinimum: {
      type: Number,
      default: 0,
      min: 0,
    },
    quantityMaximum: {
      type: Number,
      default: 1,
      min: 0,
    },
    options: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
addonSchema.index({ title: 1 });
addonSchema.index({ isActive: 1 });

export const Addon = mongoose.model<IAddon>('Addon', addonSchema);
