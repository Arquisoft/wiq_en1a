const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';

function parseCookies(response) {
  const cookies = {};
  const cookieHeader = response.headers['set-cookie']

  if (cookieHeader) {
      const cookieStrings = Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader];
      for (const cookieString of cookieStrings) {
          const [name, value] = cookieString.split(';')[0].split('=');
          cookies[name.trim()] = value.trim();
      }
  }

  return cookies;
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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
    const cookies = parseCookies(authResponse)
    const token = cookies.token
    res.cookie('token', token)
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

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
