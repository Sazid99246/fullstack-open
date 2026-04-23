const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  assert.ok(blog.id, 'id property is missing')
  assert.strictEqual(blog._id, undefined)
})

test('a valid blog can be added and increases total count', async () => {
  const newBlog = {
    title: 'Async/Await Testing',
    author: 'Sazid',
    url: 'http://example.com/test',
    likes: 7,
  }

  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes(newBlog.title))
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'No likes field',
    author: 'Sazid',
    url: 'http://example.com/nolikes',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Sazid',
    url: 'http://example.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Missing URL',
    author: 'Sazid',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes(blogToDelete.title))
})

test('a blog can be updated (likes)', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 10,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, updatedData.likes)
})

after(async () => {
    mongoose.connection.close()
})
