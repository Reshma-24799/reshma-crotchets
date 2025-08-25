import User from '../../models/User.js';
import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import { generateToken } from '../../utils/jwt.js';

//create test user
export const createTestUser =  async (userData = {} ) => {
    const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'customer',
    ...userData
  };

  return await User.create(defaultUser);
}

// Create test admin
export const createTestAdmin = async (userData = {}) => {
  return await createTestUser({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    ...userData
  });
};

// Create test category
export const createTestCategory = async (categoryData = {}) => {
  const defaultCategory = {
    name: 'Test Category',
    description: 'Test category description',
    ...categoryData
  };
  
  return await Category.create(defaultCategory);
};

// Create test product
export const createTestProduct = async (productData = {}) => {
  const category = await createTestCategory();
  
  const defaultProduct = {
    name: 'Test Product',
    description: 'Test product description',
    price: 100,
    category: category._id,
    stock: 10,
    images: [{
      public_id: 'test_image',
      url: 'https://example.com/image.jpg'
    }],
    ...productData
  };
  
  return await Product.create(defaultProduct);
};
// Generate auth token for testing
export const getAuthToken = (userId) => {
  return generateToken(userId);
};

// Create auth headers
export const getAuthHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};