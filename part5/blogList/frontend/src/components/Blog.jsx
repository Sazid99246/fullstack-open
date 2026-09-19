import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    updateBlog(returnedBlog)
  }
  return (
    <div style={blogStyle}>
      <div className="blog-title-author">
        <span className="blog-title">{blog.title}</span>{' '}
        <span className="blog-author">{blog.author}</span>
      </div>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}</div>
          <button onClick={handleLike}>like</button>

          {blog.user && blog.user.username === user.username && (
            <button onClick={() => deleteBlog(blog.id)}>
              remove
            </button>
          )}

          <div>{blog.author}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
