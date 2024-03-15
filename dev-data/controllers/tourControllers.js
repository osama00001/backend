const fs = require('fs');
class Tour{
    // static toursData = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`))
    
     static getAllTours = (req,res)=>{
        console.warn(Tour.toursData)
        res.status(200).json({
        status:'success',
        result: 0, 
        data:{
            tours:{}
        }})
}

     static createTour = (req,res)=>{
        res.status(201).json(
            {
                status:'success',
                data:{
                    tour:updatedTours,
                }
            }   
            )
    
    
}

    static updateTour = (req,res)=>{
    res.status(200).json({message:"updated successfully"})
 }
 
    static getTour= (req,res)=>{
    res.status(200).json({
        status:'success',
        data:null,
    })
 }

   static deleteTour = (req,res)=>{
    res.status(200).json({status:'success',message:"successfully deleted"})
 }
}

module.exports = Tour