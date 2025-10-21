require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const cookieParser=require('cookie-parser');

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
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
