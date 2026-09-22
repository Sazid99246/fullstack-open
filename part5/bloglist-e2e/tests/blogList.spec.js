const { test, expect, beforeEach, describe } = require('@playwright/test')

test.setTimeout(10000)

const login = async (page, username, password) => {
  await page.goto('http://localhost:5173/login')

  const inputs = page.locator('input')

  await inputs.nth(0).fill(username)
  await inputs.nth(1).fill(password)

  await page.getByRole('button', { name: 'login' }).click()
}

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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'testuser', 'password')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')

      const inputs = page.locator('input')

      await inputs.nth(0).fill('testuser')
      await inputs.nth(1).fill('wrongpassword')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('wrong username or password')
      ).toBeVisible()
    })
  })

  test('a logged-in user can create a blog', async ({ page }) => {
    await login(page, 'testuser', 'password')

    await page.getByRole('link', { name: 'create' }).click()

    const blogInputs = page.locator('input')

    await blogInputs.nth(0).fill('My First Blog')
    await blogInputs.nth(1).fill('Test Author')
    await blogInputs.nth(2).fill('https://example.com')

    await page.getByRole('button', { name: 'create' }).click()

    await expect(
      page.getByRole('link', { name: /My First Blog Test Author/ })
    ).toBeVisible()
  })

  test('a logged-in user can like a blog', async ({ page }) => {
    await login(page, 'testuser', 'password')

    await page.getByRole('link', { name: 'create' }).click()

    const blogInputs = page.locator('input')

    await blogInputs.nth(0).fill('My First Blog')
    await blogInputs.nth(1).fill('Test Author')
    await blogInputs.nth(2).fill('https://example.com')

    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('link', {
      name: /My First Blog Test Author/
    }).click()

    await expect(page.getByText('likes 0')).toBeVisible()

    await page.getByRole('button', { name: 'like' }).click()

    await expect(page.getByText('likes 1')).toBeVisible()
  })

  test('a logged-in user can delete a blog', async ({ page }) => {
    await login(page, 'testuser', 'password')

    await page.getByRole('link', { name: 'create' }).click()

    const blogInputs = page.locator('input')

    await blogInputs.nth(0).fill('My First Blog')
    await blogInputs.nth(1).fill('Test Author')
    await blogInputs.nth(2).fill('https://example.com')

    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('link', {
      name: /My First Blog Test Author/
    }).click()

    page.on('dialog', dialog => dialog.accept())

    await page.getByRole('button', { name: 'remove' }).click()

    await expect(
      page.getByRole('link', { name: /My First Blog Test Author/ })
    ).not.toBeVisible()
  })
})
