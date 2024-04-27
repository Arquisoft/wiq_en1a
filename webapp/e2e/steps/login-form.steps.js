const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-form.feature');


let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {

    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 30 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000/login", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is registered in the site', ({given,when,then}) => {
    
    let username;
    let password;

    given('An registered user', async () => {
      username = "testUser"
      password = "testpass";

    });

    when('I fill the data in the form to log in', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick("button", { text: "Log In" });
    });

    then('is taken to the home page', async () => {
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      await expect(page).toMatchElement("h1", { text: "Welcome back, " + username + "!" });
    });

  });

  afterAll(async ()=>{
    browser.close()
  })

});