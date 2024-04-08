const WBK = require('wikibase-sdk')
const wbk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql' // Required to use `sparqlQuery` and `getReverseClaims` functions, optional otherwise
})
const express = require('express');
const app = express();
const port = 8010;

const axios = require('axios');
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


app.use(express.static('public'));
app.use(express.json());

var imgToAssociatedMap = new Map()
var answerToQuestionMap = new Map()

class WIQ_API {
  /**
   * Extracts from wikidata images and their associates, then selects 4 images and one of
   * their associates for the question so the question is constructed with it as the target
   * for the answer.
   * 
   * @param {string} query - SPARQL query for wikidata that has to use 
   * an 'image' variable and an 'itemLabel' variable, respectively containing
   * the image urls and the name of the associated entities (For example, flags and countries)
   * @param {string} imgTypeName - Name of what the images represent
   * @param {string} relation - Relation of the images with the question associated element
   * @returns - A JSON with the question (question) and the images (images)
   */
  async getQuestionAndImages(query, imgTypeName, relation) {

    //Num of fetched items
    const itemsNum = 200

    //Required by wikidata to accept the request
    const headers = new Headers();
    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      + ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    //Constructing the url for the wikidata request
    var url = wbk.sparqlQuery(query);

    const response = await fetch(url, { headers });
    const data = await response.json()

    var chosenNums = [];
    const numOfChosen = 4
    // Generate n random numbers
    for (let i = 0; i < numOfChosen; i++) {
      this.#getRandomNumNotInSetAndUpdate(itemsNum, chosenNums)
    }
    const associates = []
    const imgs = []
    let finalChosenLabels = []
    //I filter in case the label does not have a proper name
    //and just a wikidata identifier (Q followed by numbers)
    const regex = /Q\d*/
    while (regex.test(data.results.bindings[chosenNums[0]].itemLabel.value)) {
      this.#getRandomNumNotInSetAndUpdate(itemsNum, chosenNums)
      chosenNums[0] = chosenNums.pop()
    }
    finalChosenLabels.push(data.results.bindings[chosenNums[0]].itemLabel.value);
    for (let i = 0; i < numOfChosen - 1; i++) {
      //I check if there are repeated labels
      //(More efficient than in the query) and if it is a proper label
      while (finalChosenLabels.includes(data.results.bindings[chosenNums[i + 1]].itemLabel.value)
        || regex.test(data.results.bindings[chosenNums[i + 1]].itemLabel.value)) {
        this.#getRandomNumNotInSetAndUpdate(itemsNum, chosenNums)
        chosenNums[i + 1] = chosenNums.pop()
      }
      finalChosenLabels.push(data.results.bindings[chosenNums[i + 1]].itemLabel.value)
    }

    let counter = 0
    while (chosenNums.length > 0) {
      imgs.push(data.results.bindings[chosenNums.pop()].image.value)
      associates.push(finalChosenLabels.pop())
      imgToAssociatedMap.set(imgs[counter], associates[counter])
      counter++
    }

    //Choose a random item of the chosen to make the question
    const chosenNum = this.#getRandomNumNotInSetAndUpdate(numOfChosen, chosenNums)
    const chosenAssociate = associates[chosenNum]
    let correctImg = imgs[chosenNum]

    const question = `Which of the following ${imgTypeName} ${relation} ${chosenAssociate}?`
    answerToQuestionMap.set(correctImg, question)

    const questionAndImages = {
      question: question,
      images: [`${imgs[0]}`, `${imgs[1]}`, `${imgs[2]}`, `${imgs[3]}`]
    }

    return JSON.stringify(questionAndImages)
  }

  #getRandomNumNotInSetAndUpdate(numLimit, set) {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * numLimit);
    } while (set.includes(randomNumber)); // Ensure the number is unique
    set.push(randomNumber);
    return randomNumber
  }
}

const wiq = new WIQ_API()

