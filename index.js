require('dotenv').config();
const puppeteer = require('puppeteer');
const details = require('./details');

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function composeAndSendEmail(page, detail) {
  await page.waitForSelector('.sidebar-btn-compose', {
    visible: true,
  });

  await page.click('.sidebar-btn-compose');

  await delay(getRandomInt(500, 1000));

  await page.waitForSelector('.autocompleteEmails-input');
  await page.type('.autocompleteEmails-input', detail.email, {
    delay: getRandomInt(50, 100),
  });

  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.type(`Hola ${detail.name} this is important task.`, {
    delay: getRandomInt(50, 100),
  });

  await page.keyboard.press('Tab');
  await page.keyboard.type('___', {
    delay: getRandomInt(50, 100),
  });

  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.up('Backspace');

  await page.keyboard.type(
    `I told you to do that this weekend. ${detail.name}`,
    {
      delay: getRandomInt(50, 100),
    }
  );

  await delay(getRandomInt(1000, 1500));

  await page.waitForSelector('.composer-btn-send', {
    visible: true,
  });
  await page.click('.composer-btn-send');

  await delay(getRandomInt(1500, 2000));

  return Promise.resolve('done');
}

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

  const doNextPromise = async (d) => {
    composeAndSendEmail(page, details[d]).then(async (x) => {
      d++;
      if (d < details.length) {
        await doNextPromise(d);
      } else {
        await browser.close();
      }
    });
  };

  doNextPromise(0);
}

runAutomation();
