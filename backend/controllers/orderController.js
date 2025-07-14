const Order = require('../models/orderModel');
const Papa = require('papaparse');
const PDFDocument = require('pdfkit');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export orders to CSV
// @route   GET /api/orders/export/csv
// @access  Private/Admin
const exportOrdersToCsv = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    
    const data = orders.map(order => ({
      ID: order._id,
      User: order.user ? order.user.name : 'N/A',
      Email: order.user ? order.user.email : 'N/A',
      Date: order.createdAt.toDateString(),
      Total: order.totalPrice,
      Paid: order.isPaid ? 'Yes' : 'No',
      Delivered: order.isDelivered ? 'Yes' : 'No',
    }));

    const csv = Papa.unparse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate PDF invoice for an order
// @route   GET /api/orders/:id/invoice
// @access  Private
const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    // Order Details
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.moveDown();

    // User Details
    doc.text(`Billed To:`);
    doc.text(order.user.name);
    doc.text(order.user.email);
    doc.text(order.shippingAddress.address);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`);
    doc.text(order.shippingAddress.country);
    doc.moveDown();

    // Items Table
    doc.font('Helvetica-Bold').text('Item');
    doc.text('Qty', 250, doc.y, { width: 50, align: 'right' });
    doc.text('Price', 300, doc.y, { width: 100, align: 'right' });
    doc.text('Total', 400, doc.y, { width: 100, align: 'right' });
    doc.moveDown();
    doc.font('Helvetica');

    order.orderItems.forEach(item => {
      doc.text(item.name);
      doc.text(item.qty, 250, doc.y, { width: 50, align: 'right' });
      doc.text(`$${item.price.toFixed(2)}`, 300, doc.y, { width: 100, align: 'right' });
      doc.text(`$${(item.qty * item.price).toFixed(2)}`, 400, doc.y, { width: 100, align: 'right' });
      doc.moveDown();
    });

    // Summary
    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.text(`Subtotal: $${order.itemsPrice.toFixed(2)}`, { align: 'right' });
    doc.text(`Tax: $${order.taxPrice.toFixed(2)}`, { align: 'right' });
    doc.text(`Shipping: $${order.shippingPrice.toFixed(2)}`, { align: 'right' });
    doc.text(`Total: $${order.totalPrice.toFixed(2)}`, { align: 'right' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isPaid) {
      res.status(400);
      throw new Error('Cannot cancel a paid order.');
    }

    // Add back the quantity to the stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.qty;
        await product.save();
      }
    }

    order.isCancelled = true;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  exportOrdersToCsv,
  generateInvoice,
  cancelOrder,
}; 