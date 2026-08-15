import mongoose, { Document, Schema } from 'mongoose';

interface ICoordinates {
  type: string;
  coordinates: number[][][];
}

export interface IZone extends Document {
  title: string;
  description?: string;
  location: ICoordinates;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const zoneSchema = new Schema<IZone>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: true,
        default: 'Polygon',
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
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
zoneSchema.index({ location: '2dsphere' });
zoneSchema.index({ title: 1 });
zoneSchema.index({ isActive: 1 });

export const Zone = mongoose.model<IZone>('Zone', zoneSchema);
