const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  exportOrdersToCsv,
  generateInvoice,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Protected routes
router.route('/export/csv').get(protect, admin, exportOrdersToCsv);
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/invoice').get(protect, generateInvoice);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router; 