const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    
    if (!token) return res.status(401).json('Access Denied');

    try {
        const tokenWithoutBearer = token.split(' ')[1];
        const verified = jwt.verify(tokenWithoutBearer, JWT_SECRET);
        req.user = verified;  // Attach user info to request
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(400).json('Invalid Token');
    }
}

module.exports = authenticateToken;