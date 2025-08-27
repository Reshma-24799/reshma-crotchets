import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  selectedColor: {
    name: String,
    hexCode: String,
  },
  selectedSize: {
    name: String,
    dimensions: String,
  },
  customization: {
    message: String,
    instructions: String,
  },
})

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Poland" },
    phone: { type: String, required: true },
  },
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Poland" },
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    method: {
      type: String,
      enum: ['card', 'upi', 'blik', 'netbanking', 'stripe'],
      required: true
    },
  },
  paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  currency: {
    type: String,
    default: "PLN",
  },
  isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    trackingNumber: {
      type: String,
    },
    estimatedDelivery: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    refund: {
      amount: Number,
      reason: String,
      status: {
        type: String,
        enum: ["requested", "approved", "processed", "rejected"],
      },
      requestedAt: Date,
      processedAt: Date,
    },
}, {
  timestamps: true
});

// Virtual for order number
orderSchema.virtual("orderNumber").get(function () {
  return `RC-${this._id.toString().slice(-8).toUpperCase()}`
});

// Index for user orders
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ trackingNumber: 1 });

export default mongoose.model('Order', orderSchema);