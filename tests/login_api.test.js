const mongoose = require('mongoose')
const supertest = require('supertest')
const helpers = require('./helpers')
const app = require('../app')

const api = supertest(app)

describe('POST methods', () => {
  test('normal case', async () => {
    const response = await api.post('/api/login').send({
      username: helpers.testUser.username,
      password: helpers.testUser.password
    })
    expect(response.status).toBe(200)
    expect(response.body.token).not.toBeUndefined()
    expect(response.headers['content-type']).toMatch(/application\/json/)
  }, 10000)

  test('incorrect password', async () => {
    const response = await api.post('/api/login').send({
      username: helpers.testUser.username,
      password: 'wrongpassword'
    })
    expect(response.status).toBe(401)
  })

  test('incorrect username', async () => {
    const response = await api.post('/api/login').send({
      username: 'wrongusername',
      password: helpers.testUser.password
    })
    expect(response.status).toBe(401)
  })

})

beforeAll(async () => {
  await api.post('/api/users').send(helpers.testUser)
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(async () => {
  await mongoose.connection.close()
})
