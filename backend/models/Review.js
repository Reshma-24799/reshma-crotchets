import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    maxLength: [100, 'Review title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxLength: [500, 'Review cannot exceed 500 characters']
  },
  images: [{
    public_id: String,
    url: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product ratings after review save/update/delete
reviewSchema.post('save', async function() {
  await this.constructor.updateProductRatings(this.product);
});

reviewSchema.post('remove', async function() {
  await this.constructor.updateProductRatings(this.product);
});

reviewSchema.statics.updateProductRatings = async function(productId) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(productId);
  if (product) {
    await product.updateRatings();
  }
};

export default mongoose.model('Review', reviewSchema);