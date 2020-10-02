const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const isAuth = require('../middleware/middleware');



router.post('/register',userController.signUpUser);
router.post('/booking',isAuth,userController.userReservation);
router.put('/updatefirebasetoken',isAuth,userController.updateUserFireBaseToken);
router.put('/userverifcation',userController.verifyUserCode);
router.post('/sendnote',userController.sendNoteAboutChalet);
router.get('/getallchalets',userController.getAllChalets);
router.post('/createimage',userController.createChaletsImages);
router.get('/bookedReservation/:chaletId',userController.getAllReservationsDates);

module.exports = router;
  
