require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const cookieParser=require('cookie-parser');
const helmet = require('helmet');
const globalLimiter=require('./middle-wear/globalLimiter');
const hpp=require('hpp')


app.use(cookieParser());
const allowdOrigin=['https://e-comarce-five.vercel.app', 'http://localhost:3000']
app.use(cors({
  origin: function (origin,callbcak){
    if(!origin||allowdOrigin.includes(origin)){callbcak(null,true)}else{callbcak(new Error("CORS not allowed for this origin") )}},
  
  credentials: true
}));
BigInt.prototype.toJSON = function() {
  return Number(this);
};
app.use(hpp());
app.use(globalLimiter);
app.use(helmet());
app.use('/api/webhook',require('./route/webhook'))
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
