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
      await expect(page).toClick("button", { text: "Log out" });
    });

  });

  test('User logs in with invalid credentials', ({ given, when, then }) => {
    given('a registered user with username "testUser" and password "testpass"', async () => {
      // No specific action needed since the user is already registered
    });

    when('I fill the login form with username "testUser" and incorrect password "wrongpass"', async () => {
      await expect(page).toFill('input[name="username"]', 'testUser');
      await expect(page).toFill('input[name="password"]', 'wrongpass');
      await expect(page).toClick("button", { text: "Log In" });
    });


    then('I remain on the login page', async () => {
        await expect(page).toMatchElement("h1", { text: "Access WIQ" });
    });
  });

  test('User attempts to login without entering credentials', ({ given, when, then }) => {
    given('a registered user with username "testUser" and password "testpass"', async () => {
      // No specific action needed since the user is already registered
    });

    when('I attempt to log in without entering any credentials', async () => {
        await expect(page).toFill('input[name="username"]', '');
        await expect(page).toFill('input[name="password"]', '');
        await expect(page).toClick("button", { text: "Log In" });
    });


    then('I remain on the login page', async () => {
        await expect(page).toMatchElement("h1", { text: "Access WIQ" });
    });
  });

  afterAll(async ()=>{
    browser.close()
  })

});