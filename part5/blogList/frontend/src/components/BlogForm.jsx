import { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    await createBlog(blogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
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
          width: 500,
          p: 4
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 3 }}
        >
          Create new blog
        </Typography>

        <Box
          component="form"
          onSubmit={addBlog}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            label="Title"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            fullWidth
          />

          <TextField
            label="Author"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            fullWidth
          />

          <TextField
            label="URL"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
          >
            Create
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default BlogForm
