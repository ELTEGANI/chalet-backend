const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();


router.post('/confirmbooking',adminController.bookingAndPayedCommissions);


module.exports = router;
  