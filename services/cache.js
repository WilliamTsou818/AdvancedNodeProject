// include redis and module
const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const keys = require('@config/keys')
// set redis
const client = redis.createClient(keys.redisUrl)
client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options.key || '')
  return this
}

mongoose.Query.prototype.exec = async function () {
  // check if the query is about to use cache 
  if (!this.useCache) {
    return exec.apply(this, arguments)
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }))

  // see if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key)
  
  // deal with cache value
  if (cacheValue) {
    const doc = JSON.parse(cacheValue)
    return Array.isArray(doc) 
    ? doc.map(d => new this.model(d))
    : new this.model(doc)
  }
  
  // set data to cache value 
  const result = await exec.apply(this, arguments)
  client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10)
  return result
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey))
  }
}