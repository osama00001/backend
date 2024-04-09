const mongoose = require('mongoose')
const reviewSchema = new mongoose.Schema({
   review:{
    type:String,
    required:[true,'please sure to add review'],
    trim:true,
    minLength:5,
    maxlength:200,
   },
   ratting:{
    type:Number,
    required:[true,'review mast have ratting'],
    max:5,
    min:1,
   },
   createdAt:{
    type:Date,
    default:Date.now()
   },
   tour:[
    {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
        ref: 'TourModal' ,// Name of the referenced collection
        required:[true, "review is must required"]
      }
   ],
   user:[
    {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
        ref: 'User' ,
        required:[true, "User is must required"]// Name of the referenced collection
      }
   ]
})

reviewSchema.pre(/^find/,function(next){
    this.populate({path:'user tour',select:'name photo'})
    next()
})

const ReviewModal = mongoose.model('ReviewModal',reviewSchema)
module.exports = ReviewModal