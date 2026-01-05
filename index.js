require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body',function (req,res) {
    return JSON.stringify(req.body)
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Hange Zoë", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Senku Ishigami", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Gen Asagiri", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Edward Elric", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
  res.json(persons)
  }) 
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id).then(person => {
if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
  })
})

app.get('/info', (req, res) => {
      res.send(`
        <body style ="
        background-color: black;
        color: white">
        <h1> Phonebook has info for ${persons.length} people </h1>
        <p> ${new Date()} </p>
        </body>
        `)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

    if (!body) {
    return res.status(400).json({
      error: 'name and number missing'
    })
  }

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  Person.findOne({name: body.name}).then(person => {
    if (person) {
    return res.status(400).json({
      error: 'name already exists in phonebook'
    })}
   else {
   const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
  res.json(savedPerson)
  })
   }
})

})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.deleteOne({_id: id}).then(response => {console.log(response)
try { if (response.deletedCount > 0) {
  res.status(204).end()
}}
catch (err) {
  return res.status(400).json({
      error: err.message
    })
}})
})
const PORT = process.env.PORT || 3001
app.listen(PORT)