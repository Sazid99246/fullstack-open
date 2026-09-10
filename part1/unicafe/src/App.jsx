import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad;
  const average = (props.good - props.bad) / all;
  const positive = (props.good / all) * 100

  return (
    <div>
      <h3>statistics</h3>
      <table>
        <tbody>
          <StatisticsLine text="good" value={props.good} />
          <StatisticsLine text="neutral" value={props.neutral} />
          <StatisticsLine text="bad" value={props.bad} />
          <StatisticsLine text="all" value={all} />
          <StatisticsLine text="average" value={average} />
          <StatisticsLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad;
  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      {all === 0
        ? <p>No feedback given</p>
        : <Statistics good={good} neutral={neutral} bad={bad} />
      }
    </div>
  )
}

export default App
