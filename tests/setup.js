jest.setTimeout(15000)
require('../models/User')
require('dotenv').config()

// set mongoose connection
if (process.env.NODE_ENV !== 'ci') {
  const { mongoURI } = require('@config/keys')
} else {
  const { mongoURI } = require('@config/ci')
}
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })


