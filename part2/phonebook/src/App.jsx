import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
    }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: number,
      id: String(persons.length + 1)
    }

    const allNames = persons.map(person => person.name.toLowerCase());

    if (allNames.includes(newName.toLowerCase())) {
      window.alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNumber('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
   setFilter(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter value={filter} onChange={handleFilterChange} />

      <h2>add a new</h2>
      
      <PersonForm 
        onSubmit={addPerson}
        name={newName}
        onNameChange={handleNameChange}
        number={number}
        onNumberChange={handleNumberChange}
       />

      <h2>Numbers</h2>

      <Persons persons={filteredPersons} />
      

    </div>
  )
}

export default App