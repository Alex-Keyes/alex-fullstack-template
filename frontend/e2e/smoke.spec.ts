import { test, expect } from "@playwright/test"

test("app loads and shows navbar", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/FastAPI Project/i)
  await expect(page.getByRole("navigation")).toBeVisible()
})

