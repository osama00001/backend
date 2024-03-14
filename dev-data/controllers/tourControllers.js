const fs = require('fs');
class Tour{
    static toursData = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`))
    
     static getAllTours = (req,res)=>{
        console.warn(Tour.toursData)
        res.status(200).json({status:'success',
        result: Tour?.toursData.length, 
        data:{
            tours:Tour.toursData,
        }})
}

     static createTour = (req,res)=>{
    let updatedTours={...req.body}
    updatedTours.id = Tour.toursData[Tour.toursData.length-1].id+1
    Tour.toursData.push(updatedTours)
    fs.writeFile('./dev-data/data/tours-simple.json',JSON.stringify(Tour.toursData),(err)=>{
        
        if(!err){
            res.status(201).json(
                {
                    status:'success',
                    data:{
                        tour:updatedTours,
                    }
                }   
                )
        }else{
            console.warn(err)
        }
    })
    
    
}

    static updateTour = (req,res)=>{
    let objToUpdate = Tour.toursData.find((el)=>el._id==req.params.id)
    objToUpdate.name="asad"
    fs.writeFile('./dev-data/data/tours-simple.json',JSON.stringify(Tour.toursData),(err)=>{
        res.status(200).json({message:"updated successfully"})
    })
 }
 
    static getTour= (req,res)=>{
    console.warn(req.params.id)

    let tour = Tour.toursData.find(el=>req.params.id===el._id)
    console.warn(tour)
    res.status(200).json({
        status:'success',
        data:tour,
    })
 }

   static deleteTour = (req,res)=>{
    res.status(200).json({status:'success',message:"successfully deleted"})
 }
}

module.exports = Tour