import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <Alert
      severity="error"
      sx={{ mt: 2 }}
    >
      {message}
    </Alert>
  )
}

export default Notification
