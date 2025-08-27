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
    required: [true, "Review title is required"],
    trim: true,
    maxLength: [100, 'Review title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    trim: true,
    required: [true, 'Review comment is required'],
    maxLength: [500, 'Review cannot exceed 500 characters']
  },
  images: [{
    public_id: String,
    url: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  helpful: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  ],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ product: 1, status: 1, createdAt: -1 })
reviewSchema.index({ user: 1, createdAt: -1 })
reviewSchema.index({ rating: 1 })

// Virtual for helpful count
reviewSchema.virtual("helpfulCount").get(function () {
  return this.helpful.length
})

// Static method to calculate average rating for a product
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        product: productId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$product",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ])

  if (stats.length > 0) {
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    stats[0].ratingDistribution.forEach((rating) => {
      distribution[rating]++
    })

    await mongoose.model("Product").findByIdAndUpdate(productId, {
      numReviews: stats[0].numReviews,
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      ratingDistribution: distribution,
    })
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      numReviews: 0,
      avgRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    })
  }
}

// Post middleware to update product rating after save
reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.product)
})

// Post middleware to update product rating after remove
reviewSchema.post("remove", function () {
  this.constructor.calcAverageRating(this.product)
})

// Pre middleware to populate user info
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name avatar",
  })
  next()
})

export default mongoose.model('Review', reviewSchema);