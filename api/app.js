// Description: Entry point for the APIs
// Author: AshwinSathian

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/dev.json');

const userAuthRoutes = require('./routes/userAuth');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// app.use(function(req, res, next){
//   var checkIp = require('check-ip')
//   var response = checkIp(req.headers.host.split(':')[0])
//   if (response.isValid) {
//     next()
//   } else {
//       const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
//         parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
//           (parseInt(req.get('x-forwarded-port'), 10) === parseInt(req.get('x-forwarded-port'), 10))
  
//       if (isNotSecure) {
//         return res.redirect(301, 'https://' + req.get('host') + req.url)
//       }
//      next()
//    }
// })

// Database Connection
mongoose.connect(config.db.connString, { useNewUrlParser: true })
.then(() => {
  console.log('Database Connection Successful');
})
.catch((err) => {
  console.log('Database Connection Failed');
});

// mongoose.connect('mongodb://localhost:27017/eventManagement')
// .then(() => function() {
//   console.log('Database Connection Successful');
// })
// .catch((err) => function() {
//   console.log('Database Connection Failed');
// });

// User Authentication Route
app.use('/api/auth', userAuthRoutes);

const server = app.listen(3000);