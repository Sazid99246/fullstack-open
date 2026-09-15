const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'https://example.com/html',
    likes: 5
  },
  {
    title: 'React is fun',
    author: 'Jane Doe',
    url: 'https://example.com/react',
    likes: 10
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have an id property', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a new blog can be added', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'New Author',
    url: 'https://example.com/new',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test('a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Sazid',
    url: 'https://example.com/no-likes'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('a blog without title is not added', async () => {
  const newBlog = {
    author: 'Sazid',
    url: 'https://example.com/no-title',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog without url is not added', async () => {
  const newBlog = {
    title: 'Blog without URL',
    author: 'Sazid',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await Blog.find({})

  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const deletedBlog = blogsAtEnd.find(
    blog => blog.id === blogToDelete.id
  )

  assert.strictEqual(deletedBlog, undefined)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    ...blogToUpdate.toJSON(),
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  const updatedBlogInDatabase = blogsAtEnd.find(
    blog => blog.id === blogToUpdate.id
  )

  assert.strictEqual(updatedBlogInDatabase.likes, 100)
})

after(async () => {
  await mongoose.connection.close()
})
