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
  "https://e-commerce-frontend.onrender.com"
];

// ✅ safest Render-compatible CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // for server-to-server, Stripe, etc.
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log("❌ Blocked Origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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
