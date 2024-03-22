const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required : [true,'name should required'],
        unique:[true,'name should be true'],
        trim:true,
        maxLength:[40,"a tour must have max 40 characters"],
        minLength:[10,"a tour must have min 10 characters"],
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
        default: 4.5,
        min:[1,"must abouve 1"],
        max:[5,"must below 5"]
    },
    rattingQuantity:{
        type : Number,
        default: 0
    },
    price:{
        type:Number,
        required:[true, "price should not empty"]
    },
    discountPrice : {
        type:Number,
        validator:{
            function(val){
         return val<=this.price
        },
        message:"discount must be less then price"

    }
    },
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
// tourSchema.pre(save,(item)=>{
//     console.log(item)
// })

const TourModal = mongoose.model('TourModal',tourSchema)
module.exports = TourModal