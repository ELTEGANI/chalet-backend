const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const CronJob = require('cron').CronJob;
const {Reservations,Users} = require('./models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const admin = require('firebase-admin');

var serviceAccount = require("/home/firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://booking-chalets.firebaseio.com"
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
      //update the status to cancelled reservation that exceeds 3 hours
     const updatedBooking = Reservations.update({
     reservationStatus:"Canceled"},{where:{reservationStatus:"Payed",createdAt:{
         [Op.gt]: new Date(Date.now() - (10800000))
     }}});
     console.log('updatedBooking:',updatedBooking)
      }catch (error) {
      console.log('error:',error)
      }
});

job.start();
  

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is Listening To Port ${process.env.PORT}`);
});

