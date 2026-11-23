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

test("loads the local Etale authored document", async ({ page }) => {
  await page.goto("/");
  const frame = page.locator(".etale-study iframe");
  await expect(frame).toHaveAttribute("src", "/sections/etale-numeral-plates.html");
  await frame.scrollIntoViewIfNeeded();
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
