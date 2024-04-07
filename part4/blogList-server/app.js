const cors = require('cors');
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const express = require('express')
const app = express()
const mongoose = require('mongoose');

mongoose.set('strictQuery', false)
const mongoUrl = config.MONGODB_URI
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app