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

//Correct image
var correctAnswerFlag
//Associates flags with their countries
var flagToCountryMap = new Map()

class WIQ_API{
  /**
   * 
   * @returns JSON with the question and the flags
   */
  async getQuestionAndCountryFlags() {
    //Reset the map for the new question
    flagToCountryMap = new Map()

    //Num of fetched countries
    const countriesNum = 100 

    //Required by wikidata to accept the request
    const headers = new Headers();
    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    +' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    const sparql = `SELECT ?país ?paísLabel ?imagen_de_la_bandera WHERE {
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      ?país wdt:P31 wd:Q6256.
      OPTIONAL { ?país wdt:P41 ?imagen_de_la_bandera. }
    }
    LIMIT ${countriesNum}`

    //Constructing the url for the wikidata request
    var url = wbk.sparqlQuery(sparql);

    const response = await fetch(url, { headers });
    const data = await response.json()

    var chosenNums = [];
    const numOfChosen = 4
    // Generate n random numbers
    for (let i = 0; i < numOfChosen; i++) {
      this.#getRandomNumNotInSetAndUpdate(countriesNum, chosenNums)
    }
  
    const countries = []
    const imgs = []
    for(var i=0;i<numOfChosen;i++){
        //Making sure there is an image associated
        while(!'imagen_de_la_bandera' in data.results.bindings[chosenNums[i]]){
          chosenNums[i] = this.#getRandomNumNotInSetAndUpdate(countriesNum, chosenNums)
        }
        imgs.push(data.results.bindings[chosenNums[i]].imagen_de_la_bandera.value)
        countries.push(data.results.bindings[chosenNums[i]].paísLabel.value)
        flagToCountryMap.set(imgs[i], countries[i])
    }

    chosenNums = []
    //Choose a random country of the chosen to make the question
    const chosenCountry = countries[this.#getRandomNumNotInSetAndUpdate(numOfChosen,chosenNums)]

    const questionAndFlags = {
      question: `Which of the following flags belongs to ${chosenCountry}?`,
      flags: [`${imgs[0]}`,`${imgs[1]}`,`${imgs[2]}`,`${imgs[3]}`]
    }

    return JSON.stringify(questionAndFlags)
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
 * "Which of the following flags belongs to (insert country)?" with 4 options
 * @param {} req - Not used
 * @param {Object} res - Contains the question (question) and the images of the flags (flags)
*/
app.get('/flags/question', async (req, res) => {
  const question = JSON.parse(await wiq.getQuestionAndCountryFlags());
  res.json(question);
});

/**
 * Gets a response indicating if the chosen flag img was correct or not
 * @param {string} req - Flag img url selected by the player
 * @param {Object} res - JSON containing whether the answer was correct "true" 
 * or not "false". In case it was incorrect, the chosen 
 * country will be returned as well
*/
app.get('/flags/answer', (req, res) => {
  const answeredFlag = req.body
  console.log(answeredFlag);
  console.log(correctAnswerFlag);
  if(correctAnswerFlag==answeredFlag){
    res.json({
      correct: "true"
    })
  } else {
    res.json({
      correct: "false",
      country: `${flagToCountryMap.get(answeredFlag)}`
    })
  }
});

app.listen(port, () => {
  console.log(`Questions service listening on http://localhost:${port}`);
});