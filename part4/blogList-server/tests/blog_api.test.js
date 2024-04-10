const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('the length of blogs is returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier of the blog posts is id', async () => {
    const blogs = await api.get('/api/blogs')
    assert.strictEqual(blogs.body[0].id, helper.initialBlogs[0]._id) 
})

test('a new blog is created', async () => {
  const newBlog = {
    title: 'SICP in Emacs',
    author: 'Konstantinos Chousos',
    url: 'https://kchousos.github.io/posts/sicp-in-emacs/',
    likes: 20
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('Missing \'likes\' defaults to 0', async () => {
    const newBlog = {
      title: 'How the Grinch stole the Haskell Heap',
      author: 'Edward Z. Yang',
      url: 'http://blog.ezyang.com/2011/04/how-the-grinch-stole-the-haskell-heap/',
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
  
    const response = await api.get('/api/blogs')  
    const receivedBlog = response.body.find(b => b.author === 'Edward Z. Yang')
    assert.strictEqual(receivedBlog.likes, 0)
})

test('Blog that misses title or URL is rejected', async () => {
  const missing = {
    author: 'John Doe',
    likes: 8,
  }

  await api
    .post('/api/blogs')
    .send(missing)
    .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('deletion of a post', async () => { 
  const blogAtStart = await helper.blogsInDb()
  const blogToDelete = blogAtStart[0]

  await api
  .delete(`/api/blogs/${blogToDelete.id}`)
  .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const contents = blogsAtEnd.map(r => r.content)
  assert(!contents.includes(blogToDelete.content))
})

test('update a blog', async () => { 
  const blogAtStart = await helper.blogsInDb()
  const blogToUpdate = blogAtStart[0]
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(
    {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    })
    .expect(200)
  
  const updatedBlog = blogAtStart.body[0]
  assert.strictEqual(updatedBlog.likes === helper.initialBlogs[0].likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})