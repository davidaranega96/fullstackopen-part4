const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requireAuthentication = {
  'POST': ['/api/blogs/'],
  'GET': [],
  'DELETE': ['/api/blogs/'],
  'PUT': []
}

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

const authenticateToken = (request, response, next) => {
  const method = request.method
  const path = request.path
  if (requireAuthentication[method].some((requiredPath) => path.startsWith(requiredPath))) {
    console.log('deleting blog...')
    const token = decodeBearerToken(request)
    if (!token) {
      return response.status(401).send({ error: 'invalid token' })
    }
    request.user = token
    next()
  } else {
    next()
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandling = (error, request, response, next) => {
  logger.error('Error handling the data ', error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted data' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = {
  errorHandling, unknownEndpoint, authenticateToken
}