require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const cookieParser=require('cookie-parser');
const helmet = require('helmet');
const globalLimiter=require('./middle-wear/globalLimiter');
const hpp=require('hpp')

const allowedOrigins = [
  "http://localhost:3000",
  "https://e-comarce-five.vercel.app"
];

// ✅ CORS Middleware (safe for Render + Vercel)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cookieParser());

BigInt.prototype.toJSON = function() {
  return Number(this);
};


app.use(hpp());
app.use(globalLimiter);
app.use(helmet());
app.use('/webhook',require('./route/webhook'))
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended:true, limit: '50mb'}));
app.use(compression());



app.use('/api/auth',require('./route/auth'));
app.use('/api/admin',require('./route/admin'));
app.use('/api/user',require('./route/user'));
app.use('/api/payment',require('./route/payment'));



const port = process.env.PORT||5000

app.listen(port, () => {
  console.log(`Server Running on port ${port}`)
})
