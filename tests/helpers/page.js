const puppeteer = require('puppeteer')
const sessionFactory = require('../factories/sessionFactory')
const userFactory = require('../factories/userFactory')

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    })

    const page = await browser.newPage()
    const customPage = new CustomPage(page)

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property]
      }
    })
  }

  constructor(page) {
    this.page = page
  }

  async login() {
    // generate user and session
    const user = await userFactory()
    const { session, sig } = sessionFactory(user)
    // set session to cookie
    await this.page.setCookie({ name: 'express:sess', value: session })
    await this.page.setCookie({ name: 'express:sess.sig', value: sig })

    await this.page.goto('localhost:3000')
    await this.page.waitFor('a[href="/auth/logout"]')
  }
}

module.exports = CustomPage