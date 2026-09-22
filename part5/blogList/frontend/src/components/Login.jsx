import { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material'

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 5
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          p: 4
        }}
      >
        {notification && (
          <Typography
            color="error"
            sx={{ mb: 2 }}
          >
            {notification}
          </Typography>
        )}

        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 3 }}
        >
          Log in to application
        </Typography>

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            label="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default Login
