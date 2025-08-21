import User from './User.js';
import Category from './Category.js';
import Product from './Product.js';
import Order from './Order.js';
import Review from './Review.js';
import ShippingZone from './ShippingZone.js';
import Currency from './Currency.js';

export {
  User,
  Category,
  Product,
  Order,
  Review,
  ShippingZone,
  Currency
};


// User → Orders: One-to-Many (customer can have multiple orders)
// User → Reviews: One-to-Many (customer can review multiple products)
// Product → Category: Many-to-One (products belong to categories)
// Product → Reviews: One-to-Many (products can have multiple reviews)
// Order → User: Many-to-One (orders belong to customers)
// Order → Products: Many-to-Many