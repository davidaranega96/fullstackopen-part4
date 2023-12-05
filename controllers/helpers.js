const User = require('../models/user')
const logger = require('../utils/logger')

const addBlogToUser = async (blog, user) => {
  const userBlogs = user.blogs
  userBlogs.push(blog.id)
  
  const updatedUser = {
    ...user, blogs: userBlogs
  }

  try {
    await User.findByIdAndUpdate(
      user.id, updatedUser
    )
  } catch (error) {
    logger.error(error)
  }
}

module.exports = { addBlogToUser }