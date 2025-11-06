import rateLimit from "express-rate-limit";

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({
      success: false,
      message: "Too many requests, please try again later.",
    });
  },
});



module.exports=globalLimiter