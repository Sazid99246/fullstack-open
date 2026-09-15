const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')


const app = express()

mongoose.connect(config.MONGO_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(middleware.requestLogger)



module.exports = app
