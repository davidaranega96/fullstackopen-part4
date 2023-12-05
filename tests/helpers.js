const jwt = require('jsonwebtoken')
const User = require('../models/user')

const testUser = {
  username: 'testuser',
  name: 'Mr Tester',
  password: 'abcd1234'
}

const getTestUserToken = async () => {
  const user = await User.findOne({ username: testUser.username })
  return jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
}

module.exports = { testUser, getTestUserToken }