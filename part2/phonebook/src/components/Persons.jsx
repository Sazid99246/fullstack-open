import Person from "./Person"

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person =>
        <Person
          key={person.id}
          id={person.id}
          name={person.name}
          number={person.number}
          deletePerson={deletePerson}
        />
      )}
    </div>
  )
}

export default Persons
