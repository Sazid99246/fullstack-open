import { useState } from 'react'
import Person from './component/Person';
import Filter from './component/Filter';
import PersonForm from './component/PersonForm';
import Persons from './component/Persons';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');

  const addPerson = event => {
    event.preventDefault();
    if (persons.find(person => person.name.toLowerCase() == newName.toLowerCase())) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = {
        name: newName,
        number: number,
        id: Date.now()
      }
      setPersons(persons.concat(personObject));
    }
    setNewName('');
    setNumber('');
  }

  const handleNameChange = event => {
    setNewName(event.target.value);
  }

  const handleNumberChange = event => {
    setNumber(event.target.value);
  }

  const handleFilterChange = event => {
    setFilter(event.target.value);
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchText={filter} handleSearchTextChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm newName={newName} handleNewName={handleNameChange} newNumber={number} handleNewNumber={handleNumberChange} handleCreatePerson={addPerson} />
      <h2>Numbers</h2>
      <br />
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App