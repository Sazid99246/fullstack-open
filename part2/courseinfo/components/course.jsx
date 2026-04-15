const Header = (props) => {
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  );
};

const Part = (props) => {
  return (
    <p>{props.name} {props.exercises}</p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
        <Part name={part.name} exercises={part.exercises} key={part.id}/>
        )
      }
    </div>
  );
};

const Total = ({parts}) => {
  const exercises = parts.map(part => part.exercises)
  const total = exercises.reduce((s, p) => s + p);
  
  return (
    <p><b>total of {total} exercises</b></p>
  );
};

const Course = ({course}) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course;