const express = require('express')
const app = express()
let port =8030
app.listen(port,()=>{
    console.warn("server is running")
})