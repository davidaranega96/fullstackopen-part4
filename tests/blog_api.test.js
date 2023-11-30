const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    'title': 'How to start a web app',
    'author': 'David Aranega',
    'url': 'In my head',
    'likes': 100
  }
]

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  
  expect(response.body).toHaveLength(initialBlogs.length)
})
  
test('the first blog is about web apps', async () => {
  const response = await api.get('/api/blogs')
  
  expect(response.body[0].title).toBe('How to start a web app')
})

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
})

afterAll(async () => {
  await mongoose.connection.close()
})