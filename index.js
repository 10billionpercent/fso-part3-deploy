require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body',function (req,_res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    }
    else {
      res.status(404).end()
    }
  })
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`
        <body style ="
        background-color: black;
        color: white">
        <h1> Phonebook has info for ${persons.length} people </h1>
        <p> ${new Date()} </p>
        </body>
        `)
  })
})

app.post('/api/persons', (req, res, next) => {
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
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  Person.findById(req.params.id).then(person => {
    if (!person) {
      return res.status(404).end()
    }

    person.name = name
    person.number = number

    return person.save().then(updatedPerson => {
      res.json(updatedPerson)
    })
  })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id).then(_result => {
    res.status(204).end()
  })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error : 'malformatted id' })
  }
  else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const unknownErrorHandler = (err, req, res, _next) => {
  console.log(err.message)
  return res.status(500).send({ error: 'internal server error' })
}

app.use(unknownErrorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT)