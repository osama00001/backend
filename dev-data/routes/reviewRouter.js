const express =require('express');
const { createReview, getAllReviews } = require('../controllers/ReviewController');
const { protectRoute, restrictedTo } = require('../controllers/authController');
const router = express.Router()
router.route('/').post(protectRoute,restrictedTo('user','admin'),createReview).get(protectRoute,restrictedTo('user','admin'),getAllReviews)

module.exports=router