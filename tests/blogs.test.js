const Page = require('./helpers/page')
const mongoose = require('mongoose')

let page

beforeEach(async () => {
  page = await Page.build()
  await page.goto('localhost:3000')
})

afterEach(async () => {
  await page.close()
})

afterAll(() => {
  return mongoose.disconnect()
})