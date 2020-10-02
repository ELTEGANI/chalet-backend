const {Users,Reservations,Chalets,sms_codes,Inbox,Images} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { Op } = require('sequelize');
require('dotenv').config();
const nodemailer = require("nodemailer");


module.exports = {
      async signUpUser(req,res,next) {
      const  firstName           = req.body.firstName;
      const  lastName            = req.body.lastName;
      const  nationalId          = req.body.nationalId;
      const  phoneNumber         = req.body.phoneNumber;
      const  emailAddress        = req.body.emailAddress;
      const  firebaseToken       = "null";
      const  verificationMessage = Math.random().toString(4).substring(2,4) + Math.random().toString(4).substring(2,4);
 try{ 
       const isUserExists = await Users.findOne({ where: { phoneNumber:phoneNumber } })       
       if(!isUserExists){  
          const createdUser = await Users.create({
            firstName:firstName,
            lastName:lastName,
            phoneNumber:phoneNumber,
            nationalId:nationalId,
            emailAddress:emailAddress,
            geneder:"null",
            password:"null",
            firebaseToken:firebaseToken
            })
            if(createdUser){
              try{
                const isCodeExists = await sms_codes.findOne({
                  where: { userId:createdUser.id}
                });
                if(isCodeExists){
                   try{
                    const isCodeDeleted = await sms_codes.destroy({ where: {  userId:createdUser.id} });
                     if(isCodeDeleted){
                         try{
                          const createdCode = await sms_codes.create({
                            userId:createdUser.id,
                            code:verificationMessage,
                        })
                        if(createdCode){
                          try {
                            const message = "your activation code is"+" "+verificationMessage;
 const res = await axios.post(`https://www.hisms.ws/api.php?send_sms&username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&numbers=${phoneNumber}&sender=${process.env.SMS_SENDER}&message=${message}`);
                            console.log(res.data.data[0]);
                          }catch (err) {
                            console.error(err);
                          }
                          return res
                          .status(201)
                          .json({
                            message:"Registered",
                            userId:createdCode.userId
                          })
                        }
                         }catch (error) {
                          if (!error.statusCode) {
                            error.statusCode = 500;
                          }
                          next(error);
                          }
                     }
                   }catch (error) {
                    if (!error.statusCode) {
                      error.statusCode = 500;
                    }
                    next(error);
                    }
                }else{
                  try{
                    const createdCode = await sms_codes.create({
                      userId:createdUser.id,
                      code:verificationMessage,
                  })
                  if(createdCode){
                    try {
                      const message = "your activation code is"+" "+verificationMessage;
    const res = await axios.post(`https://www.hisms.ws/api.php?send_sms&username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&numbers=${phoneNumber}&sender=${process.env.SMS_SENDER}&message=${message}`);
                      console.log(res.data.data[0]);
                    }catch (err) {
                      console.error(err);
                    }
                    return res
                    .status(201)
                    .json({
                      message:"Registered",
                      userId:createdCode.userId
                    })
                  }
                   }catch (error) {
                    if (!error.statusCode) {
                      error.statusCode = 500;
                    }
                    next(error);
                    }
                }
              }catch (error) {
                if (!error.statusCode) {
                  error.statusCode = 500;
                }
                next(error);
              }
          }
        }else{
              try{
                    const createdCode = await sms_codes.create({
                      userId:isUserExists.id,
                      code:verificationMessage,
                  })
                  if(createdCode){
                    try {
                      const message = "your activation code is"+" "+verificationMessage;
    const res = await axios.post(`https://www.hisms.ws/api.php?send_sms&username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&numbers=${phoneNumber}&sender=${process.env.SMS_SENDER}&message=${message}`);
                      console.log(res.data.data[0]);
                    }catch (err) {
                      console.error(err);
                    }
                    return res
                    .status(201)
                    .json({
                      message:"found",
                      userId:createdCode.userId
                    })
                  }
                   }catch (error) {
                    if (!error.statusCode) {
                      error.statusCode = 500;
                    }
                    next(error);
                    }
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
          reservationStatus:["init","Payed","Booked"],
          reservationStartDate:reservationStartDate,
          reservationEndDate:reservationEndDate,
          chaletId:chaletId
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
                message: 'Booked'
             }) 
           }catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
              next(err);
          }
         }else{
          res.status(422).json({
            message: 'found'
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
       const userExists = await Users.findByPk(userId);
      if (!userExists) {
        const error = new Error('Could not find User');
        error.statusCode = 404;
        throw error;
      }
        const updatedFireBaseToken = await Users.update({
          firebaseToken:userFireBaseToken},{where:{id:userId}});
          return res.status(200).json({
          message:"true"
          });
       }catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
          next(err);
      }
    },

  async verifyUserCode(req,res,next) {
    const  userCode           = req.body.userCode;
    const  userId             = req.body.userId;
    try{
      const isUserAndCodeExists = await sms_codes.findAll({
        where: { userId:userId,code:userCode},
        include:{
          model:Users,
          where:{
            id:userId
          }
        }
      });
      if(isUserAndCodeExists.length > 0){
        try{ 
          const updatedStatusCode = await sms_codes.update({
            status:1,
            },{where:{ 
              userId:userId,
              code:userCode
            }});
            if(updatedStatusCode){
              const updatedStatus = await Users.update({
                accountStatus:1,
                },{where:{ 
                  id:userId,
                }});
                console.log(updatedStatus)
                if(updatedStatus){
               const token = jwt.sign({userId:userId},process.env.JWT_SEC);
                  return res
                  .status(200)
                  .json({
                    message: 'Verified',
                    accessToken:token
                  });
                }
            }
        }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
        }
      }else{
        return res
        .status(404)
        .json({
          message:'Invalid Activation Code'
        });
      }
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

 
  async sendNoteAboutChalet(req,res,next) {
    const userNotes          = req.body.notes;
    const userId             = req.body.userId;
    const chaletId           = req.body.chaletId;

    try{
      const isUserReserved = await Reservations.findOne({ where: { userId:userId,id:chaletId} })
      if(isUserReserved){
        try{
          const createdNotes = await Inbox.create({
            userId:userId,
            chaletId:chaletId,
            userMessage:userNotes
            });
          if(createdNotes){
              return res
             .status(201)
             .json({
              message:'Done'
          });
            }        
        }catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        }
      }else{
        return res
        .status(404)
        .json({
          message:'Forbidden'
        });
      }
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },


  async getAllChalets(req,res,next) {
    try{
      const getAllChalets = await Chalets.findAll({
        where:{chaletStatus:"true",chaletApproval:"true"},
        include:{
          model:Images
        }
      });
      if(getAllChalets){
        return res
        .status(200)
        .json(getAllChalets);
      }
    }catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
      }
  },

   
  async createChaletsImages(req,res,next) {
      try{
        const uploadImage = await Images.create({
          chaletId:req.body.chaletId,
          imageUrl:req.body.imageUrl
          })
          if(uploadImage){
            return res
            .status(201)
            .json({
              message:"done uploaded images"
            });
          }
      }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
    }
  },

 async getAllReservationsDates(req,res,next) {
      const  chaletId           = req.params.chaletId;
      try{
        const getAllReservations = await Reservations.findAll({ 
         attributes: ['reservationStartDate','reservationEndDate'],
         where:{chaletId:chaletId,reservationStatus:["init","Payed","Booked"]}
        });
        if(getAllReservations){
          return res
          .status(200)
          .json(getAllReservations);
        }
      }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
        }
    },
};
