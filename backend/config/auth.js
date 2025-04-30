require('dotenv').config();

exports.jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
exports.jwtExpiration = process.env.JWT_EXPIRATION || "30d";