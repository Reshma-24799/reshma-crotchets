import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 3 // ISO currency codes are 3 characters
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  exchangeRate: {
    type: Number,
    required: true,
    default: 1 // Rate relative to base currency (PLN)
  },
  isBaseCurrency: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one base currency
currencySchema.pre('save', async function(next) {
  if (this.isBaseCurrency) {
    await mongoose.model('Currency').updateMany(
      { _id: { $ne: this._id } },
      { isBaseCurrency: false }
    );
  }
  next();
});

export default mongoose.model('Currency', currencySchema);