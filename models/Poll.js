const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PollSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  options: {
    type: [String],
    required: true
  },
  votes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      choice: {
        type: Number
      }
    }
  ],
  title: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  expiration: {
    type: Date,
    default: null
  },
  public: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  },
  paying: {
    type: Boolean,
    default: false
  },
  topic: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Poll = mongoose.model('polls', PollSchema);
