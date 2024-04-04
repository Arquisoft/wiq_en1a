const request = require('supertest');
const app = require('./question-service'); 

afterAll(async () => {
    app.close();
  });

// Mock the fetch function
global.fetch = jest.fn();

var imgsToAssociatesMap = new Map()

// Mock responses from external services
jest.spyOn(global, 'fetch').mockImplementation(() => {
    let result = { results: {bindings: []}  }
    for(let i=1;i<=100;i++){
        //Simulating there is maximum number of repeated itemLabels (between the valid ones)
        result.results.bindings.push({itemLabel: {value: "itemName1"} , image:{value: "imageUrlX"+i}})
        imgsToAssociatesMap.set("imageUrlX"+i, "itemName1")
    }
    for(let i=101;i<=195;i++){
        //Simulating there are invalid itemLabels
        result.results.bindings.push({itemLabel: {value: "Q"+i} , image:{value: "imageUrl"}})
    }
    result.results.bindings.push({itemLabel: {value: "Q"} , image:{value: "imageUrl"}})
    for(let i=1;i<=4;i++){
        //Chosen elements (One of them will be one of the 196 elems with itemLabel 'itemName1' and 'imageUrlX')
        result.results.bindings.push({itemLabel: {value: "itemName"+i} , image:{value: "imageUrl"+i}})
        imgsToAssociatesMap.set("imageUrl"+i, "itemName"+i)
    }
    return Promise.resolve({ json: () => Promise.resolve(result) });
});

describe('Question Service', () => {
    // Test /imgs/flags/question endpoint
    it('should return a flags question with 4 images as options', async () => {
        const response = await request(app).get('/imgs/flags/question');
        const itemLabelsSet = getItemLabelsIfDifferent(response.body);
        
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
        regex = new RegExp(`Which of the following foods corresponds to (\\w+)\\?`);
        const match = response.body.question.match(regex);
        const correctAnswerLabel = match && match[1];
        //I get and send the correct answer
        const correctImage = imgsToAssociatesMap.get(correctAnswerLabel)
        console.log(response.body.question)
        const responseAnswer = await request(app)
            .post("/imgs/answer")
            .set('Content-Type', 'text/plain')
            .send(correctImage)
        //console.log(responseAnswer.body)
        expect(responseAnswer.body.correct).toBe("true")
    });

    //Test /imgs/answer endpoint (Incorrect answer)
    it('should inform the answer is incorrect and what is the element associated to the answer', async () => {
        //First I ask a question
        const response = await request(app).get('/imgs/foods/question');
        regex = new RegExp(`Which of the following foods corresponds to (\\w+)\\?`);
        const match = response.body.question.match(regex);
        const correctAnswerLabel = match && match[1];
        //I get the correct answer
        const correctImage = imgsToAssociatesMap.get(correctAnswerLabel)
        //I choose an incorrect answer
        let incorrectAnswer
        for(let i=0;i<4;i++){
            if(response.body.images[i]!=correctImage){
                incorrectAnswer = response.body.images[i]
                break
            }
        }
        const responseAnswer = await request(app)
            .post("/imgs/answer")
            .send(incorrectAnswer)
        expect(responseAnswer.body.correct).toBe("false")
        // expect(responseAnswer.body.associate).toBe(imgsToAssociatesMap.get(incorrectAnswer))
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