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
    

const errorHandler = (err,req,res,next)=>{
    err.status = err.status || 'error'
    err.statusCode = err.statusCode || 500
    if(process.env.NODE_ENV=='development'){
        developmentError(err,res)
    }else if(process.env.NODE_ENV=='production'){
        productionError(err,res)
    }
    
}
module.exports={
    errorHandler
}