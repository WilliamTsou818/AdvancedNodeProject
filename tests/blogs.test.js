const Page = require('./helpers/page')
const mongoose = require('mongoose')

let page

beforeEach(async () => {
  page = await Page.build()
  await page.goto('http://localhost:3000')
})

afterEach(async () => {
  await page.close()
})

afterAll(() => {
  return mongoose.disconnect()
})

test('When logged in, can see blog create form', async () => {
  await page.login()
  await page.click('a.btn-floating')

  const label = await page.getContentsOf('form label')
  expect(label).toEqual('Blog Title')
})

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login()
    await page.click('a.btn-floating')
  })

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label')

    expect(label).toEqual('Blog Title')
  })

  describe('And using valid inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Test Title')
      await page.type('.content input', 'My Test Content')
      await page.click('form button')
    })

    test('Submitting takes user to review screen', async () => {
      await page.waitFor('h5')
      const text = await page.getContentsOf('h5')

      expect(text).toEqual('Please confirm your entries')
    })

    test('Submitting then saving adds blog to index page', async () => {
      await page.click('button.green')
      await page.waitFor('.card')

      const title = await page.getContentsOf('.card-title')
      const content = await page.getContentsOf('p')

      expect(title).toEqual('My Test Title')
      expect(content).toEqual('My Test Content')
    })
  })

  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button')
      await page.waitFor('.title .red-text')
      await page.waitFor('.content .red-text')
    })

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text')
      const contentError = await page.getContentsOf('.content .red-text')

      expect(titleError).toEqual('You must provide a value')
      expect(contentError).toEqual('You must provide a value')
    })
  })
})

describe('User is not logged in', () => {
  test('User cannot create blog posts', async () => {
    const result = await page.post('/api/blogs', { title: 'T', content: 'C' })
    
    expect(result).toEqual({ error: 'Login required' })
  })

  test('User cannot get a list of posts', async () => {
    const result = await page.get('/api/blogs')

    expect(result).toEqual({ error: 'Login required' })
  })
})