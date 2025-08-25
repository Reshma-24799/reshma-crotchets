import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

export default router;