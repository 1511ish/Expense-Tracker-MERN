const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],  // status options
        default: 'PENDING'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to User model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
