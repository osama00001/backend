const express = require('express')
const dotenv = require('dotenv').config({path:'./conf.env'})
const mongoose = require('mongoose');
const app = express()
console.warn(process.env)
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD)

mongoose.connect(DB)
  .then(() => {
    console.log('Connected successfully to MongoDB');
    
    // You can now start interacting with your MongoDB database
  })
  .catch((err) => {
    console.error('Error occurred while connecting to MongoDB:', err);
  });



let port =process.env.PORT
app.listen(port,()=>{
    console.warn("server is running")
})