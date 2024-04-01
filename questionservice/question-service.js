const WBK = require('wikibase-sdk')
const wbk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql' // Required to use `sparqlQuery` and `getReverseClaims` functions, optional otherwise
})
const express = require('express');
const app = express();
const port = 8010;

app.use(express.static('public'));
app.use(express.text());

var correctImg
var imgToAssociatedMap = new Map()

class WIQ_API{
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
    //Reset the map for the new question
    imgToAssociatedMap = new Map()

    //Num of fetched items
    const itemsNum = 100 

    //Required by wikidata to accept the request
    const headers = new Headers();
    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    +' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

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
    for(var i=0;i<numOfChosen;i++){
      imgs.push(data.results.bindings[chosenNums[i]].image.value)
      associates.push(data.results.bindings[chosenNums[i]].itemLabel.value)
      imgToAssociatedMap.set(imgs[i], associates[i])
    }

    chosenNums = []
    //Choose a random item of the chosen to make the question
    const chosenNum = this.#getRandomNumNotInSetAndUpdate(numOfChosen,chosenNums)
    const chosenAssociate = associates[chosenNum]
    correctImg = imgs[chosenNum]

    const questionAndImages = {
      question: `Which of the following ${imgTypeName} ${relation} ${chosenAssociate}?`,
      images: [`${imgs[0]}`,`${imgs[1]}`,`${imgs[2]}`,`${imgs[3]}`]
    }

    return JSON.stringify(questionAndImages)
  }

  #getRandomNumNotInSetAndUpdate(numLimit, set){
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
      FILTER NOT EXISTS { ?item wdt:P41 wd:Q3024110 } 
    }`
  const question = JSON.parse(await wiq.getQuestionAndImages(query,"flags","belongs to"));
  res.json(question);
});

/**
 * Returns the needed information to construct a question of the form
 * "Which of the following images corresponds to xCity?" with 4 options
 * @param {} req - Not used
 * @param {Object} res - Contains the question (question) and the cities (images)
*/
app.get('/imgs/cities/question', async (req, res) => {
  //Gets city images and their associated names
  const query = `SELECT ?item ?itemLabel ?image WHERE 
    {
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      ?item wdt:P31 wd:Q515;
      wdt:P18 ?image.
      FILTER NOT EXISTS { ?item wdt:P41 wd:Q3024110. }
    }
    LIMIT 100`
  const question = JSON.parse(await wiq.getQuestionAndImages(query,"images","corresponds to"));
  res.json(question);
});

/**
 * Gets a response indicating if the chosen img was correct or not
 * @param {string} req - img url selected by the player
 * @param {Object} res - JSON containing whether the answer was correct "true" 
 * or not "false". In case it was incorrect, the chosen 
 * associate will be returned as well
*/
app.post('/imgs/answer', (req, res) => {
  const answer = req.body;

  if(correctImg==answer){
    res.status(200).json({
      correct: "true"
    })
  } else {
    res.status(200).json({
      correct: "false",
      country: `${imgToAssociatedMap.get(answer)}`
    })
  }
});

app.listen(port, () => {
  console.log(`Questions service listening on http://localhost:${port}`);
});