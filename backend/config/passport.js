const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel');
const dotenv = require('dotenv');
const path = require('path');

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug logging for OAuth credentials
console.log('Google OAuth credentials status:', {
  clientIDExists: !!process.env.GOOGLE_CLIENT_ID,
  clientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
  clientIDValue: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'not set'
});

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy - only setup if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Update OAuth information if user exists
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user if doesn't exist
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            // Generate a random password
            password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.log('Google OAuth credentials not found, strategy not configured');
}

// GitHub OAuth Strategy - only setup if credentials exist
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // GitHub may not provide email directly, need to handle that case
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
          
          // Check if user already exists
          let user = await User.findOne({ 
            $or: [
              { email },
              { githubId: profile.id }
            ]
          });

          if (user) {
            // Update OAuth information if user exists
            if (!user.githubId) {
              user.githubId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user if doesn't exist
          user = await User.create({
            name: profile.displayName || profile.username,
            email,
            githubId: profile.id,
            // Generate a random password
            password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.log('GitHub OAuth credentials not found, strategy not configured');
}

module.exports = passport; 