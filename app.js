const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const CronJob = require('cron').CronJob;
const {Reservations,Users} = require('./models');
const { Op } = require('sequelize');
const admin = require('firebase-admin');
const sequelize = require('sequelize');

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
//     console.log('Every Tenth Minute:',updatedBooking)
// }catch (error) {
//     console.log('error:',error)
// }
// });
// job.start();


//cron job to send notifications to init booking users
// const  registrationToken =
//   'eeQxiZBaSWesj4cbxOdlLV:APA91bGogCZI_rffUBcS0L1dIiZSjOk8omSRjW6JKBgRhGfyhoPauwGCgHC6Xwx1EiDPsZVJm1l14S6TB8Z01kJ1gR8e73Uv3YNdcYGSbXF5t7muII5-0Fos9oFPaFo3-Jt1x8MWgQ_D'

// const message = {
//   notification: {
//     title: 'test title',
//     body: 'test body'
//   },
//   token: registrationToken
// };
// [Op.gt]:moment().subtract(10, 'hours').toDate()

// const job = new CronJob('1 * * * * *',async function() {
//   try{
//   const usersTokens =  await Users.findAll({ 
//         attributes: ['firebaseToken']
//       })
//   const registrationTokens = usersTokens.map(obj => obj.firebaseToken);
  
//   const message = {
//   notification: {
//     title: 'test title',
//     body: 'test body'
//   },
//   tokens:registrationTokens
//   };
  
//   console.log('message',message);

//   admin.messaging().sendMulticast(message)
//   .then((response) => {
//     if (response.failureCount > 0) {
//       const failedTokens = [];
//       response.responses.forEach((resp, idx) => {
//         if (!resp.success) {
//           failedTokens.push(registrationTokens[idx]);
//         }
//       });
//       console.log('List of tokens that caused failures: ' + failedTokens);
//     }
//   });

//    }catch (error) {  
//        console.log('error:',error)
//   }

// }); 
// job.start();


const job = new CronJob('1 * * * * *',async function() {
  try{
  const reservationInThePassedTenHours =  await Reservations.findAll({ 
  attributes: ['reservationStartDate','reservationStatus'],
  where:{reservationStatus:["payed","init"]},
  include: [{
    model: Users, attributes: ['firebaseToken']
  }],
  raw : true
 });

   const listOfDates =  reservationInThePassedTenHours.map(items => items.reservationStartDate)

   const filterlist = reservationInThePassedTenHours.filter((item,index) => 
   item.reservationStatus == "payed" && listOfDates.indexOf(item.reservationStartDate) != index);

  console.log('filterlist',filterlist)



  
  

  // reservationInThePassedTenHours.indexof(item.reservationStartDate) === index);
  

  // reservationInThePassedTenHours.map((item,index)=>{
  //      if(item.reservationStatus == "payed") {
  //        console.log('update status to cancelled');
  //      } 
  //      if(item.reservationStatus == "init") {
  //       console.log('add all thier ids to an arrays');
  //     }       
  //  })

  }catch (error) {  
       console.log('error:',error)
  }

}); 
job.start();
  

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is Listening To Port ${process.env.PORT}`);
});

