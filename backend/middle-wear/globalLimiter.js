const rateLimit = require('express-rate-limit')
const globalLimiter = rateLimit({
    windowMs: 60*60*1000, max: 1000, msg:'Too many request from this IP, Please try again later'
})

module.exports=globalLimiter