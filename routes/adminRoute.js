const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
const isAuth = require('../middleware/middleware');


router.post('/confirmbooking',isAuth,adminController.bookingAndPayedCommissions);
router.get('/getAllReservations/:chaletId',isAuth,adminController.getAllReservations)
router.post('/createchalet',isAuth,adminController.createChalet)
router.put('/updateBankInformation',isAuth,adminController.updateBankInformation)
router.put('/updatePricesInfo',isAuth,adminController.updatePricesAndDiscounts)
router.put('/updatediscounts',isAuth,adminController.updateDiscounts)
router.get('/getAllUserMessages',isAuth,adminController.getAllUserMessages)
router.get('/reports/:chaletId/:startDate/:endDate',isAuth,adminController.generateReports)
module.exports = router;
  
