const puppeteer = require('puppeteer')
require('dotenv').config()
const sessionFactory = require('./factories/sessionFactory')
const userFactory = require('./factories/userFactory')
const mongoose = require('mongoose')

let browser, page

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  })
  page = await browser.newPage()
  await page.goto('localhost:3000')
})

afterEach(async () => {
  await browser.close()
})

afterAll(() => {
  return mongoose.disconnect()
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

test('When signed in, shows logout button', async () => {
  const user = await userFactory()
  const { session, sig } = sessionFactory(user)
  // set session to cookie
  await page.setCookie({ name: 'express:sess', value: session })
  await page.setCookie({ name: 'express:sess.sig', value: sig })
  await page.goto('localhost:3000')

  await page.waitFor('a[href="/auth/logout"]')

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
  expect(text).toEqual('Logout')
})