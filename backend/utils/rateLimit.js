const rateLimit = require('express-rate-limit');

const limiter = (windowMs,max) =>{
    return rateLimit({
        windowMs,
        max,
        message: 'Too many requests, please try again after a minute.',
    });
}
    

module.exports = { limiter };