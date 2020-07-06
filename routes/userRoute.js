const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();



router.post('/register',userController.signUpUser);
router.post('/booking',userController.userReservation);
router.put('/updatefirebasetoken',userController.updateUserFireBaseToken);


module.exports = router;
  