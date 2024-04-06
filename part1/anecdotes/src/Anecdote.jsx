const Anecdote = ({ anecdoteText, anecdoteVotes }) => {
    return (
      <p>
        {anecdoteText}<br />
        has {anecdoteVotes} votes
      </p>
    )
  }

export default Anecdote