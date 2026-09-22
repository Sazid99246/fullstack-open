import Blog from './Blog'

const BlogList = ({ blogs, updateBlog, deleteBlog, user }) => {
  return (
    <ul>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        )}
    </ul>
  )}

export default BlogList
