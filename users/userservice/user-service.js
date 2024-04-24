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

// Get the ranking list for a specified category
app.get('/rankings/:filter', async (req, res) => {
  try {
    const category = req.params.filter;
    const usersRanking = (await User.find()).sort((a, b) => b.ranking[category].points - a.ranking[category].points)
    .map((user, index) => {
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

    if (usersRanking.length == 0 || usersRanking == null || usersRanking == undefined)
      res.status(400).json("Error: category not found")
    else
      res.status(200).json(usersRanking)
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
})


// Get the ranking info for a specified category and user
app.get('/ranking/user', async (req, res) => {
  const username = req.query.username;
  const category = req.query.category;

  try {
    // Fetch the user with the specified username
    const user = await User.findOne({ username });
    
    // If user not found, return error
    if (!user) {
      return res.status(400).json("Error: User not found");
    }

    // Extract ranking info for the specified category
    const rankingInfo = {
      username: user.username,
      category,
      points: user.ranking[category].points,
      questions: user.ranking[category].questions,
      correct: user.ranking[category].correct,
      wrong: user.ranking[category].wrong
    };

    res.status(200).json(rankingInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



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