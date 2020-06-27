const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const CronJob = require('cron').CronJob;
const {Reservations} = require('./models');
const { Op } = require('sequelize');
const admin = require('firebase-admin');


var serviceAccount = require("/home/etegani/my-project23-1575077857759-firebase-adminsdk-rllhp-7247dd9f34.json");

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


//cron job to canceled all resservation that happened in the last 10 h
// const job = new CronJob('* * * * * *',function() {
//   try{
//     const updatedBooking = Reservations.update({
//     reservationStatus:"Canceled"},{where:{reservationStatus:"payed",createdAt:{
//         [Op.gt]: new Date(Date.now() - (60 * 60 * 1000))
//     }}});
//     console.log('Date:',new Date(Date.now() - (60 * 60 * 1000)))
// }catch (error) {
//     console.log('error:',error)
// }
// });
// job.start();


//cron job to send notifications to init booking users
const  registrationToken =
  'eeQxiZBaSWesj4cbxOdlLV:APA91bGogCZI_rffUBcS0L1dIiZSjOk8omSRjW6JKBgRhGfyhoPauwGCgHC6Xwx1EiDPsZVJm1l14S6TB8Z01kJ1gR8e73Uv3YNdcYGSbXF5t7muII5-0Fos9oFPaFo3-Jt1x8MWgQ_D'

var message = {
  notification: {
    title: '$GOOG up 1.43% on the day',
    body: 'عزيزي العميل نرجو دفع عربون لمواصلة اجراء حجزك'
  },
  token: registrationToken
};

const job = new CronJob('* 2 * * * *',function() {
   admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    })
}); 
job.start();
  


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is Listening To Port ${process.env.PORT}`);
});

