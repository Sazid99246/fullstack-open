import Content from "./Content";
import Header from "./Header";
import Total from "./Total";

const App = () => {
  const course = 'Half Stack application development';
  const exercise1 = 10;
  const exercise2 = 7;
  const exercise3 = 14;
  return (
    <div>
      <Header course = {course}/>
      <Content/>
      <Total exercise1={exercise1} exercise2={exercise2} exercise3={exercise3}/>
    </div>
  );
};

export default App;