const products = require('../data/products');

describe('Products Data', () => {
  test('should have an array of products', () => {
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('each product should have essential properties', () => {
    products.forEach(product => {
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('countInStock');
      expect(product).toHaveProperty('rating');
      expect(product).toHaveProperty('numReviews');
    });
  });

  test('product prices should be numbers greater than 0', () => {
    products.forEach(product => {
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
    });
  });

  test('countInStock should be a non-negative number', () => {
    products.forEach(product => {
      expect(typeof product.countInStock).toBe('number');
      expect(product.countInStock).toBeGreaterThanOrEqual(0);
    });
  });

  test('rating should be a number between 0 and 5', () => {
    products.forEach(product => {
      expect(typeof product.rating).toBe('number');
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
    });
  });

  test('numReviews should be a non-negative number', () => {
    products.forEach(product => {
      expect(typeof product.numReviews).toBe('number');
      expect(product.numReviews).toBeGreaterThanOrEqual(0);
    });
  });
}); 