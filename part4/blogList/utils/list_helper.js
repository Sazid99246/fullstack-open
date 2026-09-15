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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
