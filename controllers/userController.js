const {Users,Reservations,Chalets,sms_codes} = require('../models');
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
      const  geneder             = req.body.geneder;
      const  password            = req.body.password;
      const  phoneNumber         = req.body.phoneNumber;
      const  emailAddress        = req.body.emailAddress;
      const  firebaseToken       = req.body.firebaseToken;
      const  verificationMessage = Math.random().toString(4).substring(2,4) + Math.random().toString(4).substring(2,4);    
      try{ 
       const isUserExists = await Users.findOne({ where: { phoneNumber:phoneNumber } })
        if(!isUserExists){
          const hashedPassword = await bcrypt.hash(password,12)  
          const createdUser = await Users.create({
            firstName:firstName,
            lastName:lastName,
            phoneNumber:phoneNumber,
            nationalId:nationalId,
            emailAddress:emailAddress,
            geneder:geneder,
            password:hashedPassword,
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
                            const message = "الرجاء استخدام هذا الرقم للتحقق من رقم جوالك"+verificationMessage;
                            const res = await axios.post(`https://www.hisms.ws/api.php?send_sms&username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&numbers=${phoneNumber}&sender=${process.env.SMS_SENDER}&message=${message}`);
                            console.log(res.data.data[0]);
                          }catch (err) {
                            console.error(err);
                          }
                          return res
                          .status(201)
                          .json({
                            meesage:"User Registered Successfully",
                            code:verificationMessage
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
                      const message = "الرجاء استخدام هذا الرقم للتحقق من رقم جوالك"+verificationMessage;
                      const res = await axios.post(`https://www.hisms.ws/api.php?send_sms&username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&numbers=${phoneNumber}&sender=${process.env.SMS_SENDER}&message=${message}`);
                      console.log(res.data.data[0]);
                    }catch (err) {
                      console.error(err);
                    }
                    const message = "الرجاء استخدام هذا الرقم للتحقق من رقم جوالك"+" "+verificationMessage;

                    return res
                    .status(201)
                    .json({
                      meesage:"User Registered Successfully",
                      code:message
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
          return res
            .status(200)
            .json({
            meesage:"This User already Exists",
         })
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
        console.log("isUserFound"+isUserFound.id);
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
                 return res
                  .status(200)
                  .json({
                    message: 'Account Verifyed'
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
        .status(401)
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

  async resetPassword(req,res,next) {
    const emailAddress = req.body.emailAddress;
    const userId       = req.body.userId;
    const  verificationCode = Math.random().toString(4).substring(2,4) + Math.random().toString(4).substring(2,4);    
     try{
      const isUserCodeExists = await sms_codes.findOne({
        where: { userId:userId}
      });
       if(isUserCodeExists){
          try{
            const isCodeDeleted = await sms_codes.destroy({ where: {  userId:userId} });
            if(isCodeDeleted){
              try{
                const createdCode = await sms_codes.create({
                  userId:userId,
                  code:verificationCode,
              })
              if(createdCode){
                const  verificationMessage = ("<h3 style='text-align: center;'>"+
                "كود اعادة تعيين كلمة المرور"+'<br>'+verificationCode+'<br>'+
                "شاليهات بيوتي"+" "+"0532295510"+'<br>'+
                "الرياض-حي الرمال-بعد دوار العويضة-ترخيص رقم 4516ث"+'<br>'
                +"</h3>")  
                 //send email address
         let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth:{
            user:process.env.EMAIL_ADDRESS,
            pass:process.env.EMAIL_PASSWORD
          }
        });
        let info = await transporter.sendMail({
          from: '"حجز شاليهات" <beautychalet2020@gmail.com>',
          to:emailAddress,
          subject: "إعادة تعيين كلمة المرور",
          html: verificationMessage,
          });
          console.log("Message sent: %s", info.messageId);
          return res
          .status(200)
          .json({
            message:'Check Your Email Address'
          });            
              }
              }catch (err) {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              }
            }
          }catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          }
       }else{
        return res
        .status(200)
        .json({
          message:'You dont have account with us'
        });
       }
     }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  async verifyResetPassword(req,res,next) {
    const verificationCode = req.body.verificationCode;
    const userId           = req.body.userId;
    const isCodeExists = await sms_codes.findOne({
      where: { userId:userId,code:verificationCode}
    });
    try{
      if(isCodeExists){
        return res
        .status(200)
        .json({
          message:'Now You can change your password'
        });
      }else{
        return res
        .status(401)
        .json({
          message:'Invalid Verification Code'
        });
      }
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  async updatePassword(req,res,next) {
    const password         = req.body.password;
    const userId           = req.body.userId;
    const hashedPassword = await bcrypt.hash(password,12)  
    try{
      const updatedpassword = await Users.update({
        password:hashedPassword,
    },{where:{ 
      id:userId,
    }});
      if(updatedpassword){
        return res
        .status(200)
        .json({
          message:'Your New Passwrod Updated Successfully'
        });
      }else{
        return res
        .status(401)
        .json({
          message:'couldnt Update Your Password Try Later'
        });
      }
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },


};