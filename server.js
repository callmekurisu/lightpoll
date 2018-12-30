const keys = require('./config/keys');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/user');
const profile = require('./routes/api/profile');
const polls = require('./routes/api/polls');
const passport = require('passport');
const app = express();
// This app requires cors
const cors = require('cors');
const corsOptions = {
  origin: keys.DEV_CLIENT,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Mongoose Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport.js')(passport);

// User Routes
app.use('/api/users',users);
app.use('/api/profile', profile);
app.use('/api/polls', polls);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Port ${port} is online`));

