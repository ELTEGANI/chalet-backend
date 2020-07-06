const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();


router.post('/confirmbooking',adminController.bookingAndPayedCommissions);
router.get('/getAllReservations',adminController.getAllReservations)


module.exports = router;
  