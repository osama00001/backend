const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path:'./conf.env'})
const fs = require('fs');

const TourModal = require('../model/tourModel');

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD)

mongoose.connect(DB)
  .then(() => {
    console.log('Connected successfully to MongoDB');
    
    // You can now start interacting with your MongoDB database
  })
  .catch((err) => {
    console.error('Error occurred while connecting to MongoDB:', err);
  });

const toursData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))

const importData=async()=>{
    try{
    const tourData = await TourModal.create(toursData)
    process.exit()
    console.warn("all data imported")
    }catch(err){
        console.warn(err)
    }
}

const deleteData=async()=>{
    try{
    const tourData = await TourModal.deleteMany()
    process.exit()
    }catch(err){
         console.warn(err)
    }

}

if(process.argv[2]=='--import'){
    importData();
}else if(process.argv[2]=='--delete'){
    deleteData()
}
