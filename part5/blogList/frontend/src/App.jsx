import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom'

import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [newBlogVisible, setNewBlogVisible] = useState(false)

  const navigate = useNavigate()

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

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })

      blogService.setToken(user.token)
      setUser(user)

      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
      setNotification('')

      navigate('/')
    } catch {
      setNotification('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      setNotification('')
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlogVisible(false)
    } catch {
      setNotification('error creating blog')
    }
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    ))
  }

  const deleteBlog = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?')

    if (!confirmed) {
      return
    }

    await blogService.remove(id)

    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const loginView = () => ( <Login
    handleLogin={handleLogin}
    notification={notification}
  />
  )

  const blogView = () => (
    <div>
      <h2>blogs</h2>
      {notification && <div>{notification}</div>}

      {user && (
        newBlogVisible ? (
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
        )
      )}

      <BlogList
        blogs={blogs}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
        user={user}
      />
    </div>
  )

  return (
    <div>
      <nav>
        <Link to="/">blogs</Link>
        {!user && (
          <Link to="/login">login</Link>
        )}
        {user && (
          <>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={blogView()} />
        <Route path="/login" element={loginView()} />
      </Routes>
    </div>
  )}

export default App
