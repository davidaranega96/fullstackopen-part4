const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)
logger.info('connecting to ', config.DB_URL)

mongoose.connect(config.DB_URL)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB!', error.message)
  })

app.use(cors())
/*app.use(express.static('dist'))*/
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandling)

module.exports = app