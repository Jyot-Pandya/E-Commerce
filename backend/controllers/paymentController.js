const Razorpay = require('razorpay');
const asyncHandler = require('express-async-handler');

// @desc    Create a Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    console.log('Attempting to create Razorpay order...');
    console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Loaded' : 'Missing');
    console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Loaded' : 'Missing');

    const { amount, currency } = req.body;
    console.log('Request body:', req.body);


    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency,
        receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
    }
});

module.exports = { createOrder }; 