const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://meowmeow:${password}@meow.aylzfms.mongodb.net/?appName=meow`
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
name: name,
number: number,
})

if (process.argv.length > 3) {
person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
})
}

if (process.argv.length === 3) {
    Person.find({})
    .then(persons => 
        {console.log('phonebook')
        persons.forEach(p => 
        console.log(`${p.name} ${p.number}`))
        mongoose.connection.close()
        })
}
