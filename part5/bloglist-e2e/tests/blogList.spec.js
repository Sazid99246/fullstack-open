const { test, expect, beforeEach, describe } = require('@playwright/test')

test.setTimeout(10000)

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'password'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'otheruser',
        name: 'Other User',
        password: 'password'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const inputs = page.locator('input')

      await inputs.nth(0).fill('testuser')
      await inputs.nth(1).fill('password')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const inputs = page.locator('input')

      await inputs.nth(0).fill('testuser')
      await inputs.nth(1).fill('wrongpassword')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('wrong username or password')
      ).toBeVisible()
    })
  })


  test('a new blog can be created', async ({ page }) => {
    const inputs = page.locator('input')
    await inputs.nth(0).fill('testuser')
    await inputs.nth(1).fill('password')

    await page.getByRole('button', { name: 'login' }).click()

    await page.getByRole('button', { name: 'create new blog' }).click()

    const blogInputs = page.locator('input')

    await blogInputs.nth(0).fill('My First Blog')
    await blogInputs.nth(1).fill('Test Author')
    await blogInputs.nth(2).fill('https://example.com')

    await page.getByRole('button', { name: 'create' }).click()

    await expect(page.getByText('My First Blog').first()).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    const inputs = page.locator('input')
    await inputs.nth(0).fill('testuser')
    await inputs.nth(1).fill('password')

    await page.getByRole('button', { name: 'login' }).click()

    await page.getByRole('button', { name: 'create new blog' }).click()

    const blogInputs = page.locator('input')

    await blogInputs.nth(0).fill('My First Blog')
    await blogInputs.nth(1).fill('Test Author')
    await blogInputs.nth(2).fill('https://example.com')

    await page.getByRole('button', { name: 'create' }).click()

    const blog = page.getByText('My First Blog').first()
    await expect(blog).toBeVisible()

    const blogContainer = blog.locator('..').locator('..')

    await blogContainer.getByRole('button', { name: 'view' }).click()

    await blogContainer.getByRole('button', { name: 'like' }).click()

    await expect(blogContainer.getByText('likes 1')).toBeVisible()
  })

  test('a blog can be deleted by the user who created it', async ({ page }) => {
    const inputs = page.locator('input')
    await inputs.nth(0).fill('testuser')
    await inputs.nth(1).fill('password')

    await page.getByRole('button', { name: 'login' }).click()

    await page.getByRole('button', { name: 'create new blog' }).click()

    const blogInputs = page.locator('input')

    await blogInputs.nth(0).fill('My First Blog')
    await blogInputs.nth(1).fill('Test Author')
    await blogInputs.nth(2).fill('https://example.com')

    await page.getByRole('button', { name: 'create' }).click()

    const blog = page.getByText('My First Blog').first()
    await expect(blog).toBeVisible()

    const blogContainer = blog.locator('..').locator('..')

    await blogContainer.getByRole('button', { name: 'view' }).click()

    page.on('dialog', dialog => dialog.accept())

    await page.getByRole('button', { name: 'remove' }).click()

    await expect(page.getByText('My First Blog')).not.toBeVisible()
  })

  test('only the user who created the blog sees the remove button', async ({ page }) => {
    const inputs = page.locator('input')
    await inputs.nth(0).fill('testuser')
    await inputs.nth(1).fill('password')

    await page.getByRole('button', { name: 'login' }).click()

    await page.getByRole('button', { name: 'create new blog' }).click()

    const blogInputs = page.locator('input')

    await blogInputs.nth(0).fill('My First Blog')
    await blogInputs.nth(1).fill('Test Author')
    await blogInputs.nth(2).fill('https://example.com')

    await page.getByRole('button', { name: 'create' }).click()

    await expect(page.getByText('My First Blog').first()).toBeVisible()

    await page.getByRole('button', { name: 'logout' }).click()

    const loginInputs = page.locator('input')
    await loginInputs.nth(0).fill('otheruser')
    await loginInputs.nth(1).fill('password')

    await page.getByRole('button', { name: 'login' }).click()

    const blog = page.getByText('My First Blog').first()
    const blogContainer = blog.locator('..').locator('..')

    await blogContainer.getByRole('button', { name: 'view' }).click()

    await expect(
      page.getByRole('button', { name: 'remove' })
    ).not.toBeVisible()
  })

  test('blogs are sorted according to likes', async ({ page }) => {
    const inputs = page.locator('input')
    await inputs.nth(0).fill('testuser')
    await inputs.nth(1).fill('password')

    await page.getByRole('button', { name: 'login' }).click()

    const createBlog = async (title, author, url) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      const blogInputs = page.locator('input')

      await blogInputs.nth(0).fill(title)
      await blogInputs.nth(1).fill(author)
      await blogInputs.nth(2).fill(url)

      await page.getByRole('button', { name: 'create' }).click()
    }

    await createBlog(
      'Blog 1',
      'Author 1',
      'https://example.com/blog1'
    )

    await createBlog(
      'Blog 2',
      'Author 2',
      'https://example.com/blog2'
    )

    await createBlog(
      'Blog 3',
      'Author 3',
      'https://example.com/blog3'
    )

    const blogs = page.locator('.blog')

    await expect(blogs).toHaveCount(3)

    const blog1 = blogs.filter({ hasText: 'Blog 1' })
    const blog2 = blogs.filter({ hasText: 'Blog 2' })
    const blog3 = blogs.filter({ hasText: 'Blog 3' })

    await blog1.getByRole('button', { name: 'view' }).click()
    await blog2.getByRole('button', { name: 'view' }).click()
    await blog3.getByRole('button', { name: 'view' }).click()

    for (let i = 0; i < 5; i++) {
      await blog1.getByRole('button', { name: 'like' }).click()
      await expect(blog1.getByText(`likes ${i + 1}`)).toBeVisible()
    }

    for (let i = 0; i < 3; i++) {
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText(`likes ${i + 1}`)).toBeVisible()
    }

    for (let i = 0; i < 7; i++) {
      await blog3.getByRole('button', { name: 'like' }).click()
      await expect(blog3.getByText(`likes ${i + 1}`)).toBeVisible()
    }

    const titles = await page.locator('.blog-title').allTextContents()

    expect(titles).toEqual([
      'Blog 3',
      'Blog 1',
      'Blog 2'
    ])
  })
})
