import { useState } from 'react'

const StaticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positive = total === 0 ? 0 : (good / total) * 100

  return (
    <div>
      <h2>statistics</h2>
      {(good === 0 && neutral === 0 && bad === 0) ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <tbody>
            <StaticLine text="good" value={good} />
            <StaticLine text="neutral" value={neutral} />
            <StaticLine text="bad" value={bad} />
            <StaticLine text="all" value={total} />
            <StaticLine text="average" value={average} />
            <StaticLine text="positive" value={`${positive}%`} />
          </tbody>
        </table>
      )}
    </div>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App