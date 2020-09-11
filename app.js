const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const CronJob = require('cron').CronJob;
const {Reservations,Users} = require('./models');
const { Op } = require('sequelize');
const admin = require('firebase-admin');
const sequelize = require('sequelize');

var serviceAccount = require("/home/firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-project23-1575077857759.firebaseio.com"
});

// set routes
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute')
// init express
const app = express();
// app.use(helmet());

app.use(bodyParser.json());// application/json

// setup CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use('/api/user',userRoute);
app.use('/api/admin',adminRoute);


app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({
    message,
    data,
  });
});

   const job = new CronJob('* 3 * * * *',async function() {
    try{
     const reservationInThePassedTenHours =  await Reservations.findAll({ 
     attributes: ['reservationStartDate','reservationStatus'],
     where:{reservationStatus:["Payed","init"]},
     include:[{
      model: Users, 
      attributes:['firebaseToken']
      }],
     raw : true,
     required: true
     });

    //filter users tokens
    const filterdUserfirebaseToken = (reservationInThePassedTenHours.filter(item => 
    item.reservationStatus == "Payed" && reservationInThePassedTenHours.map(items => items.reservationStartDate)
    .includes(item.reservationStartDate)));

      //update the status to canceled
      try{
     const updatedBooking = Reservations.update({
     reservationStatus:"Canceled"},{where:{reservationStatus:"Payed",createdAt:{
         [Op.gt]: new Date(Date.now() - (60 * 60 * 10000))
     }}});
     console.log('updatedBooking:',updatedBooking)
      }catch (error) {
      console.log('error:',error)
      }
   
     //send notifications to other users
      const message = {
       notification: {
      title: 'حجز شاليهات',
      body: 'عزيزي العميل نرجو شاكرين تكملة اجراءات الحجز'
        },
       tokens: filterdUserfirebaseToken.map(token=>token['User.firebaseToken'])
     };

      admin.messaging().sendMulticast(message)
     .then((response) => {
     if (response.failureCount > 0) {
       const failedTokens = [];
       response.responses.forEach((resp, idx) => {
        if (!resp.success) {
           failedTokens.push(registrationTokens[idx]);
         }
       });
       console.log('List of tokens that caused failures: ' + failedTokens);
     }
   });

    }catch (error) {  
        console.log('error:',error)
    }
}); 

job.start();
  

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is Listening To Port ${process.env.PORT}`);
});

