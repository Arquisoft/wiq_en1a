// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const User = require('./user-model')

const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wiq-en1a-users';
mongoose.connect(mongoUri);



// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
}

// Function to get the user's ranking data
async function getRankingFor(loggedUser) {
  const users = await User.find().sort({points: -1})
  const ranking = users.indexOf( (user) => user._id == loggedUser._id)

  return { ranking: ranking, points: loggedUser.points, user: loggedUser.username }
}

app.get('/rankings', async (req, res) => {
  try {
    /* const { token } = req.cookies
    const decoded = jwt.verify(token, 'your-secret-key')
    const userId = decoded.userId
    const loggedUser = await User.findById(userId)
    const userRanking = getRankingFor(loggedUser) */
    const usersRanking = (await User.find().sort({points: -1})).map( (user, index) => {
      return { 
        ranking: index+1, 
        points: user.points, 
        user: user.username }
    })

    //res.json(userRanking, usersRanking)
    res.json(usersRanking)
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
})


// app.post("/addpoints", async (req, res) => {
//   try {
//     validateRequiredFields(req, ['username']);
//     const user = await User.findOne({
//       username: req.body.username
//     });
//     if (!user) {
//       throw new Error('User not found');
//     }
//     user.points += 1;
//     await user.save();
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

app.post('/adduser', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['username','email', 'password']);

        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }});

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});



// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server