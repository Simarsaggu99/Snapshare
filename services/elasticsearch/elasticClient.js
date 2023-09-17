const { Client } = require('@elastic/elasticsearch')

const client = new Client({
  cloud: { id: '<cloud-id>' },
  auth: { apiKey: 'base64EncodedKey' }
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true
})