const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/user');
const profile = require('./routes/api/profile');
const polls = require('./routes/api/polls');
const passport = require('passport');
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
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

