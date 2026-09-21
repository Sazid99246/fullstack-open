import { useState } from 'react'

const Login = ({ handleLogin, notification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const onSubmit = async (event) => {
    event.preventDefault()
    await handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }
  return (
    <div>
      { notification && <div>{notification}</div> }
      <h2>Log in to application</h2>
      <form onSubmit={onSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )}

export default Login
