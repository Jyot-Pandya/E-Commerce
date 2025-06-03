const request = require('supertest');
const app = require('../server'); // Import the Express app
const mongoose = require('mongoose'); // Import Mongoose
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Ensure .env is loaded for test

// Increase Jest's default timeout if needed, especially for DB operations
// jest.setTimeout(10000); // Example: 10 seconds, apply if timeouts persist

beforeAll(async () => {
  // Use a different URI for testing if available, or ensure dev MONGO_URI is set
  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI or MONGO_URI_TEST must be defined in your .env file');
  }
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true, // Mongoose specific options if needed
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for testing...');
  } catch (err) {
    console.error('MongoDB connection error for testing:', err);
    process.exit(1); // Exit if DB connection fails for tests
  }
});

describe('Product API', () => {
  // Test for GET /api/products
  describe('GET /api/products', () => {
    test('should return 200 OK and an object containing an array of products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      // Check if the response body is an object and contains a products array
      expect(typeof response.body).toBe('object');
      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('pages');

      // Optionally, check if the products array is not empty if you always expect products
      if (response.body.products.length > 0) {
        // Check for essential properties on the first product (as an example)
        expect(response.body.products[0]).toHaveProperty('name');
        expect(response.body.products[0]).toHaveProperty('price');
        expect(response.body.products[0]).toHaveProperty('brand');
      }
    });
  });

  // We can add more describe blocks for other product routes like GET /api/products/:id
  // For example:
  // describe('GET /api/products/:id', () => {
  //   test('should return a single product if found', async () => {
  //     // First, get a valid product ID (e.g., from the /api/products call or a known ID)
  //     // Then, make the request: await request(app).get(`/api/products/${productId}`).expect(200);
  //   });
  //   test('should return 404 if product not found', async () => {
  //     // await request(app).get('/api/products/nonexistentid').expect(404);
  //   });
  // });
});

// Note: For tests involving POST, PUT, DELETE, or that depend on specific DB state,
// you'll want to manage test data setup and teardown, and potentially mock DB calls.
// Also, ensure your server doesn't call process.exit() which can interfere with Supertest.
// The Mongoose connection should also ideally be closed after all tests run.
// We can add global setup/teardown in Jest for this.

// Close Mongoose connection after all tests in this file have run
// Increase timeout for this hook as closing DB connection can take time
afterAll(async () => {
  if (mongoose.connection.readyState === 1) { // 1 === connected
    await mongoose.connection.close();
    console.log('MongoDB disconnected after testing.');
  }
}, 10000); // 10 second timeout for this hook

/*
Example of how to handle Mongoose connection for tests:
const mongoose = require('mongoose');

beforeAll(async () => {
  // Connect to a test database or ensure your dev DB is available
  // It's common to use a separate test database
  // await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
});

afterAll(async () => {
  // Close the Mongoose connection
  // await mongoose.connection.close();
});
*/ 