const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required : [true,'name should required'],
        unique:[true,'name should be true'],
        trim:true
    },
    duration:{
        type:Number,
        required : [true,"a tour must have duration"]
    },
    maxGrounpSize:{
       type : String,
       required : [true,"must have group size"]
    },
    difficulty:{
        type : String,
        required : [true,"must have diffculty"]
     },
    rattingAverage:{
        type : Number,
        default: 4.5
    },
    rattingQuantity:{
        type : Number,
        default: 0
    },
    price:{
        type:Number,
        required:[true, "price should not empty"]
    },
    discountPrice : Number,
    summary:{
        type:String,
        trim:true,
        required:[true," a tour  must has description"]
    },
    description:{
        type: String,
        trim:true,
    },
    imageCover:{
       type:[String]
    },
    createdAd:{
        type:Date,
        default: Date.now()
    },
    startDates:{
        type:[Date]
    }

})

const TourModal = mongoose.model('TourModal',tourSchema)
module.exports = TourModal