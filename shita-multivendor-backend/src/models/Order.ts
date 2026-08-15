import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
  food: mongoose.Types.ObjectId;
  variation: {
    _id: mongoose.Types.ObjectId;
    title: string;
    price: number;
  };
  addons: Array<{
    _id: mongoose.Types.ObjectId;
    title: string;
    options: Array<{
      _id: mongoose.Types.ObjectId;
      title: string;
      price: number;
    }>;
  }>;
  quantity: number;
  specialInstructions?: string;
}

interface IDeliveryAddress {
  label: string;
  deliveryAddress: string;
  details: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface IOrder extends Document {
  orderId: string;
  restaurant: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  deliveryAddress: IDeliveryAddress;
  orderAmount: number;
  deliveryCharges: number;
  tipping: number;
  taxationAmount: number;
  discount: number;
  total: number;
  paymentMethod: 'COD' | 'CARD' | 'PAYPAL' | 'STRIPE';
  paidAmount: number;
  orderStatus:
    | 'PENDING'
    | 'ACCEPTED'
    | 'ASSIGNED'
    | 'PICKED'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  reason?: string;
  isRinged: boolean;
  isPickedUp: boolean;
  rider?: mongoose.Types.ObjectId;
  riderAssignedAt?: Date;
  acceptedAt?: Date;
  pickedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  estimatedDeliveryTime?: Date;
  review?: {
    rating: number;
    description: string;
    createdAt: Date;
  };
  isReviewed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        food: {
          type: Schema.Types.ObjectId,
          ref: 'Food',
          required: true,
        },
        variation: {
          _id: Schema.Types.ObjectId,
          title: String,
          price: Number,
        },
        addons: [
          {
            _id: Schema.Types.ObjectId,
            title: String,
            options: [
              {
                _id: Schema.Types.ObjectId,
                title: String,
                price: Number,
              },
            ],
          },
        ],
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        specialInstructions: String,
      },
    ],
    deliveryAddress: {
      label: String,
      deliveryAddress: String,
      details: String,
      location: {
        latitude: Number,
        longitude: Number,
      },
    },
    orderAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    tipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxationAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'CARD', 'PAYPAL', 'STRIPE'],
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED', 'DELIVERED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
    reason: String,
    isRinged: {
      type: Boolean,
      default: false,
    },
    isPickedUp: {
      type: Boolean,
      default: false,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    riderAssignedAt: Date,
    acceptedAt: Date,
    pickedAt: Date,
    deliveredAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    estimatedDeliveryTime: Date,
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      description: String,
      createdAt: Date,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ restaurant: 1, orderStatus: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ rider: 1, orderStatus: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
