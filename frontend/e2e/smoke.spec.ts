import { test, expect } from "@playwright/test"

test("app loads and shows navbar", async ({ page }) => {
  await page.goto("/")
  // Title may vary; check for a stable element in the navbar instead
  await expect(page.getByRole("navigation")).toBeVisible()
})

