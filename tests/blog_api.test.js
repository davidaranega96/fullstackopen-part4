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
  },
  {
    'title': 'How to crash your web app',
    'author': 'David Aranega',
    'url': 'In my head',
  }
]
describe('GET methods', () => {
  test('normal case', async () => {
    const response = await api.get('/api/blogs')
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(initialBlogs.length)
    expect(response.headers['content-type']).toMatch(/application\/json/)
  }, 20000)

  test('the first blog is about web apps', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe('How to start a web app')
  })

  test('verify blogs contain id', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  test('verify default likes value is 0', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[1].likes).toBe(0)
  })
})
  
describe('POST methods', () => {
  test('normal case', async () => {
    const firstResponse = await api.get('/api/blogs')
    const initialLength = firstResponse.body.length

    const extraBlog = {
      title: 'test blog is added',
      author: 'Tes Ter',
      url: 'test.test.com',
      likes: 93
    }

    await api.post('/api/blogs').send(extraBlog)

    const secondResponse = await api.get('/api/blogs')
    expect(secondResponse.body).toHaveLength(initialLength + 1)

    const addedBlog = secondResponse.body.find((blog) => blog.title === extraBlog.title)
    expect(addedBlog).toBeDefined()
  })

  test('with incorrect format response is 400', async () => {
    const wrongBlog = {
      author: 'Me myself and I',
      likes: 99
    }
  
    const response = await api.post('/api/blogs').send(wrongBlog)
    expect(response.status).toBe(400)
  })
})

describe('DELETE methods', () => {
  test('normal case', async () => {
    const blogToDeleteTitle = 'How to start a web app'
    const blog = await Blog.findOne({title: blogToDeleteTitle})
    const response = await api.delete(`/api/blogs/${blog._id}`)
    expect(response.status).toBe(204)
  })

  test('no id found returns 202 status', async () => {
    jest.spyOn(Blog, 'findOne').mockResolvedValue(null)
    const response = await api.delete('/api/blogs/000000000000')
    expect(response.status).toBe(202)
  })
})

describe('PUT methods', () => {
  test('normal case', async () => {
    const blogToUpdate = await Blog.findOne({title:'How to start a web app'})
    const idToUpdate = blogToUpdate._id
    delete blogToUpdate._id
    delete blogToUpdate.__v
    const updatedBlog = { ...blogToUpdate.toObject(), title: 'Modified title' }

    const response = await api.put(`/api/blogs/${idToUpdate}`).send(updatedBlog)
    expect(response.body.title).toBe('Modified title')
    expect(response.body.id).toBe(blogToUpdate._id.toString())
  })

  test('id not found returns 404', async () => {
    const blogToUpdate = await Blog.findOne({ title: 'How to start a web app' })
    delete blogToUpdate._id
    delete blogToUpdate.__v

    jest.spyOn(Blog, 'findOne').mockResolvedValue(null)
    const updatedBlog = { ...blogToUpdate.toObject(), title: 'Modified title' }
    const response = await api.put('/api/blogs/000000000000').send(updatedBlog)
    expect(response.status).toBe(404)
  })
})

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of initialBlogs) {
    let newBlog = new Blog(blog)
    await newBlog.save()
  }
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(async () => {
  await mongoose.connection.close()
})
