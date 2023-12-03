const supertest = require('supertest')
const app = require('../app')
const helper = require('./helpers')

const api = supertest(app)

describe('POST method', () => {
  test('normal case', async () => {
    const response = await api.post('/api/users').send(helper.testUser)
    expect(response.status).toBe(201)
    expect(response.body.password).not.toBeDefined()
  })

  test('no username', async () => {
    const newUser = { ...helper.testUser, username: undefined }
    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
  })

  test('no password', async () => {
    const newUser = { ...helper.testUser, password: undefined }
    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
  })
})