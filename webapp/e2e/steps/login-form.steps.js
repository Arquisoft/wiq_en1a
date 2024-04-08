const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-form.feature');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);

let page;
let browser;

defineFeature(feature, test => {
  
    beforeAll(async () => {
      browser = process.env.GITHUB_ACTIONS
        ? await puppeteer.launch()
        : await puppeteer.launch({ headless: false, slowMo:40 });
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
  
    test('The user is registered in the site', ({given,when,then}) => {
      
      let username;
      let password;
      let email
  
      given('A registered user', async () => {
        username = "t1"
        password = "t1pass"
  
        await expect(page).toClick("button", { text: "Create account" });
      });
  
      when('I fill the data in the form and press submit', async () => {
        await expect(page).toClick('a', { text: 'Already have an account? Log in here.' });

        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
  
        mockAxios.onPost('http://localhost:8000/login').reply(200, { username:"t1",email:"t1email",createdAt: '2024-01-01T12:34:56Z',token: 'testToken'});
  
  
        await expect(page).toClick('button', { text: 'Login' })
      });
  
      then('is logged', async () => {
          await expect(page).toMatchElement("div", { text: "Welcome back, " + username + "!" });
      });
    })
  
    afterAll(async ()=>{
      browser.close()
    })
  
  });