# ShopHub E-Commerce Platform

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Full-featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin order details page
- Checkout process (shipping, payment method, etc)
- PayPal / credit card integration
- Database seeder (products & users)

## Technology Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- CSS with Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Stripe for payment processing

## Installation

### Prerequisites
- Node.js
- MongoDB

### Setup
1. Clone the repository
```
git clone <repository-url>
```

2. Install dependencies for both frontend and backend
```
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

3. Create a .env file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
NODE_ENV=development
```

4. Seed the database
```
cd backend
npm run data:import
```

## Running the Application

### Development mode
```
# Run backend
cd backend
npm run dev

# Run frontend
cd ..
npm run dev
```

### Production mode
```
# Build frontend
npm run build

# Run backend (which will serve frontend)
cd backend
npm start
```

## API Endpoints

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get a product by ID
- POST /api/products - Create a product (Admin only)
- PUT /api/products/:id - Update a product (Admin only)
- DELETE /api/products/:id - Delete a product (Admin only)
- POST /api/products/:id/reviews - Create a product review

### Users
- POST /api/users - Register a user
- POST /api/users/login - Authenticate user & get token
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- GET /api/users - Get all users (Admin only)
- DELETE /api/users/:id - Delete a user (Admin only)

### Orders
- POST /api/orders - Create a new order
- GET /api/orders/:id - Get order by ID
- PUT /api/orders/:id/pay - Update order to paid
- GET /api/orders/myorders - Get logged in user orders
- GET /api/orders - Get all orders (Admin only)
- PUT /api/orders/:id/deliver - Update order to delivered (Admin only)


