import Person from "./Person";

const Persons = ({ personsToShow }) => {
    return (
        <div>
            {personsToShow.map(person =>
                <Person person={person} key={person.id} />)
            }
        </div>
    );
};

export default Persons;