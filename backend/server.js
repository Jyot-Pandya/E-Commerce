const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('./config/passport');
const helmet = require('helmet');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Load environment variables
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// Initialize express app
const app = express();

// Trust the proxy to get the correct protocol (https)
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize passport
app.use(passport.initialize());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/config/razorpay', (req, res) =>
  res.send({ clientId: process.env.RAZORPAY_KEY_ID })
);

// MongoDB connection
console.log('Attempting to connect to MongoDB...');
if (process.env.MONGO_URI && process.env.MONGO_URI.includes('@')) {
    // Logs the URI but masks the password for security
    const maskedUri = process.env.MONGO_URI.replace(/:([^:]*)@/, ':*****@');
    console.log(`Using MONGO_URI: ${maskedUri}`);
} else {
    console.log('MONGO_URI is not set or is in an unexpected format.');
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 