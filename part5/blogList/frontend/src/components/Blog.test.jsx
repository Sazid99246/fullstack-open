import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('Blog component', () => {
  test('renders blog title and author as a link', () => {
    const blog = {
      id: '123',
      title: 'Testing React components',
      author: 'Sazid',
      url: 'https://example.com',
      likes: 10
    }

    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', {
      name: /Testing React components Sazid/
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/blogs/123')
  })
})
