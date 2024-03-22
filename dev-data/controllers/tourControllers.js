
const ApiFeatures = require('../apiFeatures');
const TourModal = require('../model/tourModel');
// class ApiFeatures{
//     constructor(query,queryString){
//         this.query=query
//         this.queryString=queryString
//     }

//     filter(){
//         const queryObj = { ...this.queryString};
//         const excludedFields = ['limit', 'sort', 'page', 'fields'];
//         excludedFields.forEach(el => delete queryObj[el]);
//         let queryStr = JSON.stringify(queryObj)
//         let updatedQuery=JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`))
//         this.query = this.query.find(updatedQuery);
//         return this
//     }

//     sort(){
//         if(this.queryString.sort){
//         let sortBy = this.queryString.sort.split(',').join(' ');
//         this.query = this.query.sort(sortBy);
//     }else{
//         this.query = this.query.sort('-createdAd');
//     }
//         return this
//     }

//     limitFeilds(){
//         if(this.queryString.fields){
//             let selectedFeilds = this.queryString.fields.split(',').join(' ')
//             this.query = this.query.select(selectedFeilds);
//     }else{
//         this.query = this.query.select('-__v');
//     }
//     return this
// }

//     paginatingData(){
//         if(this.queryString.page){
//             let pageNo = this.queryString.page * 1|| 1
//                 let limit = this.queryString.limit * 1 || 1
//                 let skip = (pageNo-1)*limit
//                 this.query=this.query.skip(skip).limit(limit)
//         }
//         return this
//     }
// }

class Tour{
    static topFiveLowest=async(req,res,next)=>{
        req.query.limit=5;
        req.query.sort='price'
        req.query.fields='name,duration,summary,price'
        next()
    }
    static getAllTours = async (req, res) => {
        try {
             let updatedQuery = new ApiFeatures(TourModal.find(),req.query).filter().sort().limitFeilds().paginatingData().query
            let tours = await updatedQuery
            res.status(200).json({
                status: 'success',
                result: tours.length,
                data: tours
            });
        } catch (err) {
            console.warn(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    }
    

     static createTour = async(req,res)=>{
        try{
           const newTour = await  TourModal.create(req.body)
           res.status(201).json({
            success: true,
            tour:newTour
           })
        }catch(err){
            console.warn(err)
            res.status(404).json({
                success: false,
                message:"something went wrong"
               })
        } 
    
    
}

    static updateTour = async (req,res)=>{
        try{
            const updatedTOur = await TourModal.findByIdAndUpdate(req.params.id,{name:"osama sajid"},{new:true,runValidators:true})
             res.status(200).json({
                success:true,
                data:updatedTOur
             })
        }
        catch(err){
          res.status(404).json({
            status:false,
            message:"something went wrong"
          })
        }
   
 }
 
    static getTour= async(req,res)=>{
        console.warn(req.params.id)
        try{
          const tour = await TourModal.findById(req.params.id)
          console.warn(typeof tour,tour)
          res.status(200).json({
            status:true,
            data:tour
          })
        }catch(err){
            console.warn(err)
            res.status(404).json({
                status:false,
                data:null,
                message: "something went wrog"
            })
        } 
    
 }

   static deleteTour = (req,res)=>{
    res.status(200).json({status:'success',message:"successfully deleted"})
 }

 static getTourStats = async (req, res) => {
  try {
      const stats = await TourModal.aggregate([
          {
              $match: { rattingAverage: { $gt: 3 } }
          },
          {
              $group: {
                  _id: '$difficulty',
                   totalTours: { $sum: 1 } ,
                   totalRating:{$sum:'$rattingQuantity'},
                   avgRating:{$avg:'$price'},
                   avgPrice:{$avg: '$price'},
                   minPrice:{$min:'$price'},
                   maxPrice:{$max:'$price'},
                   avgRatingRounded: { $round: [{ $avg: '$price' }, 2] } 
              }
          },{
            $sort:{avgPrice:1}
          }
      ],{ maxTimeMS: 30000 });

      res.status(200).json({ data: stats });
  } catch (err) {
      console.error(err);
      res.status(404).json({
          status: false,
          data: null,
          message: "Something went wrong"
      });
  }
}

static getMonthlyPlans=async(req,res)=>{
  try{
    const year =req.params.year 
    console.warn(year,req.params.year)
    const stats = await TourModal.aggregate([
    {$unwind:'$startDates'},

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt:  new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $substr: ["$startDates", 5, 2] }, // Extract year-month part from the date
        count: { $sum: 1 } ,// Count the documents for each month
        tours:{$push:'$name'},
      }
    },{
      $addFields:{month:"$_id"}
    },{
      $project:{
        _id:0
      }
    },{
      $sort:{
        count:-1
      }
    }

    ])
    res.status(200).json({
      data:stats
    })

  }
  catch(err){
    console.error(err);
      res.status(404).json({
          status: false,
          data: null,
          message: "Something went wrong"
      });
  }
}

}

module.exports = Tour