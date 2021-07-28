const puppeteer = require('puppeteer')
require('dotenv').config()

let browser, page

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  })
  page = await browser.newPage()
  await page.goto('localhost:3000')
})

afterEach(async () => {
  // await browser.close()
})

test('the header has the correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML)
  expect(text).toEqual('Blogster')
})

test('clicking login starts oauth flow', async () => {
  await page.click('.right a')
  const url = await page.url()
  expect(url).toMatch(/accounts\.google\.com/)
})

test.only('When signed in, shows logout button', async () => {
  const id = process.env.SESSION_USER_ID
  const Buffer = require('safe-buffer').Buffer
  const sessionObject = {
    passport: { user: id }
  }
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64')
  
  // generate fake session
  const Keygrip = require('keygrip')
  const keys = process.env.COOKIE_KEY
  const keygrip = new Keygrip([keys])
  const sig = keygrip.sign('express:sess=' + sessionString)
  // set session to cookie
  await page.setCookie({ name: 'express:sess', value: sessionString })
  await page.setCookie({ name: 'express:sess.sig', value: sig })
  await page.goto('localhost:3000')
})