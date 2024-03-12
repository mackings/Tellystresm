
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const {errorResponse} = require("../utils/utils");


exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json(errorResponse('Unauthorized: No token provided', 401));
    }
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json(errorResponse('Unauthorized: Invalid token', 401));
        } else {
            req.userId = decoded.userId;
            next();
        }
    });
};
