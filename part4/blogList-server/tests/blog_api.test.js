const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let token;

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = await new User({
    username: 'root',
    passwordHash,
  }).save();
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET);

  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});
describe('Initial state of database', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('blogs have id', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(typeof response.body[0].id, 'string');
  });
});

describe('Creation of blog', () => {
  test('Blog is successfully created by POST', async () => {
    const newBlog = {
      title: 'SICP in Emacs',
      author: 'Konstantinos Chousos',
      url: 'https://kchousos.github.io/posts/sicp-in-emacs/',
      likes: 20,
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`);
    
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const blogs = await api.get('/api/blogs');
    assert.strictEqual(blogs.body.length, helper.initialBlogs.length + 1);
    assert(blogs.body.map(blog => blog.title).includes('SICP in Emacs'));
  });

  test('Missing \'likes\' defaults to 0', async () => {
    const newBlog = {
      title: 'How the Grinch stole the Haskell Heap',
      author: 'Edward Z. Yang',
      url: 'http://blog.ezyang.com/2011/04/how-the-grinch-stole-the-haskell-heap/',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`);
    
    const response = await api.get('/api/blogs');
    const receivedBlog = response.body.find(b => b.author === 'Edward Z. Yang');

    assert.strictEqual(receivedBlog.likes, 0);
  });

  test('Blog that misses title or URL is rejected', async () => {
    const missing = {
      author: 'John Doe',
      likes: 8,
    };

    await api
      .post('/api/blogs')
      .send(missing)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });
});

describe('ID operations', () => {
  test('delete a blog by its id', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToDelete = blogsAtStart.body[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await api.get('/api/blogs');

    assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length - 1);
    assert(!blogsAtEnd.body.map(blog => blog.title).includes(blogToDelete.title));
  });
});

describe('update a blog', () => {
  test('update blog', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToUpdate = blogsAtStart.body[0];

    await api.put(`/api/blogs/${blogToUpdate.id}`).send({
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    })
      .expect(200);

    const blogsAtEnd = await api.get('/api/blogs');
    const updatedBlog = blogsAtEnd.body[0];
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('expected `username` to be unique'));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'as',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('shorter than the minimum allowed length (3)'));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'tester',
      name: 'Superuser',
      password: 'aa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('password must be at least 3 characters long'));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

describe('Bad token', () => {
  test('Adding a blog fails with status code 401 if token not provided', async () => {
    const newBlog = {
      title: 'SICP in Emacs',
      author: 'Konstantinos Chousos',
      url: 'https://kchousos.github.io/posts/sicp-in-emacs/',
      likes: 20,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ')
      .expect(401);

    const response = await api.get('/api/blogs');

    const titles = response.body.map(r => r.title);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
    assert(!titles.includes('SICP in Emacs'));
  });
});

after(async () => {
  await mongoose.connection.close();
});
