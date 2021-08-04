const AWS = require('aws-sdk')
const uuid = require('uuid')
const authenticate = require('@middleware/authenticate')
require('dotenv').config()

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESSKEY_ID,
    secretAccessKey: process.env.ACCESSKEY_SECRET
  },
  signatureVersion: 'v4',
  region: 'ap-northeast-1',
})

module.exports = app => {
  app.get('/api/upload', authenticate, (req, res) => {
    const key = `${req.user.id}/${uuid.v1()}.jpeg`

    s3.getSignedUrl('putObject', {
      Bucket: 'my-blog-project-bucket-2021',
      ContentType: 'image/jpeg',
      Key: key
    }, (err, url) => res.send({ key, url }))
  })
}