const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.headers?.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded", decoded);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;