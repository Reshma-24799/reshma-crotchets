import mongoose from 'mongoose';

const shippingZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  countries: [{
    type: String,
    required: true
  }],
  shippingMethods: [{
    name: {
      type: String,
      required: true // e.g., "Standard Shipping", "Express Delivery"
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedDays: {
      min: Number,
      max: Number
    },
    freeShippingThreshold: {
      type: Number,
      default: 0 // Free shipping if order total exceeds this amount
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('ShippingZone', shippingZoneSchema);