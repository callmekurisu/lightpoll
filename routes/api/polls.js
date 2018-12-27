const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require('axios')

// Poll model
const Poll = require('../../models/Poll');
// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/poll');

// @route   GET api/polls/test
// @desc    Tests polls route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Polls works' }));

// @route   GET api/polls
// @desc    Get polls
// @access  Public
router.get('/', (req, res) => {
  Poll.find()
    .sort({ date: -1 })
    .then(polls => res.json(polls))
    .catch(err => res.status(404).json({ nopollfound: 'No polls found' }));
});

// @route   GET api/polls/:id
// @desc    Get poll by id
// @access  Public
router.get('/:id', (req, res) => {
  Poll.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopollfound: 'No poll found with that ID' })
    );
});

// @route   POST api/polls
// @desc    Create poll
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const optionsArray = req.body.options.split(",");

    const newPoll = new Poll({
      title: req.body.title,
      options: req.body.options,
      balance: req.body.balance,
      expiration: req.body.expiration,
      topic: req.body.topic,
      public: req.body.public,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    // Check for at least two options
    if(optionsArray.length < 2){
      return res.status(400).json(
        { options: "Must have at least 2 options" }
      );
    }
    else {
      newPoll.save().then(poll => res.json(poll));
    }
  }
);

// @route   DELETE api/polls/:id
// @desc    Delete poll
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Poll.findById(req.params.id)
        .then(poll => {
          // Check for poll owner
          if (poll.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          [poll].remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ pollnotfound: 'No poll found' }));
    });
  }
);

// @route   POST api/polls/like/:id
// @desc    Like poll
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Poll.findById(req.params.id)
        .then(poll => {
          if (
            poll.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' });
          }

          // Add user id to likes array
          poll.likes.unshift({ user: req.user.id });

          poll.save().then(poll => res.json(poll));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No poll found' }));
    });
  }
);

// @route   POST api/polls/unlike/:id
// @desc    Unlike poll
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Poll.findById(req.params.id)
        .then(poll => {
          if (
            poll.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this poll' });
          }

          // Get remove index
          const removeIndex = poll.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          poll.likes.splice(removeIndex, 1);

          // Save
          poll.save().then(poll => res.json(poll));
        })
        .catch(err => res.status(404).json({ polltnotfound: 'No poll found' }));
    });
  }
);

// @route   POST api/poll/comment/:id
// @desc    Add comment to poll
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Poll.findById(req.params.id)
      .then(poll => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        poll.comments.unshift(newComment);

        // Save
        poll.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ pollnotfound: 'No post found' }));
  }
);

// @route   DELETE api/poll/comment/:id/:comment_id
// @desc    Remove comment from poll
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Poll.findById(req.params.id)
      .then(poll => {
        // Check to see if comment exists
        if (
          poll.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        poll.comments.splice(removeIndex, 1);

        poll.save().then(post => res.json(poll));
      })
      .catch(err => res.status(404).json({ pollnotfound: 'No post found' }));
  }
);

// @route   POST /balance/:id
// @desc    Modify poll payout balance
// @access  Private
// Hash reusability bug currently being deterred with AWS Security
router.post(
  '/balance/increase/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Check for minimum of 30 satoshis
    if(req.body.amount < 30) {
      res.status(400).json({
        payment: "Minimum of 30 satoshis required"
      })
    } else {
    Poll.findById(req.params.id)
      .then(poll => {
        // Check if a balance was added to the poll before
        if(poll.paying === true){
          res.status(404).json({
            payment: "Poll balance can only be set once"
          })
        } else {
        // check lnd for paid invoice
        axios.get(
          `http://gotcode.hopto.org/verify/${req.body.hash}`
        )
          .then(response => {
            if(response.data.settled === false && poll.paying === false){
              res.status(404).json({
                payment: "Payment not found"
              })
            } else if(response.data.value !== req.body.amount && poll.paying === false){
                res.status(404).json({
                  payment: "Payment does not match invoice"
                })
              } else {
                // Set poll to paying mode. Payments can't be added again
                poll.paying = true;
                // Set balance to amount of invoice
                poll.balance = parseInt(poll.balance)+parseInt(req.body.amount);
                poll.save().then(post => res.json(post));
              }
          })
          .catch(err => {
            res.status(404).json({
              payment: "Bad payment request sent"
            })
            console.log("Something went wrong with the hash probably...");
          });
        }
      })
      .catch(err => 
        res.status(404).json({ 
          pollnotfound: 'No poll found' 
      }));
    }
  }
);

// @route   POST /vote/:id/:option
// @desc    Vote on a poll option
// @access  Private
router.post(
  '/vote/:id/:choice',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Poll.findById(req.params.id)
        .then(poll => {
          if (
            poll.votes.filter(vote => vote.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyvoted: 'User already voted on this post' });
          }

          // Add user id to likes array
          poll.votes.unshift({ user: req.user.id, choice: req.params.choice });
          poll.save().then(poll => res.json(poll));
        })
        .catch(err => res.status(404).json({ pollnotfound: `${err}` }));
    });
  }
);
module.exports = router;
