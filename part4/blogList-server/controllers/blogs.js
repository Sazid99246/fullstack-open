const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
  .find({})
  .then(blogs => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {
  const { title, url } = request.body
  if (!title || !url) return response.status(400).end

  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.status(200).json(blog)
})

module.exports = blogRouter
