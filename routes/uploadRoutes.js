const AWS = require('aws-sdk')
require('dotenv').config()

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEY_ID,
  secretAccessKey: process.env.ACCESSKEY_SECRET
})

module.exports = app => {
  app.get('/api/upload', (req, res) => {})
}