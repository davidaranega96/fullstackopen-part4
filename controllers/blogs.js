const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const helpers = require('./helpers')
const mongoose = require('mongoose')

blogRouter.get('', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })

    if (blogs) {
      response.json(blogs)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.post('', async (request, response, next) => {
  try {
    const firstUser = await User.findOne({})
    const newBlog = { ...request.body, user: firstUser.id }
    const blog = new Blog(newBlog)
    await helpers.addBlogToUser(blog, firstUser)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error){
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const idToDelete = new mongoose.Types.ObjectId(request.params.id)
    const blog = await Blog.findByIdAndDelete(idToDelete)
    if (blog) {
      response.status(204).end()
    } else {
      response.status(202).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id, blog, { new: true }
    )
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter