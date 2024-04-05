const mongoose = require('mongoose');

const Note = mongoose.model('Note', noteScheme);

const note = new Note({
    content: 'Mongoose makes things easy',
    date: new Date(),
    important: true,
})

Note.find({}).then(res => {
    res.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close()
})