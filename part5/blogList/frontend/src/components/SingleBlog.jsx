import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Paper, Typography, Button, Link } from '@mui/material'

import blogService from '../services/blogs'

const SingleBlog = ({ blogs, updateBlog, deleteBlog, user }) => {
  const [notification, setNotification] = useState('')
  const { id } = useParams()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
  }

  const handleLike = async () => {
    if (!user) {
      return
    }
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      const returnedBlog = await blogService.update(
        blog.id,
        updatedBlog
      )
      updateBlog(returnedBlog)
    } catch (error) {
      console.log('Like error:', error)
      setNotification('error updating blog')
    }
  }

  const handleDelete = async () => {
    await deleteBlog(blog.id)
  }
  const isCreator = user && blog.user && blog.user.username === user.username
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mt: 4,
        maxWidth: 700
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
        variant="h4"
        component="h2"
        sx={{ mb: 2 }}
      >
        {blog.title}
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{ mb: 2 }}
      >
        by {blog.author}
      </Typography>

      <Link
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ display: 'block', mb: 2 }}
      >
        {blog.url}
      </Link>

      <Typography sx={{ mb: 2 }}>
        likes {blog.likes}
      </Typography>

      {user && (
        <Button
          variant="contained"
          onClick={handleLike}
          sx={{ mr: 2 }}
        >
          Like
        </Button>
      )}

      {isCreator && (
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
        >
          Remove
        </Button>
      )}
    </Paper>
  )}

export default SingleBlog
