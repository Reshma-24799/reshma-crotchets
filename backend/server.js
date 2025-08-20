import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();
const app = express();

// Security middleware setup
app.use(helmet());
app.use(compression());

//rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests, please try again later.'
    }
});
app.use(limiter);

//CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://reshmacrotchets.com' : 'http://localhost:3000',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({limit : '10mb'})); // Limit request body size to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Basic route
app.get('/',(req,res) => {
    res.json({
        message: 'Welcome to the Crotchet Shop',
        version: '1.0.0',
        environment: process.env.NODE_ENV

    })
})