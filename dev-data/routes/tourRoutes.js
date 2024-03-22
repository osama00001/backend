const express = require('express')
const fs = require('fs');
const Tour = require('../controllers/tourControllers');
const router = express.Router();
router.route('/getStats').get(Tour.getTourStats)
router.route('/getMonthlyPlan/:year').get(Tour.getMonthlyPlans)
router.route('/topFiveLowest').get(Tour.topFiveLowest,Tour.getAllTours)
router.route('/').get(Tour.getAllTours).post(Tour.createTour)
router.route('/:id').get(Tour.getTour).patch(Tour.updateTour).delete(Tour.deleteTour)

module.exports = router