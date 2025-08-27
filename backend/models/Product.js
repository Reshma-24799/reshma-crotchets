import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxLength: [200, 'Short description cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator: function (value) {
          return !value || value < this.price
        },
        message: "Discount price must be less than regular price",
      },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: String,
    trim: true,
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  colors: [ 
    {
      name: String,
      hexCode: String,
      stock: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
  ],
  sizes: [
  {
    name: String,
    dimensions: String,
    stock: {
      type: Number,
        min: 0,
        default: 0,
      },
    },
  ],
  materials: [
    {
      type: String,
      trim: true,
    },
  ],
  featured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
  ],
  numReviews: {
    type: Number,
    default: 0,
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
  },
  sold: {
    type: Number,
    default: 0,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.discountPrice && this.price > this.discountPrice) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for effective price
productSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice || this.price;
});

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  match: { status: "approved" },
});

// Index for search functionality
productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

// Index for filtering
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ avgRating: -1 });
productSchema.index({ createdAt: -1 });



export default mongoose.model('Product', productSchema);