const {Users,Reservations,Chalets} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const axios = require('axios');
const { Op } = require('sequelize');
require('dotenv').config();


module.exports = {
  async signUpUser(req,res,next) {
      const  firstName      = req.body.firstName;
      const  lastName       = req.body.lastName;
      const  nationalId     = req.body.nationalId;
      const  geneder        = req.body.geneder;
      const  password       = req.body.password;
      const  phoneNumber    = req.body.phoneNumber;
      const  emailAddress   = req.body.emailAddress;
      const  firebaseToken  = req.body.firebaseToken;
      const  verificationMessage = Math.random().toString(4).substring(2,5) + Math.random().toString(4).substring(2,5);    
      try{ 
       const isUserExists = await Users.findOne({ where: { phoneNumber:phoneNumber } })
        if(isUserExists){
          const error = new Error('This User already Exists');
          error.statusCode = 401;
          throw error;
        }        
        const hashedPassword = await bcrypt.hash(password,12)  
        const result = await Users.create({
          firstName:firstName,
          lastName:lastName,
          phoneNumber:phoneNumber,
          nationalId:nationalId,
          emailAddress:emailAddress,
          geneder:geneder,
          password:hashedPassword,
          accountStatus:"not verified",
          firebaseToken:firebaseToken
          })
          if(result){
           return res
          .status(201)
          .json({
            meesage:"User Registered Successfully",
            code:verificationMessage
          })
          //send sms code to user
          // try {
          //   const res = await axios.post(`https://www.hisms.ws/api.php?send_sms&username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&numbers=${phoneNumber}&sender=${process.env.SMS_SENDER}&message=${verificationMessage}`);
          //   console.log(res.data.data[0]);
          // }catch (err) {
          //   console.error(err);
          // }
        }
      }catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
      }
    },

    async userReservation(req,res,next) {
      const  userId                 = req.body.userId;
      const  chaletId               = req.body.chaletId;
      const  reservationStartDate   = req.body.reservationStartDate;
      const  reservationEndDate     = req.body.reservationEndDate;
      const  reservationAmount      = req.body.reservationAmount;
      const  reservationStatus      = req.body.reservationStatus;
      const  reservationConditions  = req.body.reservationConditions;
       try{
        const  isBooked = await Reservations.findOne({ where: {
          reservationStatus:"booked",
          reservationStartDate:reservationStartDate,
          reservationEndDate:reservationEndDate
          }});  
         if(!isBooked){
           try{
            const result = await Reservations.create({
              userId:userId,
              chaletId:chaletId,
              reservationStartDate:reservationStartDate,
              reservationEndDate:reservationEndDate,
              reservationAmount:reservationAmount,
              reservationStatus:reservationStatus,
              reservationConditions:reservationConditions
              })
             res.status(201).json({
                message: 'Your Are Booked'
             }) 
           }catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
              next(err);
          }
         }else{
          res.status(200).json({
            message: 'Try Another Dates'
         }) 
         }
       }catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
          next(err);
      }
    },

    async updateUserFireBaseToken(req,res,next) {
      const  userId                = req.body.userId;
      const  userFireBaseToken     = req.body.userFireBaseToken;
       try{
        const updatedFireBaseToken = await Users.update({
          firebaseToken:userFireBaseToken,
        },{where:{ 
          id:userId,
        }});
        if(updatedFireBaseToken){
         return res.status(200).json({
            message:true
          });
        }
       }catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
          next(err);
      }
    },


  async userLogin(req, res, next) {
    const  Phone     = req.body.userPhone;
    const  password  = req.body.password;
    try{
    const isUserFound = await Users.findOne({ where: {phoneNumber:Phone},
       include:[{
        model:Chalets,
        attributes:['id','chaletName'],
        raw : true,
    }]
    });
    console.log("isUserFound"+isUserFound);
    if(!isUserFound){
          const error = new Error('You Do Not Have an Account,Please Register');
          error.statusCode = 401;
          throw error;    
    }else{
      const isPasswordEquel = await bcrypt.compare(password,isUserFound.password);
      if(!isPasswordEquel){
        const error = new Error('Worng Password');
        error.statusCode = 401;
        throw error;
      }else{
        const token = jwt.sign({userId:isUserFound.id},process.env.JWT_SEC);
       return res.status(200).json({
        accesstoken:token,
        chalet:isUserFound.Chalets
      })
      }
    }  
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  
};