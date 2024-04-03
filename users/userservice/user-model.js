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
      total_points: {
        type: Number,
        default: 0,
      },
      total_questions: {
        type: Number,
        default: 0,
      },
      total_correct: {
        type: Number,
        default: 0,
      },
      total_wrong: {
        type: Number,
        default: 0,
      },

      score_flags: {
        points_flags: {
          type: Number,
          default: 0,
        },
        questions_flags: {
          type: Number,
          default: 0,
        },
        correct_flags: {
          type: Number,
          default: 0,
        },
        wrong_flags: {
          type: Number,
          default: 0,
        },
      },
      score_cities: {
        points_cities: {
          type: Number,
          default: 0,
        },
        questions_cities: {
          type: Number,
          default: 0,
        },
        correct_cities: {
          type: Number,
          default: 0,
        },
        wrong_cities: {
          type: Number,
          default: 0,
        },
      },
      score_monuments: {
        points_monuments: {
          type: Number,
          default: 0,
        },
        questions_monuments: {
          type: Number,
          default: 0,
        },
        correct_monuments: {
          type: Number,
          default: 0,
        },
        wrong_monuments: {
          type: Number,
          default: 0,
        },
      },
      score_tourist: {
        points_tourist: {
          type: Number,
          default: 0,
        },
        questions_tourist: {
          type: Number,
          default: 0,
        },
        correct_tourist: {
          type: Number,
          default: 0,
        },
        wrong_tourist: {
          type: Number,
          default: 0,
        },
      },
      score_foods: {
        points_foods: {
          type: Number,
          default: 0,
        },
        questions_foods: {
          type: Number,
          default: 0,
        },
        correct_foods: {
          type: Number,
          default: 0,
        },
        wrong_foods: {
          type: Number,
          default: 0,
        },
      },
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User