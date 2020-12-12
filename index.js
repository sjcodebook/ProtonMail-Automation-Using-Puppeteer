require('dotenv').config();
const puppeteer = require('puppeteer');

async function runAutomation() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://mail.protonmail.com/login', {
    waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
  });

  await page.waitForSelector('input[name=username]');
  await page.$eval(
    'input[name=username]',
    (el, _protonuser) => {
      el.value = _protonuser;
    },
    process.env.PROTONUSER
  );

  await page.waitForSelector('input[name=password]');
  await page.$eval(
    'input[name=password]',
    (el, _password) => {
      el.value = _password;
    },
    process.env.PASSWORD
  );

  await page.keyboard.press('Enter');

  await page.waitForSelector('.sidebar-btn-compose', {
    visible: true,
  });

  page.click('.sidebar-btn-compose');

  await page.waitForSelector('.autocompleteEmails-input');
  await page.type('.autocompleteEmails-input', 'webbrainsmedia@gmail.com', {
    delay: 100,
  });

  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Hola this is important task.', { delay: 100 });

  await page.keyboard.press('Tab');
  await page.keyboard.type(' ', {
    delay: 100,
  });
  await page.keyboard.type('I told you to do that this weekend.', {
    delay: 100,
  });

  await page.waitForSelector('.composer-btn-send', {
    visible: true,
  });

  page.click('.composer-btn-send');

  await browser.waitForTarget(() => false);

  await browser.close();
}

runAutomation();
