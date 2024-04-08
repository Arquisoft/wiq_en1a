const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

// Define a function to generate mocked responses based on the URL
const generateMockResponse = (url, items) => {
  if (url.endsWith('/question')) {
    return Promise.resolve({
      data: {
        questionData: {
          items: items
        }
      }
    });
  }
};



describe('Gateway Service', () => {
  const mockUserData = [
    { 
      username: 'user1',
      ranking: {
        category1: { points: 100, questions: 10, correct: 8, wrong: 2 },
        category2: { points: 90, questions: 10, correct: 7, wrong: 3 }
      }
    },
    { 
      username: 'user2',
      ranking: {
        category1: { points: 80, questions: 10, correct: 6, wrong: 4 },
        category2: { points: 70, questions: 10, correct: 5, wrong: 5 }
      }
    }
  ];
  
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } 
    else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    } 
    else if (url.endsWith('/imgs/answer')) {
      // Simulate response from question service based on request data
      if (data.question === 'expected_question' && data.answer === 'expected_answer') {
        return Promise.resolve({ data: { correct: 'true' } });
      } else {
        return Promise.resolve({ data: { correct: 'false', associate: 'expected_associate' } });
      }
    }
  });

  axios.get.mockImplementation((url) => {
    if (url.endsWith('/imgs/flags/question')) {
      return generateMockResponse(url, [
        { item: 'Flag0', itemLabel: 'Country0', image: 'flag0.jpg' },
        { item: 'Flag1', itemLabel: 'Country1', image: 'flag1.jpg' },
      ]);
    } else if (url.endsWith('/imgs/cities/question')) {
      return generateMockResponse(url, [
        { item: 'City0', itemLabel: 'Country0', image: 'city0.jpg' },
        { item: 'City1', itemLabel: 'Country1', image: 'city1.jpg' },
      ]);
    } else if (url.endsWith('/imgs/monuments/question')) {
      return generateMockResponse(url, [
        { item: 'Monum0', itemLabel: 'Country0', image: 'monum0.jpg' },
        { item: 'Monum1', itemLabel: 'Country1', image: 'monum1.jpg' },
      ]);
    } else if (url.endsWith('/imgs/tourist_attractions/question')) {
      return generateMockResponse(url, [
        { item: 'TAtract0', itemLabel: 'Country0', image: 'tatract0.jpg' },
        { item: 'TAtract1', itemLabel: 'Country1', image: 'tatract1.jpg' },
      ]);
    } else if (url.endsWith('/imgs/foods/question')) {
      return generateMockResponse(url, [
        { item: 'Food0', itemLabel: 'Plate0', image: 'food0.jpg' },
        { item: 'Food1', itemLabel: 'Plate1', image: 'food1.jpg' },
      ]);
    } else if (url.endsWith('/rankings/category1')) {
      return Promise.resolve({ data: mockUserData });
    }

  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  const testEndpoint = async (category, expectedItems) => {
    const response = await request(app)
      .get(`/imgs/${category}/question`);
  
    // Verify response status code
    expect(response.statusCode).toBe(200);
    
    // Verify response body structure and content
    expect(response.body.questionData).toBeDefined();
    expect(response.body.questionData.items).toHaveLength(expectedItems.length);
  
    // Iterate over items
    expectedItems.forEach((expectedItem, index) => {
      expect(response.body.questionData.items[index].item).toBe(expectedItem.item);
      expect(response.body.questionData.items[index].itemLabel).toBe(expectedItem.itemLabel);
      expect(response.body.questionData.items[index].image).toBe(expectedItem.image);
    });
  };
  
  // Test /imgs/flags/question endpoint
  it('should forward get Flags request to question service', async () => {
    await testEndpoint('flags', [
      { item: 'Flag0', itemLabel: 'Country0', image: 'flag0.jpg' },
      { item: 'Flag1', itemLabel: 'Country1', image: 'flag1.jpg' },
    ]);
  });
  
  // Test /imgs/cities/question endpoint
  it('should forward get Cities request to question service', async () => {
    await testEndpoint('cities', [
      { item: 'City0', itemLabel: 'Country0', image: 'city0.jpg' },
      { item: 'City1', itemLabel: 'Country1', image: 'city1.jpg' },
    ]);
  });


  // Test /imgs/monuments/question endpoint
it('should forward get Monuments request to question service', async () => {
  await testEndpoint('monuments', [
    { item: 'Monum0', itemLabel: 'Country0', image: 'monum0.jpg' },
    { item: 'Monum1', itemLabel: 'Country1', image: 'monum1.jpg' },
  ]);
});

// Test /imgs/tourist_attractions/question endpoint
it('should forward get Tourist Attractions request to question service', async () => {
  await testEndpoint('tourist_attractions', [
    { item: 'TAtract0', itemLabel: 'Country0', image: 'tatract0.jpg' },
    { item: 'TAtract1', itemLabel: 'Country1', image: 'tatract1.jpg' },
  ]);
});

// Test /imgs/foods/question endpoint
it('should forward get Foods request to question service', async () => {
  await testEndpoint('foods', [
    { item: 'Food0', itemLabel: 'Plate0', image: 'food0.jpg' },
    { item: 'Food1', itemLabel: 'Plate1', image: 'food1.jpg' },
  ]);
});

  // Test /imgs/answer endpoint, when true
  it('should forward answer request to question service and return correct response', async () => {
    // Simulate request data
    const requestData = {
      answer: 'expected_answer',
      username: 'testuser',
      category: 'testcategory',
      question: 'expected_question'
    };

    // Send POST request to gateway endpoint
    const response = await request(app)
      .post('/imgs/answer')
      .send(requestData);

    // Verify response status code
    expect(response.statusCode).toBe(200);

    // Verify response body
    expect(response.body).toEqual({ correct: 'true' });
  });

  // Test /imgs/answer endpoint, when false
  it('should forward answer request to question service and return correct response', async () => {
    // Simulate request data
    const requestData = {
      answer: 'expected_answer',
      username: 'testuser',
      category: 'testcategory',
      question: 'expected_question'
    };

    // Send POST request to gateway endpoint
    const response = await request(app)
      .post('/imgs/answer')
      .send(requestData);

    // Verify response status code
    expect(response.statusCode).toBe(200);

    // Verify response body
    expect(response.body).toEqual({ correct: 'true' });
  });

  it('should forward answer request to question service and return incorrect response', async () => {
    // Simulate request data
    const requestData = {
      answer: 'incorrect_answer',
      username: 'testuser',
      category: 'testcategory',
      question: 'expected_question'
    };

    // Send POST request to gateway endpoint
    const response = await request(app)
      .post('/imgs/answer')
      .send(requestData);

    // Verify response status code
    expect(response.statusCode).toBe(200);

    // Verify response body
    expect(response.body).toEqual({ correct: 'false', associate: 'expected_associate' });
  });

  // Test /rankings/:filter endpoint
  it('should forward get rankings request to user service and return sorted rankings', async () => {
    // Simulate request data
    const filter = 'category1';
  
    // Send GET request to gateway endpoint
    const response = await request(app)
      .get(`/rankings/${filter}`);
  
    expect(response.statusCode).toBe(200);
  
    expect(response.body).toHaveLength(mockUserData.length);
    expect(response.body[0].username).toBe('user1'); 
    expect(response.body[1].username).toBe('user2'); 
    
    expect(response.body[0].ranking.category1.points).toBe(100);
    expect(response.body[0].ranking.category1.questions).toBe(10);
    expect(response.body[0].ranking.category1.correct).toBe(8);
    expect(response.body[0].ranking.category1.wrong).toBe(2);
  
    expect(response.body[1].ranking.category1.points).toBe(80);
    expect(response.body[1].ranking.category1.questions).toBe(10);
    expect(response.body[1].ranking.category1.correct).toBe(6);
    expect(response.body[1].ranking.category1.wrong).toBe(4);
  
  });



});