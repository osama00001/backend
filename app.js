const express = require('express')
const app = express()
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const tourRoutes = require('./dev-data/routes/tourRoutes')
const userRouter = require('./dev-data/routes/userRouter')
const { CustomError } = require('./dev-data/ApiErrors')
const { errorHandler } = require('./dev-data/controllers/errorHandler')
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use(helmet());
app.use(limiter);
app.use(xss());
app.use(mongoSanitize());

app.use(express.json())
app.use('/api/v1/tours',tourRoutes)
app.use('/api/v1/users',userRouter)

app.all('*',(req,res,next)=>{
    const myError = new CustomError('No route is found for this request', 404, 'Not Found');
    next(myError)
})

app.use(errorHandler)

module.exports = app
