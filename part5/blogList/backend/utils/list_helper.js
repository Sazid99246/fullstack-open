const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0

  blogs.forEach(blog => {
    sum += blog.likes
  })

  return sum
}

const favoriteBlog = (blogs) => {
  let favBlog = blogs[0]

  blogs.forEach(blog => {
    if (blog.likes > favBlog.likes) {
      favBlog = blog
    }
  })

  return favBlog
}

const mostBlogs = (blogs) => {
  const counts = _.countBy(blogs, 'author')

  const most = _.maxBy(_.toPairs(counts), pair => pair[1])

  return {
    author: most[0],
    blogs: most[1]
  }
}

const mostLikes = (blogs) => {
  const groupedBlogs = _.groupBy(blogs, 'author')

  const authorLikes = _.map(groupedBlogs, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes')
  }))

  return _.maxBy(authorLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
