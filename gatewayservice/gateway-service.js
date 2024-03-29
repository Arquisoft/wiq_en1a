const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const questionServiceUrl = process.env.QUESTION_SERVICE_URL || 'http://localhost:8010';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});


app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get('/flags/question', async (req, res) => {
  try {
    // Forward the request to the question service
    const questionResponse = await axios.get(questionServiceUrl+'/flags/question', req.body);
    res.json(questionResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/flags/answer', async (req, res) => {
  try {
    const answer = req.body.answer;
    // Forward the request to the question service
    const questionResponse = await axios.post(questionServiceUrl+'/flags/answer', answer, { headers: {'Content-Type': 'text/plain'} });
    res.json(questionResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});


app.get('/self', async (req, res) => {
  try {
    // Forward the self request to the user service
    
    const userResponse = await axios.get(authServiceUrl+'/self', {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    res.status(200).json(userResponse.data);
  } catch (error) {
res.status(error.response.status).json({ error: error.response.data.error });
 }
});
app.get('/rankings', async (req, res) => {
  try {
    // Forward the request to the user service
    const userResponse = await axios.get(userServiceUrl+'/rankings', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
