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
    const decodedToken = helpers.decodeBearerToken(request)
    if (!decodedToken) {
      response.status(401).send({ error: 'token invalid' })
      return
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({ ...request.body, user: user.id })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error){
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const idToDelete = new mongoose.Types.ObjectId(request.params.id)
    const blog = await Blog.findById(idToDelete)
    if (!blog) {
      response.status(202).end()
    } else if (blog.user.toString() !== request.user.id.toString()) {
      response.status(401).send({ error: 'user can\'t delete this blog '})
    } else {
      await Blog.findByIdAndDelete(idToDelete)
      response.status(204).end()
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