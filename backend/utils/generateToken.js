const jwt = require('jsonwebtoken');
const { jwtSecret , jwtExpiration } = require('../config/auth');

exports.generateToken = (payload) => {
    return jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpiration,
    });
}