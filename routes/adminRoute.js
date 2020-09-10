const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
const isAuth = require('../middleware/middleware');


router.post('/confirmbooking',isAuth,adminController.bookingAndPayedCommissions);
router.get('/getAllReservations/:chaletId',isAuth,adminController.getAllReservations)
router.post('/createchalet',isAuth,adminController.createChalet)
router.put('/updateBankInformation',isAuth,adminController.updateBankInformation)
module.exports = router;
  
