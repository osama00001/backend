const { catchAsync } = require("../../utils/catchAsync");
const User = require("../model/userModal");


const signup = catchAsync(async(req,res,next)=>{
    let payload={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    }
    const newUser = await User.create(payload)
    res.status(200).json({
        status: 'success',
        data:{
            user:newUser
        }
    })
})
module.exports=signup