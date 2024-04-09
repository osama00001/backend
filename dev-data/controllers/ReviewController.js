const { catchAsync } = require("../../utils/catchAsync")
const ReviewModal = require("../model/reviewModal")

const getAllReviews=catchAsync(async(req,res,next)=>{
    const result = await ReviewModal.find();
    res.status(200).json({
        status:true,
        result:result?.length,
        data:result,

    })
  
})
const createReview=catchAsync(async(req,res,next)=>{
    console.warn(req.user)
    let payload={
     review:req.body.review,
     ratting:req.body.ratting,
     tour:req.body.tour,
     user:req.user._id
    }
    let newReview = await ReviewModal.create(payload)
    res.status(200).json({
        status:'true',
        result:newReview
    })
})

module.exports={
    createReview,getAllReviews
}