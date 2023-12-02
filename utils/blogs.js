const Blog = require('../models/blog')
const logger = require('./logger')

const addVote = async ({ id }) => {
  const blog = await blog.findById(id)
  if (!blog) {
    logger.error('Blog not found with id')
  }
  const update = { likes: blog.likes + 1 }
  const updatedBlog = await Blog.findByIdAndUpdate(id, update, { new: true })
  if (!updatedBlog) {
    logger.error('Vote could not be added')
  }
}

module.exports = {
  addVote
}