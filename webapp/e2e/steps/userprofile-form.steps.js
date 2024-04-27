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

    given('the user navigates to their profile', async () => {
        username = "testUser"
        password = "testpass";
        await expect(page).toClick("a", { text: "Log In" });
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick("button", { text: "Log In" });
        await expect(page).toClick("button", { text: "My stats" });
    });

    when('they select the "Global" category', async () => {
        
        await expect(page).toMatchElement("h2", { text: "Username: " + username });
        await expect(page).toClick("button", { text: "Flags" });
        await expect(page).toClick("button", { text: "Global" });
    });

    then('they see their performance statistics for global quizzes', async () => {
        await expect(page).toMatchElement('.ranking h3', { text: "global Ranking" });
       await expect(page).toMatchElement(".ranking p:nth-child(1)", { text: "Total Answered Questions: " + 1 });
    });

  });

  test('Switching Category to Flags', ({given,when,then}) => {
    
    let username;
    let password;

    given('the user is on their profile page', async () => {
        username = "testUser"
        password = "testpass";
        await expect(page).toMatchElement("h2", { text: "Username: " + username });
    });

    when('they click on the "Flags" category', async () => {
        
        await expect(page).toClick("button", { text: "Flags" });
    });

    then('they view their performance metrics for flag-related quizzes', async () => {
        await expect(page).toMatchElement('.ranking h3', { text: "flags Ranking" });
        await expect(page).toMatchElement(".ranking p:nth-child(1)", { text: "Total Answered Questions: " + 1 });
    });

  });

  test('Switching Category to Food', ({given,when,then}) => {
    
    let username;
    let password;

    given('the user is on their profile page', async () => {
        username = "testUser"
        password = "testpass";
        await expect(page).toMatchElement("h2", { text: "Username: " + username });
    });

    when('they click on the "Food" category', async () => {
        
        await expect(page).toClick("button", { text: "Food" });
    });

    then('they view their performance metrics for food-related quizzes', async () => {
        await expect(page).toMatchElement('.ranking h3', { text: "foods Ranking" });
        await expect(page).toMatchElement(".ranking p:nth-child(1)", { text: "Total Answered Questions: " + 0 });
    });

  });

  afterAll(async ()=>{
    browser.close()
  })

});