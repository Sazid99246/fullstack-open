const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password to arguement');
    process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.b16f3ws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteScheme = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteScheme);



const note = new Note({
    content: 'Mongoose makes things easy',
    date: new Date(),
    important: true,
})

// note.save().then(res => {
//     console.log('note saved');
//     mongoose.connection.close();
// })

Note.find({}).then(res => {
    res.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close()
})