import { test, expect } from "@playwright/test"

test("signup -> login -> lands on dashboard", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`
  const password = "Playwright1!"

  await page.goto("/")

  // Navigate to signup
  await page.getByRole("link", { name: /sign ?up/i }).click()

  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  const fullName = page.getByLabel(/full\s*name/i)
  if (await fullName.isVisible()) {
    await fullName.fill("E2E User")
  }
  await page.getByRole("button", { name: /sign ?up/i }).click()

  // After signup, navigate to login if not redirected
  if (!(await page.getByRole("link", { name: /logout/i }).isVisible({ timeout: 1000 }).catch(() => false))) {
    await page.getByRole("link", { name: /log ?in/i }).click()
    await page.getByLabel(/email/i).fill(email)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole("button", { name: /log ?in/i }).click()
  }

  // Expect some authenticated UI element
  await expect(page.getByText(/settings|profile|dashboard/i)).toBeVisible()
})

