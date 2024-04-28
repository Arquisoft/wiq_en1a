const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/userprofile-form.feature');


let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {

    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 20 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000/login", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('Viewing Global Rankings', ({given,when,then}) => {
    
    let username;
    let password;
    let email;

    given('the user navigates to their profile', async () => {
        username = "testUser";
        password = "testpass";
        email = "test@email";
        await expect(page).toClick("a", { text: "Log In" });
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick("button", { text: "Log In" });
        await expect(page).toClick("button", { text: "My stats" });
    });

    when('see user general info', async () => {
        
        await expect(page).toMatchElement("h2", { text: username });
        await expect(page).toMatchElement("p", { text: "Email: " + email });
    });

    then('they see their performance statistics for all quizzes', async () => {
        await expect(page).toMatchElement('h3.font-bold', { text: "Global" });
        await expect(page).toMatchElement('h3.font-bold', { text: "Flags" });
        await expect(page).toMatchElement('h3.font-bold', { text: "Cities" });
        await expect(page).toMatchElement('h3.font-bold', { text: "Food" });
        await expect(page).toMatchElement('h3.font-bold', { text: "Attractions" });
        await expect(page).toMatchElement('h3.font-bold', { text: "Monuments" });

        await expect(page).toMatchElement("div.mx-auto h3.font-bold + p", { text: "Total questions: 1" });
        await expect(page).toMatchElement("div.mx-auto h3.font-bold + p", { text: "Total questions: 0" });     
    });

  });


  afterAll(async ()=>{
    browser.close()
  })

});