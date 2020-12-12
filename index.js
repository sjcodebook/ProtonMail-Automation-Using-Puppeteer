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

  // const [response] = await Promise.all([
  //   page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  //   // page.waitForSelector('button[class=sidebar-btn-compose]'),
  //   page.click('.sidebar-btn-compose'),
  // ]);

  // await page.waitForNavigation();

  // const a = await page.$('.sidebar-btn-compose');

  // console.log(a.value);
  // console.log(a.innerText);

  // await page.$eval(
  //   '.sidebar-btn-compose',
  //   (el) => (el.value = '4h@dT@G9CawE22M')
  // );

  await browser.waitForTarget(() => false);

  // await page.click('input[type="submit"]');
  // await page.waitForSelector('#mw-content-text');
  // const text = await page.evaluate(() => {
  //   const anchor = document.querySelector('#mw-content-text');
  //   return anchor.textContent;
  // });
  // console.log(text);
  await browser.close();
}

runAutomation();
