# E-Commerce Platform

This is a full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Live Demo

The application is deployed on Vercel. You can view the live demo here: [https://myshophub.vercel.app/](https://myshophub.vercel.app/) 

## Features

- Full-featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search and category filtering
- User profile with order history
- Admin dashboard for managing products, users, and orders
- Mark orders as delivered option
- Secure checkout process (shipping, payment)
- Razorpay integration for payments
- Database seeder for initial setup (users and products)

## Currency

The prices are in Indian Rupees (₹).

## Technology Stack

### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **Recoil**: A state management library for React.
- **React Router**: For client-side routing and navigation.
- **Vite**: A modern frontend build tool.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Axios**: For making HTTP requests to the backend API.

### Backend
- **Node.js**: A JavaScript runtime for the backend.
- **Express.js**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for data storage.
- **Mongoose**: An ODM library for MongoDB.
- **JWT**: For secure user authentication and authorization.
- **Bcrypt.js**: For hashing user passwords.
- **Razorpay**: For processing payments.

## Installation

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or cloud-hosted instance like MongoDB Atlas)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies from the root directory:
```bash
cd ..
npm install
```

4. Create a `.env` file in the `backend` directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Razorpay API Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

5. Seed the database (optional):
This will populate the database with some sample users and products.
```bash
cd backend
npm run data:import
```

## Running the Application

You can run both the frontend and backend servers concurrently from the root directory.
```bash
npm run start
```
The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## API Endpoints

### Products
- `GET /api/products`: Get all products (with pagination, search, and category filtering)
- `GET /api/products/:id`: Get a product by ID
- `POST /api/products`: Create a product (Admin only)
- `PUT /api/products/:id`: Update a product (Admin only)
- `DELETE /api/products/:id`: Delete a product (Admin only)
- `POST /api/products/:id/reviews`: Create a product review

### Users
- `POST /api/users`: Register a new user
- `POST /api/users/login`: Authenticate a user and get a token
- `GET /api/users/profile`: Get the logged-in user's profile
- `PUT /api/users/profile`: Update the user's profile
- `GET /api/users`: Get all users (Admin only)
- `DELETE /api/users/:id`: Delete a user (Admin only)

### Orders
- `POST /api/orders`: Create a new order
- `GET /api/orders/myorders`: Get all orders for the logged-in user
- `GET /api/orders/:id`: Get a specific order by ID
- `GET /api/orders`: Get all orders (Admin only)
- `PUT /api/orders/:id/deliver`: Mark an order as delivered (Admin only)

### Payments
- `GET /api/config/razorpay`: Get Razorpay client ID
- The payment creation and verification is handled during the order placement process.


