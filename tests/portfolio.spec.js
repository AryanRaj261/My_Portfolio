import { expect, test } from "@playwright/test";

test("navigates to selected work and changes the active case study", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });

  await expect(page.locator(".nav-links a[href='#work']")).toHaveAttribute("href", "#work");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator("#work-title")).toHaveText("Ink Creative Studio");

  await page.getByRole("tab", { name: /Gamily/ }).click();
  await expect(page.locator("#work-title")).toHaveText("Gamily");
  await expect(page.getByText("Gaming discovery", { exact: true })).toBeVisible();
});

test("opens and closes mobile navigation with the keyboard", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only interaction");
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: "Experience" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("link", { name: "Experience" })).not.toBeVisible();
});
