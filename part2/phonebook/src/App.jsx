import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const updatePerson = (person) => {
    const ok = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )
    if (ok) {
      personService
        .update({ ...person, number: newNumber })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : updatedPerson))
          )
          clearForm()
        })
    }
  }

  const onAddNew = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((p) => p.name === newName)

    if (existingPerson) {
      updatePerson(existingPerson)
      return
    }

    personService
      .create({ name: newName, number: newNumber })
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson))
        clearForm()
      })
  }

  const onRemove = (person) => {
    const ok = window.confirm(`Delete ${person.name} ?`)
    if (ok) {
      personService
        .remove(person.id)
        .then(() => setPersons(persons.filter((p) => p.id !== person.id)))

    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} setFilter={setFilter} />

      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onAddNew={onAddNew}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} onRemove={onRemove} />
    </div>
  )
}

export default App