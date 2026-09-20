import { useState, useEffect } from 'react'

import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [newBlogVisible, setNewBlogVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })

      blogService.setToken(user.token)

      setUser(user)
      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(user)
      )

      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        {notification && <div>{notification}</div>}

        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
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
    )
  }

  const addBlog = async (blogObject) => {
    try {
      setNotification('')
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlogVisible(false)
    } catch (exception) {
      setNotification('error creating blog')
    }
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    ))
  }

  const deleteBlog = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this blog?'
    )

    if (!confirmed) {
      return
    }

    await blogService.remove(id)

    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && <div>{notification}</div>}

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      {newBlogVisible ? (
        <div>
          <BlogForm createBlog={addBlog} />
          <button onClick={() => setNewBlogVisible(false)}>
            cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setNewBlogVisible(true)}>
          create new blog
        </button>
      )}

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        )}
    </div>
  )
}

export default App
