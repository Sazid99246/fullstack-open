require('dotenv').config()

const { test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const request = require('supertest')
const Person = require('../models/person')
const app = require('../app')

before(async () => {
  const uri = process.env.MONGODB_TEST_URI

  assert.ok(uri, 'MONGODB_TEST_URI must be defined')
  assert.match(
    new URL(uri).pathname,
    /testPhonebook/,
    'Tests must use the phonebook-test database'
  )

  await mongoose.connect(uri, { family: 4 })
})

beforeEach(async () => {
  await Person.deleteMany({})
})

after(async () => {
  await mongoose.connection.close()
})

test('root route returns Hello World!', async () => {
  const response = await request(app).get('/')

  assert.equal(response.status, 200)
  assert.match(response.text, /Hello World!/)
})

test('persons are returned as JSON', async () => {
  const person = new Person({
    name: 'Test Person',
    number: '12-123456'
  })

  await person.save()

  const response = await request(app).get('/api/persons')

  assert.equal(response.status, 200)
  assert.equal(response.body.length, 1)
  assert.equal(response.body[0].name, 'Test Person')
  assert.equal(response.body[0].number, '12-123456')
})