/**
 * Returns the needed information to construct a question of the form
 * "Which of the following flags belongs to xCountry?" with 4 options
 * @param {} req - Not used
 * @param {Object} res - Contains the question (question) and the flags (images)
*/
app.get('/imgs/flags/question', async (req, res) => {
  //Gets flag images and their associated country names
  const query = `SELECT ?item ?itemLabel ?image WHERE 
    { 
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
      ?item wdt:P31 wd:Q6256; 
      wdt:P41 ?image. 
    }
    LIMIT 200`
  const question = JSON.parse(await wiq.getQuestionAndImages(query, "flags", "belongs to"));
  res.json(question); //LOS STATUSS!!!!!!!!!!!
});

/**
 * Returns the needed information to construct a question of the form
 * "Which of the following images corresponds to xCity?" with 4 options
 * @param {} req - Not used
 * @param {Object} res - Contains the question (question) and the cities (images)
*/
app.get('/imgs/cities/question', async (req, res) => {
  //Gets city images and their associated names
  const query = `SELECT ?item ?itemLabel ?image WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    ?item wdt:P31 wd:Q515.
    ?item wdt:P18 ?image. 
  }
  LIMIT 200`
  const question = JSON.parse(await wiq.getQuestionAndImages(query, "images", "corresponds to"));
  res.json(question); //LOS STATUSS!!!!!!!!!!!
});

/**
 * Returns the needed information to construct a question of the form
 * "Which of the following images corresponds to xMonument?" with 4 options
 * @param {} req - Not used
 * @param {Object} res - Contains the question (question) and the monuments (images)
*/
app.get('/imgs/monuments/question', async (req, res) => {
  //Gets monument images and their associated names
  const query = `SELECT ?item ?itemLabel ?image WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    ?item wdt:P31 wd:Q4989906;
      wdt:P18 ?image.
  }
  LIMIT 200`
  const question = JSON.parse(await wiq.getQuestionAndImages(query, "images", "corresponds to"));
  res.json(question); //LOS STATUSS!!!!!!!!!!!
});

/**
 * Returns the needed information to construct a question of the form
 * "Which of the following tourist attractions corresponds to xTouristAttraction?" with 4 options
 * @param {} req - Not used
 * @param {Object} res - Contains the question (question) and the tourist attractions (images)
*/
app.get('/imgs/tourist_attractions/question', async (req, res) => {
  //Gets attractions images and their associated names
  const query = `SELECT ?item ?itemLabel ?image WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    ?item wdt:P31 wd:Q570116;
      wdt:P18 ?image.
  }
  LIMIT 200`
  const question = JSON.parse(await wiq.getQuestionAndImages(query, "images", "corresponds to"));
  res.json(question); //LOS STATUSS!!!!!!!!!!!
});

/**
 * Returns the needed information to construct a question of the form
 * "Which of the following images corresponds to xFood?" with 4 options
 * @param {} req - Not used
 * @param {Object} res - Contains the question (question) and the foods (images)
*/
app.get('/imgs/foods/question', async (req, res) => {

  //Gets food images and their associated names
  const query = `SELECT ?item ?itemLabel ?image WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    ?item wdt:P31 wd:Q8195619;
      wdt:P18 ?image.
  }
  LIMIT 200`
  const question = JSON.parse(await wiq.getQuestionAndImages(query, "images", "corresponds to"));
  res.json(question); //LOS STATUSS!!!!!!!!!!!
});

/**
 * Gets a response indicating if the chosen img was correct or not
 * @param {Object} req - img url selected by the player and the question he is answering
 * @param {Object} res - JSON containing whether the answer was correct "true" 
 * or not "false". In case it was incorrect, the chosen 
 * associate will be returned as well
*/
app.post('/imgs/answer', async (req, res) => {
  try {
    const obj = req.body;

    if (obj.question == answerToQuestionMap.get(obj.answer)) {
      await axios.post(apiEndpoint + '/addpoints',
        { username: obj.username, category: obj.category, correct: "true" });
      res.status(200).json({
        correct: "true",
      })
    } else {
      await axios.post(apiEndpoint + '/addpoints',
        { username: obj.username, category: obj.category, correct: "false" });

      res.status(200).json({
        correct: "false",
        associate: `${imgToAssociatedMap.get(obj.answer)}`
      })
    }
  } catch (e) { //SIEMPRE RODEAR CON TRY CATCH
    res.status(500).json({ error: e.message })
  }
});

const server = app.listen(port, () => {
  console.log(`Questions service listening on http://localhost:${port}`);
});

module.exports = server