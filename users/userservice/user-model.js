const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },

    ranking: {
      global: {
        points: {
          type: Number,
          default: 0,
        },
        questions: {
          type: Number,
          default: 0,
        },
        correct: {
          type: Number,
          default: 0,
        },
        wrong: {
          type: Number,
          default: 0,
        },
      },

      flags: {
        points: {
          type: Number,
          default: 0,
        },
        questions: {
          type: Number,
          default: 0,
        },
        correct: {
          type: Number,
          default: 0,
        },
        wrong: {
          type: Number,
          default: 0,
        },
      },

      cities: {
        points: {
          type: Number,
          default: 0,
        },
        questions: {
          type: Number,
          default: 0,
        },
        correct: {
          type: Number,
          default: 0,
        },
        wrong: {
          type: Number,
          default: 0,
        },
      },

      monuments: {
        points: {
          type: Number,
          default: 0,
        },
        questions: {
          type: Number,
          default: 0,
        },
        correct: {
          type: Number,
          default: 0,
        },
        wrong: {
          type: Number,
          default: 0,
        },
      },

      tourist_attractions: {
        points: {
          type: Number,
          default: 0,
        },
        questions: {
          type: Number,
          default: 0,
        },
        correct: {
          type: Number,
          default: 0,
        },
        wrong: {
          type: Number,
          default: 0,
        },
      },

      foods: {
        points: {
          type: Number,
          default: 0,
        },
        questions: {
          type: Number,
          default: 0,
        },
        correct: {
          type: Number,
          default: 0,
        },
        wrong: {
          type: Number,
          default: 0,
        },
      },
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User