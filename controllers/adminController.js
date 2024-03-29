const {Reservations,Chalets,Users,Inbox} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const axios = require('axios');
const { Op } = require('sequelize');
require('dotenv').config();
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');




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
      const  firebaseToken            = req.body.firebaseToken;
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
            '</table>'+
            '</br>'+
            '<h4 style="text-align: right;">تمهيد</h4>'+
            '</br>'+
            '<h5 style="text-align: right;">حيث أن الطرف الثاني قد رغب في استئجار الشاليه حسب المحدد أعلاه، فقد أقرّ كل من المتعاقدين بكامل أهليتهم حسب البنود التالية </h5>'+ 
            '</br>'+
            '<ol start="1" dir="RTL">'+
            '<li>يعتبر التمهيد السابق جزء لا يتجزأ من هذا العقد.</li>'+
            '<li>بموجب هذا العقد استأجر الطرف الثاني  الشاليه من الطرف الأول حسب البيانات المحددة أعلاه. وعند التأخير عن الخروج في الوقت المحدد   فتحتسب كل ساعة تأخير ب 100 ريال إضافية  كحدّ أقصى 3 ساعات .</li>'+
            '<li>يلتزم الطرف الثانى بدفع كامل القيمة الإيجارية المتفق عليها للطرف الأول عند إستلام الوحدة والتوقيع على العقد فى محل إقامة المؤجر</li>'+
            '<li>يعتبر المستأجر مسؤول مسؤولية تامة عن كافة محتويات الشاليه وما يحدث فيه من أضرار أثناء فترة الايجار ولو كان المتسبب في التلف أحد أفراد عائلته أو خدمه أو ضيوفه ولا يحق له تخزين مواد ملتهبة أو مفرقعات وان حصل تلفيات في الشاليه أو محتوياته فيتم تقدير قيمتها وتخصم من مبلغ التأمين واذا زاد مبلغ التلفيات عن قيمة التأمين فيلتزم المستأجر بدفع المبلغ المتبقي .</li>'+
            '<li>مدة العقد حسب ما حرر أعلاه  ولا يجدّد إلا بعقد آخر ، وفي حال تجاوز التأخير 3 ساعات عن المذكور في العقد  فيتم احتساب ايجار يوم جديد( علما بأن أجزاء الساعة تحتسب ساعة كاملة ) وعلى المستأجر دفع المبلغ الجديد مع مبلغ غرامة التأخير .</li>'+
            '<li>لا يجوز  للمستأجر أن يؤجر العين المذكورة من الباطن أو يتنازل عن الإيجار لكل أو بعض المكان المؤجر له عن اي مدة كانت.  </li>'+
            '<li>يلتزم المستأجر بعدم ازعاج الجيران وعليه الالتزام بالأخلاق الإسلامية وعدم إقامة الحفلات  الصاخبة . كما أنه المسؤول أمنيا عن نوعية ضيوفه وعليه عدم ممارسة أي عمل يخل بالأمن أو يخالف أنظمة الدولة .</li>'+
            '<li>ادارة الشاليه ليست مسؤولة عن أي أضرار يصاب بها المستأجر أو أفراد أسرته أو ضيوفه سواء في المسبح أو الألعاب أو غيرها.</li>'+
            '<li>عدم ترك أغراض شخصية أو تجهيزات خارجية و إدارة الشاليه ليست مسؤولة عنها بعد خروج المستأجر . </li>'+
            '<li>إدارة الشاليه ليست مسؤولة عن انقطاع الكهرباء من قبل شركة الكهرباء وعليه تفهّم ذلك</li>'+
            '<li>التأجير للعوائل فقط وعلى المستأجر احضار سجل الأسرة أو صورة منه وتقديمها لإدارة الشاليه للتثبّت من ذلك .</li>'+
            '<li> يعتبر هذا العقد سند لأمر يحق للمؤجر المطالبة به مالياً أمام جهات الاختصاص  .</li>'+
            '<li>حرّر هذا العقد من نسختين بيد كل طرف نسخة للعمل بموجبها.</li>'+
            '</ol>' 
          ); 

          let info = await transporter.sendMail({
          from: '"حجز شاليهات" <beautychalet2020@gmail.com>',
          to:userEmailAddress,
          subject: "تاكيد الحجز",
          html: message,
          });
           try{
        const getAllReservations = await Reservations.findAll({
          where:{chaletId:chaletId,reservationStatus:["init","Payed","Booked"]},
        include:{
          model:Users,
         attributes:['id','firstName','lastName','phoneNumber','nationalId','emailAddress','geneder'],
        }
        });
        if(getAllReservations){
           const message = {
           notification: {
             title: 'تاكيد الحجز النهائي',
             body: 'عزيزنا العميل تم تاكيد حجزك النهائي نتمني لك اقامة سعيدة ونرحب بكتابة ملاحظاتك من صفحة الشاليه داخل التطبيق وذلك لمزيدا من الارتقاء بخدماتنا'
          },
          token:firebaseToken
        };
         admin.messaging().send(message)
          .then((response) => {
          //Response is a message ID string.
          console.log('Successfully sent message:', response);
           })
          .catch((error) => {
           console.log('Error sending message:', error);
          });
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
          }
        }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
        }
      }else if(reservationStatus === "Payed"){
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
                try{
        const getAllReservations = await Reservations.findAll({
          where:{chaletId:chaletId,reservationStatus:["init","Payed","Booked"]},
        include:{
          model:Users,
         attributes:['id','firstName','lastName','phoneNumber','nationalId','emailAddress','geneder','firebaseToken'],
        }
        });
        if(getAllReservations){
          const message = {
           notification: {
             title: 'تاكيد الحجز المبدئ',
             body: 'عزيزنا العميل نفيدك بانه تم تاكيد حجزك المبدئ نرجو شاكرين  مواصلة اجراءات الحجز'
          },
          token:firebaseToken
        };
         admin.messaging().send(message)
          .then((response) => {
          //Response is a message ID string.
          console.log('Successfully sent message:', response);
           })
          .catch((error) => {
           console.log('Error sending message:', error);
          });
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
      const  chaletId             = req.params.chaletId;
      try{
        const getAllReservations = await Reservations.findAll({
          where:{chaletId:chaletId,reservationStatus:["init","Payed","Booked"]},
        include:{
          model:Users,
         attributes:['id','firstName','lastName','phoneNumber','nationalId','emailAddress','geneder','firebaseToken'],
        }
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

    async createChalet(req,res,next) {
      const  userId                         = req.body.userId;
      const  chaletName                     = req.body.chaletName;
      const  chaletLongtitude               = req.body.chaletLongtitude;
      const  chaletLatitude                 = req.body.chaletLatitude;
      const  chaletServices                 = req.body.chaletServices
      const  ChaletDescriptions             = req.body.ChaletDescriptions
      const  chaletType                     = req.body.chaletType
      const  chaletPriceNormalDay           = req.body.chaletPriceNormalDay
      const  chaletPriceHoliday             = req.body.chaletPriceHoliday
      const  chaletInsurance                = req.body.chaletInsurance
      const  chaletPercentage               = req.body.chaletPercentage;
      const  chaletCapacity                 = req.body.chaletCapacity;
      const  chaletCommison                 = req.body.chaletCommison;
      const  chaletStatus                   = req.body.chaletStatus;
      const  chaletApproval                 = req.body.chaletApproval;

      try{ 
        const result = await Chalets.create({
        userId:userId,
        chaletName:chaletName,
        chaletLongtitude:chaletLongtitude,
        chaletLatitude:chaletLatitude,
        chaletServices:chaletServices,
        ChaletDescriptions:ChaletDescriptions,
        chaletType:chaletType,
        chaletPriceNormalDay:chaletPriceNormalDay,
        chaletPriceHoliday:chaletPriceHoliday,
        chaletInsurance:chaletInsurance,
        chaletPercentage:chaletPercentage,
        chaletCapacity:chaletCapacity,
        chaletCommison:chaletCommison,
        chaletStatus:chaletStatus,
        chaletApproval:chaletApproval
      })
          if(result){
           return res
          .status(201)
          .json({
            meesage:"Chalet Registered Successfully",
          })
        }else{
          return res
          .status(500)
          .json({
            meesage:"please try later",
          })
        }
      }catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
      }
    },
      async updateBankInformation(req,res,next) {
      const  userId                = req.body.userId;
      const  bankName              = req.body.bankName; 
      const  bankAccount           = req.body.bankAccount; 
      const  bankUserName          = req.body.bankUserName; 
       try{
        const updatedBankInfo = await Chalets.update({bankAccount:bankAccount,bankUserName:bankUserName,bankName:bankName},
                {where:{userId:userId}});
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

    async updatePricesAndDiscounts(req,res,next){
      const  userId                = req.body.userId;
      const  chaletId              = req.body.chaletId 
      const  chaletPriceHoliday    = req.body.chaletPriceHoliday;
      const  chaletPriceNormalDay  = req.body.chaletPriceNormalDay;
     
       try{
        const updatedPricesInfo = await Chalets.update({chaletPriceNormalDay:chaletPriceNormalDay,chaletPriceHoliday:chaletPriceHoliday},
                {where:{userId:userId,id:chaletId}});
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

     async updateDiscounts(req,res,next){
      const  userId       = req.body.userId
      const  discount     = req.body.discount;
      const  insurance    = req.body.insurance;
      const  earnest      = req.body.earnest;

       try{
        const updatedPricesInfo = await Chalets.update({chaletPercentage:discount,chaletInsurance:insurance,
          chaletCommison:earnest},
                {where:{userId:userId}});
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

     async getAllUserMessages(req,res,next) {
      try{
        const userMessages = await Inbox.findAll({
        include:{
          model:Chalets,
         attributes:['id','chaletName'],
        }
        });
        if(userMessages){
          return res
          .status(200)
          .json(userMessages);
        }
      }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
        }
    },

     async generateReports(req,res,next) {
           const  chaletId       = req.params.chaletId
           const  startDate      = req.params.startDate;
           const  endDate        = req.params.endDate;
      try{
        const reports = await Reservations.findAll({
        attributes: [
          [sequelize.fn('COUNT',sequelize.col('reservationStatus')),'No_Of_Customers'],
          [sequelize.fn('SUM',sequelize.col('reservationAmount')),'Total_Amount']
        ],
         where:{
              chaletId:chaletId,reservationStatus:["Booked"],reservationStartDate:{ [Op.between]: [startDate, endDate] }
          }
        });
        if(reports){
          return res
          .status(200)
          .json(reports);
        }
      }catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
        }
    },

};
