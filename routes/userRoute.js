const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();



router.post('/register',userController.signUpUser);
router.post('/booking',userController.userReservation);
router.put('/updatefirebasetoken',userController.updateUserFireBaseToken);
router.post('/userlogin',userController.userLogin);
router.put('/userverifcation',userController.verifyUserCode);


module.exports = router;
  