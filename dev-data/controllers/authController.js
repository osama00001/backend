const { catchAsync } = require("../../utils/catchAsync");
const jwt = require('jsonwebtoken')
const User = require("../model/userModal");
const bcrypt =require ('bcrypt')
const { CustomError } = require("../ApiErrors");
const {promisify} = require('util')

const login=catchAsync(async(req,res,next)=>{
    const { email, password } = req.body;
    if(!email || !password){
     return next(new CustomError("username or password is required",404))
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new CustomError("User do not exist",404))
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
     return next(new CustomError("Username or password is incorrect!",401))
    }

    const token =await jwt.sign({userId:user._id},process.env.JWT_SECRET,{ expiresIn: '5s' })


    res.status(200).json({
        status: 'success',
        userToken:token,
       
    })
})

const signup = catchAsync(async(req,res,next)=>{
    let payload={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    }
    const aleradyExist = await User.find({email:req.body.email})
    if(aleradyExist.length>0){
        return next(new CustomError("User already exist",401,'fail'))
    }
    const newUser = await User.create(payload)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.status(200).json({
        status: 'success',
        userToken:token,
        data:{
            user:newUser
        }
    })
})

const protectRoute = catchAsync(async(req,res,next)=>{
    // // console.warn(req.headers)
    // if(req.headers.authorization.startWith('bearer')){

    // }
    const token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    const decodedToken = await promisify(jwt.verify(token.split(' ')[1], process.env.JWT_SECRET));
    if(decodedToken){
      let freshUser = User.findById(decodedToken.id)
      if(!freshUser){
        return next(new CustomError('This user is no longer exist',404,'fail'))
      }
    }
   
  }else{
    return next(new CustomError("User is not allowed, Please login to get access",401,'fail'))
  }
 

  next()
})
module.exports={signup,login, protectRoute}