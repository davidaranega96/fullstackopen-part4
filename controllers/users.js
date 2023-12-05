const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1, author: 1 })
    if (users) {
      response.json(users)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

userRouter.post('', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!password) {
      return response.status(400).json({ error: 'Password and username required' })
    }

    if (password.length < 3) {
      return response.status(400).json({ error: 'Password minimum length is 3' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = userRouter