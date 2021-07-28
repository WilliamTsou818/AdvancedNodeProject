require('dotenv').config()

const Buffer = require('safe-buffer').Buffer
const Keygrip = require('keygrip')
const keys = process.env.COOKIE_KEY
const keygrip = new Keygrip([keys])


module.exports = (user) => {
  const sessionObject = {
    passport: { user: user._id.toString() }
  }
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64')
  const sig = keygrip.sign('express:sess=' + session)
  return { session, sig }
}