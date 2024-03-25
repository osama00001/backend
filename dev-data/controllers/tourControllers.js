
const { catchAsync } = require('../../utils/catchAsync');
const { CustomError } = require('../ApiErrors');
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
    static getAllTours = catchAsync(async (req, res) => {       
             let updatedQuery = new ApiFeatures(TourModal.find(),req.query).filter().sort().limitFeilds().paginatingData().query
            let tours = await updatedQuery
            res.status(200).json({
                status: 'success',
                result: tours.length,
                data: tours
            });
        
    })
    
    // static catchAsync=(fn)=>{
    //   return (req,res,next)=>{
    //     fn(req,res,next).catch(err=>next(err))
    //   }
    // }

     static createTour = catchAsync(async(req,res,next)=>{
     
           const newTour = await  TourModal.create(req.body)
           res.status(201).json({
            success: true,
            tour:newTour
           })
        
        })
     




    static updateTour = catchAsync(async (req,res)=>{
            const updatedTOur = await TourModal.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
            if(!updatedTOur){
             return next(new CustomError('No tour found with that ID',404))
            }
             res.status(200).json({
                success:true,
                data:updatedTOur
             })
 })
 
    static getTour= catchAsync(async(req,res,next)=>{
          const tour = await TourModal.findById(req.params.id)
          if(!tour){
            let err = new CustomError('No tour found with that ID',404)
            return next(err)
          }
          res.status(200).json({
            status:true,
            data:tour
          })
    
 })

   static deleteTour = catchAsync(async (req,res)=>{
 
    const tour = await TourModal.deleteOne(req.params)
    if(!tour){
     return next(new CustomError('No tour found with that ID',404))
    }
    
    res.status(200).json({status:'success',message:"successfully deleted"})
 })

 static getTourStats = catchAsync(async (req, res) => {
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
})

static getMonthlyPlans=catchAsync(async(req,res)=>{
  
    const year =req.params.year 
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

})

}

module.exports = Tour