import { useState } from 'react'
import { useParams } from 'react-router-dom'
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
    <div>
      {notification && <div>{notification}</div>}
      <h2>{blog.title}</h2>
      <div>{blog.author}</div>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>likes {blog.likes}</div>
      {user && (
        <button onClick={handleLike}>like</button>
      )}

      {isCreator && (
        <button onClick={handleDelete}>remove</button>
      )}
    </div>
  )}

export default SingleBlog
