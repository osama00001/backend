const { catchAsync } = require("../../utils/catchAsync")
const { CustomError } = require("../ApiErrors")
const User = require("../model/userModal")

    const  getAllUsers=catchAsync(async(req,res)=>{
        const allUsers = await User.find()
        res.status(200).json({
            status : 'success',
            results: allUsers.length,
            data:{
                user:allUsers
            }
        })
    })
 const createUser=(req,res,next)=>{
        res.status(200).json({messgae:"all users"})
    }
    
 const updateUser=catchAsync(async(req,res,next)=>{
       //step1 get user with that email
       const currentUser = await User.findOne({_id:req.params.id})

       if(!currentUser){
         return next(new CustomError("User is not found",404,'fail'))
       }


     //step 2 we have to change values  and .save()
       currentUser.email = req.body.email
       currentUser.name= req.body.name
       await currentUser.save()

       res.status(200).json({
        status:true,
        user:currentUser
       })
    })
    
 const deleteMe=catchAsync(async(req,res,next)=>{
    
    const updateUser = await User.findOne({email:req.user.email})
    updateUser.userActive=false
    await updateUser.save()

    if(!updateUser){
        return next(new CustomError('user is not found',404,'fail'))
    }

    res.status(200).json({
        status:true,
        user:null
    })

    
})

module.exports = {getAllUsers,createUser,updateUser,deleteMe}