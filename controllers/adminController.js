const {Reservations} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const axios = require('axios');
const { Op } = require('sequelize');
require('dotenv').config();
const nodemailer = require("nodemailer");



module.exports = {
  async bookingAndPayedCommissions(req,res,next) {
      const  userId                   = req.body.userId;
      const  userPhoneNumber          = req.body.userPhoneNumber;
      const  userEmailAddress         = req.body.userEmailAddress;
      const  userName                 = req.body.userName;
      const  nationalId               = req.body.nationalId
      const  totalAmount              = req.body.totalAmount
      const  insuranceAmount          = req.body.insuranceAmount
      const  commisonAmount           = req.body.commisonAmount
      const  restAmount               = req.body.restAmount
      const  discountAmount           = req.body.discountAmount
      const  chaletId                 = req.body.chaletId;
      const  reservationStartDate     = req.body.reservationStartDate;
      const  reservationEndDate       = req.body.reservationEndDate;
      const  reservationStatus        = req.body.reservationStatus;
          //send email contains invoices and sms for confirmations
      if(reservationStatus === "Booked"){
         try{ 
          const updatedReservations = await Reservations.update({
              reservationStatus:reservationStatus,
            },{where:{ 
              userId:userId,
              chaletId:chaletId,
              reservationStartDate:reservationStartDate,
              reservationEndDate:reservationEndDate
            }});
            if(updatedReservations){
              
            //send sms
          // const confirmationBookingMessage = "عملينا العزيز تم تاكيد الحجز امنياتنا بقضاء اوقات سعيدة.نرجو شاكرين كتابة ملاحظاتك عن خدماتنا من داخل التطبيق وذلك لمزيدا من ترقية الخدمة"  
          // try {
          //   const res = await axios.post(`https://www.hisms.ws/api.php?send_sms&username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&numbers=${userPhoneNumber}&sender=${process.env.SMS_SENDER}&message=${confirmationBookingMessage}`);
          //   console.log(res.data.data[0]);
          // }catch (err) {
          //   console.error(err);
          // }
          
          //send email address
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user:process.env.EMAIL_ADDRESS,
              pass:process.env.EMAIL_PASSWORD
              }
          });

       
          let message = (
            '<h3 style="text-align: center;">عقد ايجار شاليهات بيوتي(احدي مؤسسات الفضاء الرابع للمقاولات العامة)</h3>'+
            '<h4 style="text-align: right;">(الطرف الاول/المؤجر)</h4>'+
            '<table style=" font-family: arial, sans-serif;border-collapse: collapse;width: 100%;">' +
            '<tr style="background-color: #dddddd">'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">شاليهات بيوتي Beauty Chalets</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">جوال رقم/0532295510</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">الرياض-حي الرمال-بعد دوار العويضة-ترخيص رقم 4516ث</th>'+
            '</tr>'+
            '</table>'+

            '<h4 style="text-align: right;">(الطرف الثاني/مستأجر)</h4>'+
            '<table style=" font-family: arial, sans-serif;border-collapse: collapse;width: 100%;">' +
            '<tr style="background-color: #dddddd">'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">اسم المستأجر</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">رقم الهوية</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">رقم الجوال</th>'+
            '</tr>'+
            '<tr>'+
            '<td style="text-align: right;padding:25px;">'+userName+'</td>'+
            '<td style="text-align: right;padding:25px;">'+nationalId+'</td>'+
            '<td style="text-align: right;padding:25px;">'+userPhoneNumber+'</td>'+
            '</tr>'+
            '<tr style="background-color: #dddddd">'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">تاريخ الاستئجار</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">المبلغ الكلي</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">مبلغ التأمين</th>'+
            '</tr>'+
            '<tr>'+
            '<td style="text-align: right;padding:25px;">'+"الي"+reservationEndDate+"من"+reservationStartDate+'</td>'+
            '<td style="text-align: right;padding:25px;">'+totalAmount+'</td>'+
            '<td style="text-align: right;padding:25px;">'+insuranceAmount+'</td>'+
            '</tr>'+
            '<tr style="background-color: #dddddd">'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">مبلغ العربون</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">مبلغ الخصم</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">المبلغ المتبقي</th>'+
            '</tr>'+
            '<tr>'+
            '<td style="text-align: right;padding:25px;">'+commisonAmount+'</td>'+
            '<td style="text-align: right;padding:25px;">'+discountAmount+'</td>'+
            '<td style="text-align: right;padding:25px;">'+restAmount+'</td>'+
            '</tr>'+
            '<tr style="background-color: #dddddd">'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">ملاحظة</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">توقيع المستأجر او من ينوب عنه</th>'+
            '<th style=" border: 1px solid #dddddd;text-align: right;padding:25px;">توقيع المؤجر او من ينوب عنه</th>'+
            '</tr>'+
            '<tr>'+
            '<td style="text-align: right;padding:25px;">نموذج الكتروني معتمد ولا يحتاج الي توقيع</td>'+
            '<td style="text-align: right;padding:25px;">'+userName+'</td>'+
            '<td style="text-align: right;padding:25px;">ابوخليل</td>'+
            '</tr>'+
            '</table>'
          ); 

          let info = await transporter.sendMail({
          from: '"حجز شاليهات" <beautychalet2020@gmail.com>',
          to:userEmailAddress,
          subject: "تاكيد الحجز",
          html: message,
          });

          console.log("Message sent: %s", info.messageId);

         return res.status(200).json({
            message: 'Reservations Updated'
        });
          }
        }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
        }
      }else{
        try{ 
          const updatedReservations = await Reservations.update({
              reservationStatus:reservationStatus,
            },{where:{ 
              userId:userId,
              chaletId:chaletId,
              reservationStartDate:reservationStartDate,
              reservationEndDate:reservationEndDate
            }});
            if(updatedReservations){
             return res
              .status(200)
              .json({
                message: 'Reservations Updated'
              });
            }
        }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
        }
      }    
    },

    async getAllReservations(req,res,next) {
      const  userId             = req.body.userId;
      const  chaletId           = req.body.chaletId;
      try{
        const getAllReservations = await Reservations.findAll({
          where:{userId:userId,id:chaletId}
        });
        if(getAllReservations){
          return res
          .status(200)
          .json({
            chaletReservations:getAllReservations
          });
        }
      }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
        }
    }

};