const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();


router.post('/confirmbooking',adminController.bookingAndPayedCommissions);
router.get('/getAllReservations/:userId/:chaletId',adminController.getAllReservations)
router.post('/createchalet',adminController.createChalet)


module.exports = router;
  