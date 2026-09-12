import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNumber(event.target.value)
  }

  const addPerson = (event) => {
  event.preventDefault()

  const existingPerson = persons.find(
    person => person.name === newName
  )

  if (existingPerson) {
    const confirmUpdate = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )

    if (confirmUpdate) {
      const updatedPerson = {
        ...existingPerson,
        number: number
      }

      personsService
        .updatePerson(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(person =>
              person.id === existingPerson.id
                ? returnedPerson
                : person
            )
          )

          setNewName('')
          setNumber('')
        })
    }

    return
  }

  const personObject = {
    name: newName,
    number: number
  }

  personsService.createPerson(personObject).then(returnedPerson => {
    setPersons(persons.concat(returnedPerson))
    setNewName('')
    setNumber('')
  })
}

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService.deletePerson(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with
        <input
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
      </div>

      <h2>add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        number={number}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson} />
    </div>
  )
}

export default App
