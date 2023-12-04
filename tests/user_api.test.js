const supertest = require('supertest')
const app = require('../app')
const helper = require('./helpers')
const User = require('../models/user')
const mongoose = require('mongoose')

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

  test('username is too short', async () => {
    const newUser = { ...helper.testUser, username: 'ab' }
    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
  })

  test('password is too short', async () => {
    const newUser = { ...helper.testUser, password: 'ab' }
    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
  })

  test('username already exists', async () => {
    await api.post('/api/users').send(helper.testUser)
    const newUser = { ...helper.testUser, password: '12341', name: 'New name' }
    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
  })
})

beforeEach(async () => {
  await User.deleteMany({})
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(async () => {
  await mongoose.connection.close()
})