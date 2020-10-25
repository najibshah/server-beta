const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//point to the routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const videos = require('./routes/api/videos');
const competitions = require('./routes/api/competitions');
const entries = require('./routes/api/entries');
const results = require('./routes/api/results');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Enable CORS (Cross Origin Resource Sharing)
// https://enable-cors.org/server_expressjs.html
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', function (req, res, next) {
  // Handle the get for this route
});

app.post('/', function (req, res, next) {
  // Handle the post for this route
});

//DB config
const db = require('./config/keys').mongoURI;

//connect to mongoDB through mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
/*(node:1309) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
|| To fix this error use ->
mongoose.connect(db, {useNewUrlParser:true}) instead of mongoose.connect(db). */

//Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/videos', videos);
app.use('/api/competitions', competitions);
app.use('/api/entries', entries);
app.use('/api/results', results);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

// PACKAGE.JSON
/*   "client-install": "npm install --prefix client",
 on github, run npm run client-install.*/
/* "dev": "concurrently \"npm run server\" \"npm run client\""
this wil run both server and react server.  */
