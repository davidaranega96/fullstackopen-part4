const logger = require('./logger')

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
  errorHandling, unknownEndpoint
}