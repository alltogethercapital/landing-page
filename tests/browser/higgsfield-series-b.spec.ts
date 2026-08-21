import { expect, test } from "@playwright/test";

test("publishes the Higgsfield follow-on across the public portfolio surfaces", async ({
  page,
}) => {
  await page.goto("/");

  const homepageUpdate = page.getByRole("link", {
    name: /Higgsfield, again\./,
  });
  await expect(homepageUpdate).toHaveAttribute(
    "href",
    "/updates/higgsfield-series-b",
  );
  await expect(page.locator('a[aria-label="Higgsfield"]')).toHaveAttribute(
    "href",
    "https://higgsfield.ai/",
  );
  await page.screenshot({
    path: "output/playwright/higgsfield-series-b/homepage.png",
    fullPage: true,
  });

  await page.goto("/companies");
  const companyCard = page.locator("#higgsfield");
  await expect(companyCard.getByRole("link", { name: "Visit Higgsfield" })).toHaveAttribute(
    "href",
    "https://higgsfield.ai/",
  );

  await page.goto("/founders");
  await expect(page.getByRole("heading", { name: "Alex Mashrabov" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Yerzat Dulat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mahi de Silva" })).toBeVisible();

  await page.goto("/updates");
  await expect(
    page.getByRole("link", { name: /Higgsfield, again\./ }),
  ).toHaveAttribute("href", "/updates/higgsfield-series-b");

  await expect(async () => {
    const articleResponse = await page.goto("/updates/higgsfield-series-b");
    expect(articleResponse?.status()).toBe(200);
  }).toPass({ timeout: 15_000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Higgsfield, again.",
  );
  await expect(page.getByText("We invested again in Higgsfield.", { exact: false })).toBeVisible();
  await expect(page.getByText("$400 million Series B", { exact: false })).toBeVisible();
  await expect(page.getByText("Why we invested again")).toBeVisible();

  const articleText = await page.locator("main").innerText();
  expect(articleText).not.toContain("$999.89k");
  expect(articleText).not.toContain("0.7%");
  expect(articleText).not.toContain("Gross carry");
  expect(articleText).not.toContain("Management fee");
  await page.screenshot({
    path: "output/playwright/higgsfield-series-b/article.png",
    fullPage: true,
  });
});

test("serves the current homepage social preview with cache-busted metadata", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image\?[a-f0-9]+$/,
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    "content",
    "1200",
  );
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
    "content",
    "630",
  );

  const previewResponse = await page.request.get("/opengraph-image");
  expect(previewResponse.ok()).toBe(true);
  expect(previewResponse.headers()["content-type"]).toContain("image/png");
  expect((await previewResponse.body()).byteLength).toBeGreaterThan(20_000);
});
