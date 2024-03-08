const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    points: {
      type: Number,
      default: function() {
        // Generate a random integer between 0 and 100
        return Math.floor(Math.random() * 101);
      }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User