import Part from "./Part";

const Content = () => {
    const part1 = 'Fundamentals of React';
    const exercise1 = 10;
    const part2 = 'Using props to pass data';
    const exercise2 = 7;
    const part3 = 'State of a component';
    const exercise3 = 14;
    return (
        <div>
            <Part part={part1} exercises={exercise1}></Part>
            <Part part={part2} exercises={exercise2}></Part>
            <Part part={part3} exercises={exercise3}></Part>
        </div>
    );
};

export default Content;