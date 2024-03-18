const express = require('express')
const app = express()
const tourRoutes = require('./dev-data/routes/tourRoutes')
const userRouter = require('./dev-data/routes/userRouter')

app.use(express.json())
app.use('/api/v1/tours',tourRoutes)
app.use('/api/v1/users',userRouter)

module.exports = app
