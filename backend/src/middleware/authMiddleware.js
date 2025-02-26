const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    let token = req.header("Authorization") || req.body.token || req.cookies.token;
    token = token.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ 
            message: "Access Denied. No token provided." 
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ 
            message: "Invalid Token",
            status: false,
            error: err.message
        });
    }
};

module.exports = authMiddleware;
