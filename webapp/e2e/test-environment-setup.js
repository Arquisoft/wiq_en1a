const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../users/userservice/user-model');
const axios = require('axios');


let mongoserver;
let userservice;
let authservice;
let gatewayservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();

    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");

    // Add test user
    await addUser('testUser', 'test@email', 'testpass');

  }

  async function addUser(username, email, password) {
    try {
        const response = await axios.post('http://localhost:8001/adduser', {
            username: username,
            email: email,
            password: password
        });
    } catch (error) {
        console.error('Error adding user:', error.response.data);
    }
}

  

  startServer();
