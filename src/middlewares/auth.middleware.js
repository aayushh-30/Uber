const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
    try {

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid authentication token' });
    }
}

module.exports = authMiddleware;