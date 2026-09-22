import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls createBlog with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()

    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')

    await user.type(inputs[0], 'Testing React')
    await user.type(inputs[1], 'Sazid')
    await user.type(inputs[2], 'https://example.com')

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing React',
      author: 'Sazid',
      url: 'https://example.com'
    })
  })
})
