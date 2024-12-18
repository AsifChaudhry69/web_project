const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Render cart page with checkout form
router.get('/cart', (req, res) => {
    const cartItems = req.session.cart || [];
    res.render('cart', { cartItems });
});

// Handle order placement
router.post('/checkout', async (req, res) => {
    const { customerName, street, city, postalCode } = req.body;
    const cartItems = req.session.cart || [];
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!customerName || !street || !city || !postalCode) {
        return res.render('cart', {
            cartItems,
            error: 'All fields are required.',
        });
    }

    try {
        const newOrder = new Order({
            customerName,
            address: { street, city, postalCode },
            items: cartItems,
            totalAmount,
        });

        await newOrder.save();
        req.session.cart = []; // Clear cart
        res.redirect('/orders');
    } catch (error) {
        res.render('cart', { cartItems, error: 'Error placing order. Try again.' });
    }
});

// Render admin orders page
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.render('adminOrders', { orders });
    } catch (error) {
        res.render('adminOrders', { orders: [], error: 'Error fetching orders.' });
    }
});

module.exports = router;
