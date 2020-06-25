const {Reservations} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const axios = require('axios');
require('dotenv').config();


module.exports = {
  async bookingAndPayedCommissions(req,res,next) {
      const  userId                   = req.body.userId;
      const  reservationStartDate     = req.body.reservationStartDate;
      const  reservationEndDate       = req.body.reservationEndDate;
      const  reservationStatus        = req.body.reservationStatus;
      try{ 
        const updatedReservations = await Reservations.update({
            userId:userId,
            reservationStartDate:reservationStartDate,
            reservationEndDate:reservationEndDate,
            reservationStatus:reservationStatus,
          }, { where: { 
            userId:userId,
            reservationStartDate:reservationStartDate,
            reservationEndDate:reservationEndDate
          }});
          res
            .status(200)
            .json({
              message: 'Reservations Updated'
            });
      }catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
      }
    },

};