const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        require: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            name: String,
            price: Number,
            quantity: Number,
            subtotal: Number
        }
    ],
    totalAmount: Number,
    paymentMethod: {
        type: String,
        enum: ['CASH', 'UPI', 'CARD'],
        default: 'user'
    },
});

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;

