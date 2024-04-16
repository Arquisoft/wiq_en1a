const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo:60 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

      
  });

  beforeEach(async () => {
    // Reset any state or actions before each test
    await page.reload({ waitUntil: 'networkidle0' });
  });

  test('The user is not registered in the site', ({given,when,then}) => {
    
    let username;
    let password;
    let email

    given('An unregistered user', async () => {
      username = "t1"
      email = "t1email"
      password = "t1pass"

      await expect(page).toClick("button", { text: "Create account" });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="cpassword"]', password);      

     // mockAxios.onPost('http://localhost:8000/adduser').reply(200, { username:  "t1", email: "t1email", password: "t1pass" });
     mockAxios.onPost('http://localhost:8000/adduser').reply(200, { username:"t1",email:"t1email",password: 't1pass'});


      await expect(page).toClick('button', { text: 'Register' })
    });

    then('is taken to login', async () => {
        //await expect(page).toMatchElement("div", { text: "Login" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});