import Blog from './Blog'

const BlogList = ({ blogs, updateBlog, deleteBlog, user }) => {
  return (
    <div>
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
    </div>
  )}

export default BlogList
