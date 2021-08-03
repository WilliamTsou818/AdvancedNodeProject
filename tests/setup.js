jest.setTimeout(15000)
require('../models/User')
require('dotenv').config()

// set mongoose connection
const mongoose = require('mongoose')
const mongoURI = process.env.MONGODB_URI
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })


