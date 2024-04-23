const request = require('supertest');
const axios = require('axios');
const app = require('./question-service'); 

afterAll(async () => {
    app.close();
  });

// Mock the fetch function
global.fetch = jest.fn();
// Mock axios
jest.mock('axios');

var imgsToAssociatesMap = new Map()

// Mock responses from external services
jest.spyOn(global, 'fetch').mockImplementation(() => {
    let result = { results: {bindings: []}  }
    for(let i=1;i<=100;i++){
        //Simulating there is maximum number of repeated itemLabels (between the valid ones)
        result.results.bindings.push({itemLabel: {value: "itemName"+i} , image:{value: "imageUrl1_"+i}})
        imgsToAssociatesMap.set("imageUrl1_"+i, "itemName"+i)
    }
    for(let i=101;i<=195;i++){
        //Simulating there are invalid itemLabels
        result.results.bindings.push({itemLabel: {value: "Q"+i} , image:{value: "imageUrl"}})
    }
    result.results.bindings.push({itemLabel: {value: "Q"} , image:{value: "imageUrl"}})
    for(let i=1;i<=4;i++){
        //Chosen elements (One of them will be one of the 196 elems with itemLabel 'itemName1' and 'imageUrlX')
        result.results.bindings.push({itemLabel: {value: "itemName"+i} , image:{value: "imageUrl"+i}})
        imgsToAssociatesMap.set("imageUrl"+i,"itemName"+i)
    }
    return Promise.resolve({ json: () => Promise.resolve(result) });
});

describe('Question Service', () => {
    axios.post.mockImplementation((url, data) => {
        if (url.endsWith('/addpoints')) {
            if(data.correct=="true"){
                return Promise.resolve({ response: "Correct answer handled" });
            } else if (data.correct=="false"){
                return Promise.resolve({ response: "Incorrect answer handled" });
            }
            return Promise.resolve({ response: "Something went wrong" });
        } 
    });

    // Test /imgs/flags/question endpoint
    it('should return a flags question with 4 images as options', async () => {
        const response = await request(app).get('/imgs/flags/question');
        const itemLabelsSet = getItemLabelsIfDifferent(response.body.images);
        
        checkInvalidElementsNotChosen(itemLabelsSet);
        checkQuestionValidity("Which of the following flags belongs to",response.body.question, itemLabelsSet);
    });

    // Test /imgs/cities/question endpoint
    it('should return a cities question with 4 images as options', async () => {
        const response = await request(app).get('/imgs/cities/question');
        const itemLabelsSet = getItemLabelsIfDifferent(response.body.images);
        checkInvalidElementsNotChosen(itemLabelsSet);
        checkQuestionValidity("Which of the following images corresponds to",response.body.question, itemLabelsSet);
    });

    // Test /imgs/monuments/question endpoint
    it('should return a monuments question with 4 images as options', async () => {
        const response = await request(app).get('/imgs/monuments/question');
        const itemLabelsSet = getItemLabelsIfDifferent(response.body.images);
        checkInvalidElementsNotChosen(itemLabelsSet);
        checkQuestionValidity("Which of the following images corresponds to",response.body.question, itemLabelsSet);
    });

    // Test /imgs/tourist_attractions/question endpoint
    it('should return a tourist attractions question with 4 images as options', async () => {
        const response = await request(app).get('/imgs/tourist_attractions/question');
        const itemLabelsSet = getItemLabelsIfDifferent(response.body.images);
        checkInvalidElementsNotChosen(itemLabelsSet);
        checkQuestionValidity("Which of the following images corresponds to",response.body.question, itemLabelsSet);
    });

    // Test /imgs/foods/question endpoint
    it('should return a foods question with 4 images as options', async () => {
        const response = await request(app).get('/imgs/foods/question');
        const itemLabelsSet = getItemLabelsIfDifferent(response.body.images);
        checkInvalidElementsNotChosen(itemLabelsSet);
        checkQuestionValidity("Which of the following images corresponds to",response.body.question, itemLabelsSet);
    });

    // Test /imgs/answer endpoint (Correct answer)
    it('should inform if the answer is correct', async () => {
        //First I ask a question
        const response = await request(app).get('/imgs/foods/question');
        regex = new RegExp(`Which of the following images corresponds to (\\w+)\\?`);
        const match = response.body.question.match(regex);
        const correctAnswerLabel = match && match[1];
        //I get and send the correct answer
        let correctImage
        let counter = 0
        while(true){
            if(correctAnswerLabel==imgsToAssociatesMap.get(response.body.images[counter])){
                correctImage = response.body.images[counter]
                break;
            }
            counter++
        }
        question = response.body.question
        const responseAnswer = await request(app)
            .post("/imgs/answer")
            .set('Content-Type', 'application/json')
            .send({answer:correctImage, question:question, username:"username", category:"foods"})
        expect(responseAnswer.body.correct).toBe("true")
    });

    //Test /imgs/answer endpoint (Incorrect answer)
    it('should inform the answer is incorrect and what is the correct answer', async () => {
        //First I ask a question
        const response = await request(app).get('/imgs/foods/question');
        regex = new RegExp(`Which of the following images corresponds to (\\w+)\\?`);
        const match = response.body.question.match(regex);
        const correctAnswerLabel = match && match[1];
        //I get an incorrect answer
        let incorrectImageAnswer
        let counter = 0
        while(true){
            if(correctAnswerLabel!=imgsToAssociatesMap.get(response.body.images[counter])){
                incorrectImageAnswer = response.body.images[counter]
                break;
            }
            counter++
        }
        question = response.body.question
        const responseAnswer = await request(app)
            .post("/imgs/answer")
            .set('Content-Type', 'application/json')
            .send({answer:incorrectImageAnswer, question:question, username:"username", category:"foods"})
        expect(responseAnswer.body.correct).toBe("false")
        expect(responseAnswer.body.correctImg).toBe([...imgsToAssociatesMap].find(([key, val]) => val == correctAnswerLabel)[0])
    });
});

function getItemLabelsIfDifferent(images) {
    //I check if all the corresponding itemLabels are different
    let itemLabelsArray = []
    for(let i=0;i<4;i++){
        //I get the corresponding labels
        itemLabelsArray.push(imgsToAssociatesMap.get(images[i]))
    }
    const itemLabelsSet = new Set(itemLabelsArray)
    //The length should be equal if there are no repeated elements
    expect(itemLabelsSet.size).toBe(itemLabelsArray.length)
    return itemLabelsSet
}

function checkInvalidElementsNotChosen(itemLabelsSet){
    //I check that the invalid element has not been chosen
    const regex = /Q\d*/
    for(let i=0;i<4;i++){
        expect(regex.test(itemLabelsSet[i])).toBe(false)
    }
}

function checkQuestionValidity(expectedQuestionStart,question,itemLabelsSet){
    //I check that the question is correctly formulated
    expect(question.includes(expectedQuestionStart)).toBe(true)

    //I check that the answer of the question is one of the options
    regex = new RegExp(`${expectedQuestionStart} (\\w+)\\?`);
    const match = question.match(regex);
    const questionLabel = match && match[1];
    expect(itemLabelsSet.has(questionLabel)).toBe(true)
}