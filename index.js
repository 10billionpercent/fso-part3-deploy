const express = require('express')
const app = express()
app.use(express.json())

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
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
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

  if (persons.some(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name already exists in phonebook'
    })
  }

  const generatedId = Math.floor(Math.random() * 1000)
  const person = {
    id: generatedId,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.json(person)
  
})
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})
const PORT = 3001
app.listen(PORT)