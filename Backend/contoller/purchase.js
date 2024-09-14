const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Order = require('../models/Order');


// exports.purchasepremium = async (req, res) => {
//     try {
//         var rzp = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_KEY_SECRET
//         })

//         const amount = 2500;
//         rzp.orders.create({ amount: amount, currency: "INR" }, (err, order) => {

//             if (err) {
//                 throw new Error(JSON.stringify(err));
//             }

//             req.user.order = { order_id: order.id, status: 'PENDING' };
//             req.user.save()
//                 .then(() => {
//                     return res.status(201).json({ order, key_id: rzp.key_id });
//                 }).catch(err => {
//                     throw new Error(err);
//                 });
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(403).json({ message: 'Something went wrong', error: err });
//     }
// }


exports.purchasepremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        // Create Razorpay order
        rzp.orders.create({ amount: amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            // Create a new order in the database using the Order model
            const newOrder = new Order({
                order_id: order.id,   // Razorpay order ID
                status: 'PENDING',    // Initial status
                payment_id: 'N/A',     // Payment ID will be updated later
                user: req.user._id,   // Associate the order with the current user
            });

            // Save the new order in the database
            await newOrder.save()
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch(err => {
                    throw new Error(err);
                });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};


// exports.updateTransactionStatus = async (req, res, next) => {
//     try {
//         console.log("inside successfull..");
//         const { payment_id} = req.body;
//         const { user } = req;
//         const { order } = user;
//         user.ispremiumuser = true;
//         order.payment_id = payment_id;
//         order.status = "Successfull";
//         order.createdAt = new Date();
//         await user.save();

//         return res.status(202).json({ success: true, message: 'Payment successful!', token: generateAccessToken(user._id, user.ispremiumuser) })
//     } catch (err) {
//         console.log(err)
//         res.status(403).json({ message: 'updating transaction failed!', error: err })
//     }
// }
exports.updateTransactionStatus = async (req, res, next) => {
    try {
        console.log("inside successful..");
        const { payment_id, order_id } = req.body;
        const { user } = req;

        // Update user's premium status
        user.ispremiumuser = true;
        await user.save(); 

        const order = await Order.findOne({ order_id });
        if (order) {
            // Update the order with payment details
            order.payment_id = payment_id;
            order.status = "Successful"; // Corrected typo
            await order.save();

            // Generate access token with the updated user premium status
            return res.status(202).json({
                success: true,
                message: 'Payment successful!',
                token: generateAccessToken(user._id, user.ispremiumuser)
            });
        } else {
            return res.status(404).json({ message: 'Order not found!' });
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Updating transaction failed!', error: err });
    }
};


// exports.updateFailedTransactionStatus = async (req, res, next) => {
//     try {
//         console.log("inside failed..");
//         const { order_id } = req.body;
//         const order = await req.user.order({ where: { orderId: order_id } })
//         order[0].paymentId = 'N/A'
//         order[0].status = 'FAILED'
//         await order[0].save()
//         res.status(402).json({ message: 'payment failed!' })
//     } catch (err) {
//         console.log(err)
//         res.status(403).json({ message: 'updating transaction failed!', error: err })
//     }
// }

exports.updateFailedTransactionStatus = async (req, res, next) => {
    try {
        console.log("inside failed..");
        const { order_id } = req.body;
        const order = await Order.findOne({ order_id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found!' });
        }

        // Update the order status to FAILED
        order.payment_id = 'N/A';
        order.status = 'FAILED';
        await order.save();

        return res.status(200).json({ message: 'Payment failed status updated!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Updating transaction failed!', error: err });
    }
};





function generateAccessToken(id, ispremiumuser) {
    return jwt.sign({ userId: id, isPremium: ispremiumuser }, process.env.Secreat_Key);
}