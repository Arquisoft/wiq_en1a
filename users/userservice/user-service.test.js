const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service');
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      username: 'testuser',
      email: 'test@test.com',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should prevent creating a new user with wrong data on POST /adduser', async () => {
    const newUser = {

      email: 'test@test.com',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
  });

  it('should add a point to a user on POST /addpoints', async () => {
    const points = {
      username: 'testuser',
      category: 'flags',
      correct: 'true',
    };
    const newUser = {
      username: 'testuser',
      email: 'test@test.com',
      password: 'testpassword',
    };

    const newRequest = await request(app).post('/adduser').send(newUser);
    const response = await request(app).post('/addpoints').send(points);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should add a wrong question to a user on POST /addpoints', async () => {
    const points = {
      username: 'testuser',
      category: 'flags',
      correct: 'false',
    };
    const newUser = {
      username: 'testuser',
      email: 'test@test.com',
      password: 'testpassword',
    };

    const newRequest = await request(app).post('/adduser').send(newUser);
    const response = await request(app).post('/addpoints').send(points);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should prevent adding points to a user with wrong data on POST /addpoints', async () => {
    const points = {
      username: 'testuser',
      category: 'fail',
    };
    const newUser = {
      username: 'testuser',
      email: 'test@test.test',
      password: 'testpassword',
    };
    const newRequest = await request(app).post('/adduser').send(newUser);
    const response = await request(app).post('/addpoints').send(points);
    expect(response.status).toBe(400);
  });

  it("should show a user's ranking on a category GET /rankings/:filter", async () => {
    const response = await request(app).get('/rankings/flags');
    expect(response.status).toBe(200);
    expect(response.body);
  });
});
