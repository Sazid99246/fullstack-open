import { useState, useEffect } from 'react'

import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notification, setNotification] = useState('')

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

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      setNotification('')
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (exception) {
      setNotification('error creating blog')
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && <div>{notification}</div>}

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>

        <div>
          author:
          <input
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>

        <div>
          url:
          <input
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>

        <button type="submit">create</button>
      </form>

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
        />
      )}
    </div>
  )
}

export default App
