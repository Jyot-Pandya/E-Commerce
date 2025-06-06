const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Get sales summary
// @route   GET /api/admin/summary
// @access  Private/Admin
const getSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalSales: totalSales.length > 0 ? totalSales[0].totalSales : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales over time
// @route   GET /api/admin/sales-over-time
// @access  Private/Admin
const getSalesOverTime = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
  getSalesOverTime,
}; 