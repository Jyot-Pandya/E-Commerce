const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Helper for generating JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Utility function to check if strategy exists
const strategyExists = (name) => {
  return passport._strategies && passport._strategies[name];
};

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!strategyExists('google')) {
    return res.status(503).json({ 
      message: 'Google authentication is not configured' 
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!strategyExists('google')) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Google authentication is not configured`);
  }
  
  passport.authenticate('google', { session: false, failureRedirect: '/login' }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
    
    // Generate JWT token and send user info
    const token = generateToken(user._id);
    
    // For web applications, redirect to frontend with token
    // For API clients, return JSON response
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      // API client
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      // Web client - redirect to frontend with token in query params
      // Frontend should extract the token and store it
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-callback?token=${token}`);
    }
  })(req, res, next);
});

// GitHub OAuth routes
router.get('/github', (req, res, next) => {
  if (!strategyExists('github')) {
    return res.status(503).json({ 
      message: 'GitHub authentication is not configured' 
    });
  }
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  if (!strategyExists('github')) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=GitHub authentication is not configured`);
  }
  
  passport.authenticate('github', { session: false, failureRedirect: '/login' }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
    
    // Generate JWT token and send user info
    const token = generateToken(user._id);
    
    // For web applications, redirect to frontend with token
    // For API clients, return JSON response
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      // API client
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      // Web client - redirect to frontend with token in query params
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-callback?token=${token}`);
    }
  })(req, res, next);
});

module.exports = router; 