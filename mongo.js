const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://meowmeow:${password}@meow.aylzfms.mongodb.net/?appName=meow`
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
name: 'meow',
number: 4875639876,
})

person.save().then(result => {
    console.log('MEOW')
    mongoose.connection.close()
})