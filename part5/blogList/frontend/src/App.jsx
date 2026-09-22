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
import SingleBlog from './components/SingleBlog'
import CreateBlog from './components/CreateBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')

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
    navigate('/')
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
        <Link to="/">blogs</Link>{' '}
        {!user && (
          <Link to="/login">login</Link>
        )}
        {user && (
          <>
            <Link to="/create">create</Link>{' '}
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={blogView()} />
        <Route path="/login" element={loginView()} />
        <Route
          path="/create"
          element={<CreateBlog addBlog={addBlog} />}
        />
        <Route
          path="/blogs/:id"
          element={
            <SingleBlog
              blogs={blogs}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}
            />
          }
        />
      </Routes>
    </div>
  )}

export default App
