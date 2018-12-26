const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Load User model
const User = require('../../models/User');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validations
const validateRegisterInput = require('../../validation/register');
// @route GET api/user/test
// @desc Tests user route
// @access Public
router.get('/test', (req,res) => res.json({
    msg: "Users works"
}));

// @route  GET api/users/register
// @desc   register user
// @access Public
router.post('/register', (req,res)=> {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if(user) {
        return res.status(400).json({email: 'Email already exists'});
      } else {
          const avatar = gravatar.url(req.body.email , {
            s: '200',  // size
            r: 'pg', // Rating
            d: 'mm'  // Default
          });

          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            avatar,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              })
          })
      }
    });
});

// @route GET api/user/login
// @desc Login User / Returning JWT
// @access Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //  find user by email
  User.findOne({email})
    .then(user => {
      // Check for user
      if(!user) {
        return res.status(404).json({email: 'User not found'});
      }
      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            // User matched
            const payload = {id: user.id, username: user.username, avatar: user.avatar} // Create jwt payload
            // Sign the token
            jwt.sign(payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                 res.json({
                   success: true,
                   token: `Bearer ${token}`
                 })
            });
          } else {
            return res.status(400).json({password: 'Password incorrect'})
          }
        });
    });
});

// @route GET api/user/current
// @desc Return the current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email
  });
});

module.exports = router;