const express = require('express')
const app = express()
const tourRoutes = require('./dev-data/routes/tourRoutes')
const userRouter = require('./dev-data/routes/userRouter')
const { CustomError } = require('./dev-data/ApiErrors')
const { errorHandler } = require('./dev-data/controllers/errorHandler')

app.use(express.json())
app.use('/api/v1/tours',tourRoutes)
app.use('/api/v1/users',userRouter)

app.all('*',(req,res,next)=>{
    const myError = new CustomError('No route is found for this request', 404, 'Not Found');
    next(myError)
})

app.use(errorHandler)

module.exports = app
