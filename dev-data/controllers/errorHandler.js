const { CustomError } = require("../ApiErrors")

const developmentError=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message : err.message,
        name :err.name,
        errStac: err.stack,
        err:err 

    })
}

const productionError=(err,res)=>{
        res.status(err.statusCode).json({
            status:err.status,
            message : err.message,
            name :err.name,
        })
    
    }
    

    const handleInvalidToken=(err,res)=>{
        let newErr=new CustomError('invalid token',401,'fail')
         developmentError(newErr,res)
    }
    const handleExpiryToken=(err,res)=>{
        let newErr=new CustomError('Token expired',401,'fail')
         developmentError(newErr,res)
    }
const errorHandler = (err,req,res,next)=>{
    err.status = err.status || 'error'
    err.statusCode = err.statusCode || 500
    if(process.env.NODE_ENV=='development'){
        if(err.name==='JsonWebTokenError'){
            handleInvalidToken(err,res)
        }else if(err.name==='TokenExpiredError'){
            handleExpiryToken(err,res)
        }
        else{
            developmentError(err,res)
        }
        
    }else if(process.env.NODE_ENV=='production'){
        productionError(err,res)
    }
    
}
module.exports={
    errorHandler
}