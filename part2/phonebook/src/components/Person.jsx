const Person = ({ id, name, number, deletePerson }) => {
  return (
    <p>
      {name} {number}
      <button onClick={() => deletePerson(id, name)}>
        delete
      </button>
    </p>
  )
}

export default Person
