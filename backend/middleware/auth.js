import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async(async (req, res, next) => {
  try{
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
          token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.token) {
          token = req.cookies.token;
      }
      if (!token) {
          return res.status(401).json({
              success: false,
              message: 'Not authorized, no token'
          });
      }
      try{
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id).select('-password');
          if (!user) {
              return res.status(401).json({
                  success: false,
                  message: 'User not found'
              });
          }
          req.user = user;
          next();
      } catch (error) {
          return res.status(401).json({
              success: false,
              message: 'Not authorized, token failed'
          });
      }
  } catch(err){
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }

});

// Admin access middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required'
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")
        if (user && !user.isLocked) {
          req.user = user
        }
      } catch (error) {
        // Token invalid, but continue without user
        console.log("Optional auth: Invalid token")
      }
    }

    next()
  } catch (error) {
    console.error("Optional auth middleware error:", error)
    next()
  }
}