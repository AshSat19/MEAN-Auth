const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => function() {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'JWT-Auth_Token_Secret');
        next();
    } catch(error) {
        res.status(401).json({
            message: 'You are noy authenticated'
        });
    } 
};