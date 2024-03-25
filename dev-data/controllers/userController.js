const { catchAsync } = require("../../utils/catchAsync")
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
 const createUser=(req,res)=>{
        res.status(200).json({messgae:"all users"})
    }
    
 const updateUser=(req,res)=>{
        res.status(200).json({messgae:"all users"})
    }
    
 const deleteUser=(req,res)=>{
        res.status(200).json({messgae:"all users"})
    }

module.exports = {getAllUsers,createUser,updateUser,deleteUser}