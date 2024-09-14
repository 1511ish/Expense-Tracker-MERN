const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            console.log("no token provided..");
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_Key);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        req.userId = user._id;
        console.log("every thing is working fine..");
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
