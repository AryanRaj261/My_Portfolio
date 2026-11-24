import { expect, test } from "@playwright/test";

test("navigates to selected work and changes the active case study", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });

  await expect(page.locator(".portfolio-nav__links a[href='#work']")).toHaveAttribute("href", "#work");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator("#work-title")).toHaveText("Ink Creative Studio");

  await page.getByRole("tab", { name: /Gamily/ }).click();
  await expect(page.locator("#work-title")).toHaveText("Gamily");
  await expect(page.getByText("Independent product concept", { exact: true })).toBeVisible();
});

test("supports keyboard selection between work case studies", async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: /Ink Creative Studio/ }).press("ArrowRight");
  await expect(page.locator("#work-title")).toHaveText("Gamily");
  await expect(page.getByRole("tab", { name: /Gamily/ })).toBeFocused();
});

test("renders the condensation canvas at backing resolution", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator(".scene-condensation canvas");
  await expect(canvas).toBeVisible();
  await expect.poll(() => canvas.evaluate((element) => element.width >= element.clientWidth && element.height >= element.clientHeight)).toBeTruthy();
});

test("keeps portfolio section navigation available on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only interaction");
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: "Experience" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
});

test("keeps the portfolio command navigation destinations intact", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
  }
  await expect(page.getByRole("link", { name: "About" }).first()).toHaveAttribute("href", "#about");
  await expect(page.getByRole("link", { name: "Work" }).first()).toHaveAttribute("href", "#work");
  await expect(page.getByRole("link", { name: "Experience" }).first()).toHaveAttribute("href", "#experience");
  await expect(page.getByRole("link", { name: "Contact" }).first()).toHaveAttribute("href", "#contact");
});

test("switches the persisted color theme and opens the secure access dialog", async ({ page }, testInfo) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Switch to .* mode/ });
  const before = await page.locator("html").getAttribute("data-theme");
  await toggle.click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", before || "");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "Log in or sign up" }).click();
  } else {
    await page.getByRole("button", { name: "Log in" }).click();
  }
  await expect(page.getByRole("dialog", { name: /Welcome back/ })).toBeVisible();
  await expect(page.getByText(/Authentication needs configuration/i)).toBeVisible();
});

test("opens the portfolio guide and answers a project question", async ({ page }) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Open portfolio guide" });
  await launcher.click();

  const guide = page.getByRole("region", { name: "A quick way to explore." });
  await expect(guide).toBeVisible();
  await guide.getByRole("button", { name: "What does Aryan build?" }).click();
  await expect(guide.getByText(/frontend UI work/i)).toBeVisible();
  await guide.getByRole("button", { name: "Close portfolio guide" }).click();
  await expect(guide).not.toBeVisible();
});

test("renders deployment metadata from the configured site URL", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("head link[rel='canonical']")).toHaveAttribute("href", /my-portfolio-jade-nine-22\.vercel\.app/);
  await expect(page.locator("head meta[property='og:image']")).toHaveAttribute("content", /og-cover\.png$/);
});

test("offers a direct email contact path", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: /aryanraj9011@gmail.com/i })).toHaveAttribute("href", "mailto:aryanraj9011@gmail.com");
});
