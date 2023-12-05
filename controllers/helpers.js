const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const decodeBearerToken = request => {
  const encodedToken = getTokenFrom(request)
  try {
    return jwt.verify(encodedToken, process.env.SECRET)
  } catch {
    return null
  }
}

module.exports = { decodeBearerToken }