import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Blog from './Blog'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

describe('Blog component', () => {
  test('renders title and author but not URL or likes by default', () => {
    const blog = {
      title: 'Testing React components',
      author: 'Sazid',
      url: 'https://example.com',
      likes: 10,
      user: {
        username: 'sazid'
      }
    }

    const user = {
      username: 'sazid'
    }

    render(
      <Blog
        blog={blog}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
        user={user}
      />
    )

    expect(screen.getByText('Testing React components')).toBeInTheDocument()
    expect(screen.getByText('Sazid')).toBeInTheDocument()

    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('likes 10')).not.toBeInTheDocument()
  })
})

test('renders URL and likes when the view button is clicked', async () => {
  const blog = {
    title: 'Testing React components',
    author: 'Sazid',
    url: 'https://example.com',
    likes: 10,
    user: {
      username: 'sazid'
    }
  }

  const user = {
    username: 'sazid'
  }

  render(
    <Blog
      blog={blog}
      updateBlog={vi.fn()}
      deleteBlog={vi.fn()}
      user={user}
    />
  )

  const viewButton = screen.getByText('view')

  const userEventSetup = userEvent.setup()
  await userEventSetup.click(viewButton)

  expect(screen.getByText('https://example.com')).toBeInTheDocument()
  expect(screen.getByText('likes 10')).toBeInTheDocument()
})

test('calls updateBlog twice when the like button is clicked twice', async () => {
  const blog = {
    title: 'Testing React components',
    author: 'Sazid',
    url: 'https://example.com',
    likes: 10,
    user: {
      username: 'sazid'
    }
  }

  const user = {
    username: 'sazid'
  }

  const updateBlog = vi.fn()

  blogService.update.mockResolvedValue(blog)

  render(
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      deleteBlog={vi.fn()}
      user={user}
    />
  )

  const userEventSetup = userEvent.setup()

  await userEventSetup.click(screen.getByText('view'))
  await userEventSetup.click(screen.getByText('like'))
  await userEventSetup.click(screen.getByText('like'))

  expect(updateBlog).toHaveBeenCalledTimes(2)
})
