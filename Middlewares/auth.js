const jwt = require('jsonwebtoken');

module.exports.checkAuth = async (req, res, next) => {

    if (req.cookies && req.cookies.auth) {
        try {
            const token = await jwt.verify(req.cookies.auth, process.env.JWT_SECRET);
            req.user = token; // Set req.user to the decoded token payload
        } catch (err) {
            console.error("JWT verification failed:", err.message);
        }
    } 
    next();
}