import { useNavigate } from 'react-router-dom'
import BlogForm from './BlogForm'

const CreateBlog = ({ addBlog }) => {
  const navigate = useNavigate()

  const handleCreate = async blogObject => {
    await addBlog(blogObject)
    navigate('/')
  }

  return (
    <div>
      <h2>create a new blog</h2>
      <BlogForm createBlog={handleCreate} />
    </div>
  )
}

export default CreateBlog
