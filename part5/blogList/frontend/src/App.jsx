import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Button, Box } from '@mui/material'

import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import SingleBlog from './components/SingleBlog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'

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
      <Notification message={notification}></Notification>
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
      <AppBar position="static">
        <Toolbar>
          <Button
            color="inherit"
            component={Link}
            to="/"
          >
            Blog App
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            color="inherit"
            component={Link}
            to="/"
          >
            BLOGS
          </Button>

          {user && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/create"
              >
                NEW BLOG
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
              >
                LOGOUT
              </Button>
            </>
          )}

          {!user && (
            <Button
              color="inherit"
              component={Link}
              to="/login"
            >
              LOGIN
            </Button>
          )}
        </Toolbar>
      </AppBar>
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
