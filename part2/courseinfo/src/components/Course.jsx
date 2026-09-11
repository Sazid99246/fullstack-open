const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = ({ course}) => {
  return <h1>{course.name}</h1>
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part =>
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      )}
    </div>
  )
}

const Total = ({ parts }) => {
  const exercises = parts.map(part => part.exercises);
  const totalExercises = exercises.reduce((s, p) => s + p);
  return (
    <p><strong>total of {totalExercises} exercises</strong></p>
  )
}

export default Course;
