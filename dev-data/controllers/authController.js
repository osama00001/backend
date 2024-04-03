const { catchAsync } = require("../../utils/catchAsync");
const jwt = require('jsonwebtoken')
const User = require("../model/userModal");
const bcrypt =require ('bcrypt')
const { CustomError } = require("../ApiErrors");
const {promisify} = require('util')
const crypto = require('crypto');
const sendEmail = require("../../utils/Email");
const sendEmails = require("../../utils/Email");

const sendUserToken=(res,token,user)=>{

    const expirationTime = new Date(Date.now() + process.env.COOKIE_EXPIRE_DATE); // 1 hour from now

    // Set JWT token in a cookie
    res.cookie('jwt', token, {
        httpOnly: true, // Make cookie accessible only through HTTP(S) requests, not JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        expires: expirationTime, // Set cookie expiration time
        sameSite: 'strict' // Enforce same-site cookie attribute for added security
    });
    
    if(Object.keys(user).length>0){
        res.status(200).json({
            status: 'success',
            userToken:token,
            data:{
                user
            }
        })
    }else{
        res.status(200).json({
            status: 'success',
            userToken:token,
           
        })
    }
    
}

const createJWTToken=async (newUser)=>{
    return await jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const login=catchAsync(async(req,res,next)=>{
    //step 1 check Email and password

    const { email, password } = req.body;
    if(!email || !password){
     return next(new CustomError("username or password is required",404))
    }

    //step 2 check user exist or not 

    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new CustomError("User do not exist",404))
    }
    
    //step 3 check user's passwords matching or not 

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
     return next(new CustomError("Username or password is incorrect!",401))
    }
    
    //step 4 send token

    const token =await createJWTToken(user)
    sendUserToken(res,token,{})
})

const signup = catchAsync(async(req,res,next)=>{
    let payload={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
        isPasswordChanged:req.body.isPasswordChanged,
        role:req.body.role
    }
    const aleradyExist = await User.find({email:req.body.email})
    if(aleradyExist.length>0){
        return next(new CustomError("User already exist",401,'fail'))
    }
    const newUser = await User.create(payload)
    const token = await createJWTToken(newUser)
    sendUserToken(res,token,newUser)
    
})

const protectRoute = catchAsync(async(req,res,next)=>{
    // // console.warn(req.headers)
    // if(req.headers.authorization.startWith('bearer')){

    // }
    const token = req.headers.authorization;
     let freshUser=''

  if (token && token.startsWith("Bearer")) {
   
    const decodedToken = await promisify(jwt.verify)(token.split(' ')[1], process.env.JWT_SECRET);
    if(decodedToken){
      freshUser = await User.findById(decodedToken.userId)
      if(!freshUser){
        return next(new CustomError('This user is no longer exist',404,'fail'))
      }
      if (freshUser.isPasswordChanged && decodedToken.iat < Math.floor(freshUser.isPasswordChanged.getTime() / 1000)) {
        // Password was changed after the token was issued
        return next(new CustomError('Password has been changed ',404,'fail'))
      }
    }
   
  }else{
    return next(new CustomError("User is not allowed, Please login to get access",401,'fail'))
  }
 
   req.user= freshUser
   console.warn("current user",freshUser)
  next()
})

const restrictedTo=(...roles)=>{
    return (req, res, next) => {
        // console.warn(roles,req.user.role)
        if(!roles.includes(req.user.role)){
            next(new CustomError("user do not have access to perform this action",403,'Fail'))
        }
        next(); 
    };

}

const forgotPassword = catchAsync(async(req,res,next)=>{
    
    const { email } = req.body;

        // Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            next(new CustomError("User do not exist",404))
        }
        // Generate a unique reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Update user with reset crypted token and expiry date
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save({ validateBeforeSave: false });

        const resetURl=`${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`
        const message =` forgot your passwor ? please click on a link to change your password \n 
        ${resetURl}`
        try{

        await sendEmail({
           email:'osamasajid38@gmail.com',
           subject:'Reset password!',
           message
        })
        res.status(200).json({
            status:'success',
            message:"Reset token has benn send!",
            user:user
        })

    }catch(err){
        user.resetPasswordToken=undefined
        user.resetPasswordExpires=undefined
        await user.save({ validateBeforeSave: false });
       return next(new CustomError('something wrong with sending Email',500,'fail'))
    }
        

})

const resetPassword=catchAsync(async(req,res,next)=>{
    // console.warn(req.params.resetToken)
//step1 get user based on that token
  let resetPasswordToken=crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
 const currentUser = await User.findOne({resetPasswordToken,resetPasswordExpires:{$gt:Date.now()}})
 if(!currentUser){
    return next(new CustomError('User is not found or token is expired',404,'fail'))
 }
 //step2 check token expirytime 
 currentUser.password=req.body.password,
//  currentUser.name=req.body.name
 currentUser.confirmPassword=req.body.confirmPassword
 currentUser.resetPasswordToken=undefined
 currentUser.resetPasswordExpires=undefined
 await currentUser.save()

 //step 3 paswordReset flag to true and set time (password modified || document is new).

 //setp4 send back jwt
 const token =await createJWTToken(currentUser)
sendUserToken(res,token,{})



})

const updatePassword=catchAsync(async(req,res,next)=>{
    //step1 find user by email
     
    const currentUser=await User.findOne({email:req.user.email}).select("+password")
    //step2 check password valid or not
    // console.warn(req.body.password, currentUser.password)
    const isPasswordValid = await bcrypt.compare(req.body.password, currentUser.password);
    // console.warn(isPasswordValid)
    if(!isPasswordValid){
    return next(new CustomError('Your password is incorrect',404,'fail'))
    }
    //step3 add new password
    currentUser.password = req.body.newPassword;
    currentUser.confirmPassword = req.body.confirmPassword
    // currentUser.isPasswordChanged = Date
    await currentUser.save()

    const token = await createJWTToken(currentUser)
    // res.status(200).json({
    //     status: 'true',
    //     token
    // })
    sendUserToken(res,token,{})

    

})
module.exports={signup,login, protectRoute,restrictedTo,forgotPassword,resetPassword,updatePassword}