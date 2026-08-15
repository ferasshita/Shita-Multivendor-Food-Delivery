import mongoose, { Document, Schema } from 'mongoose';

interface ILocation {
  type: string;
  coordinates: [number, number];
}

export interface IAddress extends Document {
  label: string;
  deliveryAddress: string;
  details: string;
  location: ILocation;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
addressSchema.index({ location: '2dsphere' });
addressSchema.index({ user: 1 });

export const Address = mongoose.model<IAddress>('Address', addressSchema);
