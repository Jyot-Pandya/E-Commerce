const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductCategories,
  getProductRecommendations,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.route('/').get(getProducts);
router.get('/top', getTopProducts);
router.get('/categories', getProductCategories);
router.route('/:id').get(getProductById);

// Protected routes
router.route('/:id/reviews').post(protect, createProductReview);

// Admin routes
router.route('/')
  .post(protect, admin, createProduct);

router.route('/:id')
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

router.route('/:id/recommendations').get(getProductRecommendations);

module.exports = router; 