require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./db');

// UPDATED: added helmet, rateLimit, mongoSanitize, hpp for security
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// UPDATED: added helmet for security headers
app.use(helmet());

// UPDATED: restricted CORS to frontend URL only instead of allowing everyone
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// UPDATED: replaced bodyParser.json() with express.json() — bodyParser is deprecated
// Also added 10kb limit to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));

// app.use(mongoSanitize({
//     allowDots: true,
//     replaceWith: '_'
// }));

// UPDATED: prevent HTTP Parameter Pollution attacks
app.use(hpp());

// UPDATED: general rate limiter — max 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});

// UPDATED: strict rate limiter for auth routes — max 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many attempts, please try again after 15 minutes.' }
});

// UPDATED: apply general limiter to all routes
app.use(generalLimiter);

// UPDATED: apply strict limiter only on login and signup
app.use('/user/login', authLimiter);
app.use('/user/signup', authLimiter);

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidates', candidateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // UPDATED: use PORT variable instead of hardcoded 3000
    console.log(`listening on port ${PORT}`);
});