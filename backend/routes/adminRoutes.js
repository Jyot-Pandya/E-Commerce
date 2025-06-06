const express = require('express');
const router = express.Router();
const { getSummary, getSalesOverTime } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/summary').get(protect, admin, getSummary);
router.route('/sales-over-time').get(protect, admin, getSalesOverTime);

module.exports = router; 