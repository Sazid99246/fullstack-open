require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)