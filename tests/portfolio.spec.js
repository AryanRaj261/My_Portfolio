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

test("activates the Glass AI particle burst", async ({ page }) => {
  test.slow();
  await page.goto("/");
  const host = page.locator(".hero-ai-button .glass-ai-button");
  await expect(host).toHaveAttribute("data-state", "ready", { timeout: 12_000 });
  const glassFrame = host.locator("iframe").contentFrame();
  await expect(glassFrame.locator("#glass")).toHaveAttribute("data-engine", "three.js r170");
  await glassFrame.getByRole("button", { name: "GPT 6 Sol — activate the galaxy" }).click({ force: true });
  await expect(glassFrame.locator("#status")).toHaveText("GPT 6 Sol — particle burst");
});

test("keeps portfolio section navigation available on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only interaction");
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: "Experience" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
});

test("loads the local Etale authored document", async ({ page }) => {
  await page.goto("/");
  const frame = page.locator(".etale-study iframe");
  await page.locator(".etale-study").scrollIntoViewIfNeeded();
  await expect(frame).toHaveAttribute("src", "/sections/etale-numeral-plates.html", { timeout: 12_000 });
  const etale = frame.contentFrame();
  await expect(etale.locator("#numbers")).toBeVisible();
  await expect(etale.locator(".nums video[src]").first()).toHaveAttribute("src", /ee57293b41f7fc57f4013dcc66ca5a1d\.webm/);

  const authoredFrame = page.frames().find((candidate) => candidate.url().includes("/sections/etale-numeral-plates.html"));
  await authoredFrame.evaluate(() => {
    const track = document.querySelector(".numbers .track");
    window.scrollTo(0, (track.offsetHeight - window.innerHeight) * 0.425);
  });
  await expect(etale.locator(".card[data-i='1']")).toHaveCSS("opacity", "1");
});

test("loads the configured Character Filmstrip and responds to keyboard motion", async ({ page }) => {
  test.slow();
  await page.goto("/");
  const host = page.locator(".character-study .character-carousel");
  await host.scrollIntoViewIfNeeded();
  const filmstrip = host.locator("iframe").contentFrame();

  await expect(filmstrip.locator("#deck[data-testid='filmstrip']")).toBeVisible();
  await expect(filmstrip.locator(".card")).toHaveCount(9);
  const activeBefore = await filmstrip.locator(".card[aria-current='true']").getAttribute("aria-label");
  await filmstrip.locator("#stage").press("ArrowRight");
  await expect.poll(() => filmstrip.locator(".card[aria-current='true']").getAttribute("aria-label")).not.toBe(activeBefore);
});

test("keeps the portfolio command navigation destinations intact", async ({ page }) => {
  await page.goto("/");
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
