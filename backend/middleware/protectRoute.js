const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
// Middleware to verify token
const protectRouter = async (req, res, next) => { 
    try {
        const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decoded" , token)
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }
        console.log("req.user-->",decoded.user) ; 
        req.user = decoded.user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = protectRouter;
