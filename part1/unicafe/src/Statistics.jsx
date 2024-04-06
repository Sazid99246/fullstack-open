import React from 'react'
import StatisticLine from './StatisticLine'

const Statistics = props => {
    const total = props.good + props.neutral + props.bad
    const average = (props.good - props.bad) / total
    const positive = 100 * props.good / total

    if (total === 0) {
        return (
            <div>No feedback given</div>
        )
    } else {
        return (
            <div>
                <table>
                    <tbody>
                        <StatisticLine text="good" value={props.good}></StatisticLine>
                        <StatisticLine text="neutral" value={props.neutral}></StatisticLine>
                        <StatisticLine text="bad" value={props.bad}></StatisticLine>
                        <StatisticLine text="all" value={total}></StatisticLine>
                        <StatisticLine text="average" value={average}></StatisticLine>
                        <StatisticLine text="positive" value={positive}></StatisticLine>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Statistics