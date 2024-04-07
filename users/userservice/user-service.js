// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const R = require('ramda');

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

app.get('/rankings/:filter', async (req, res) => {
  try {
    /* const { token } = req.cookies
    const decoded = jwt.verify(token, 'your-secret-key')
    const userId = decoded.userId
    const loggedUser = await User.findById(userId)
    const userRanking = getRankingFor(loggedUser) */

    const category = req.params.filter;
    const usersRanking = (await User.find());
    const ascendingUsers = R.sortBy(R.prop("ranking." + category + ".points"), usersRanking);
    const sortedUsers = R.reverse(ascendingUsers);
    const sortedRanking = sortedUsers.map( (user, index) => {
      return {
        // User global data
        name: user.username,
        position: index+1,
        points: user.ranking[category].points,
        questions: user.ranking[category].questions,
        correct: user.ranking[category].correct,
        wrong: user.ranking[category].wrong
      }
    })

    //res.json(userRanking, usersRanking)
    res.json(sortedRanking)
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
})


 app.post("/addpoints", async (req, res) => {
  const username = req.body.username;
  const category = req.body.category;
  const correct = req.body.correct;


  try {
     validateRequiredFields(req, ['username','category','correct']);
     const user = await User.findOne({
       username: req.body.username
     });
     if (!user) {
       throw new Error('User not found');
     }

     // updates global and category questions
     user.ranking.global.questions += 1;
     user.ranking[category].questions += 1;


     // Answer is correct
     if ( correct === "true"){
      user.ranking[category].points += 1;
      user.ranking[category].correct += 1;
      user.ranking.global.points += 1;
      user.ranking.global.correct += 1;
     }
     else{ // Answer is wrong
      user.ranking[category].wrong += 1;
      user.ranking.global.wrong += 1;
     }

     await user.save();
     res.status(200).json(user);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 });

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
        res.status(200).json(newUser);
    } catch (error) {
      console.log(error)
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