require('dotenv').config()

const mongoose = require('mongoose')
const app = require('./app')

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })
