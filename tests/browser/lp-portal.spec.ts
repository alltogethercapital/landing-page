import { expect, test } from "@playwright/test";

const password = process.env.LP_TEST_PASSWORD || "StagingPortalPassphrase-2026";

test("protects, authenticates, shows the investment graph, and opens an investment", async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto("/lp/updates");
  await expect(page).toHaveURL(/\/lp-login$/);
  await expect(page.getByRole("heading", { name: "Investor portal." })).toBeVisible();
  const publicLogoBox = await page.locator(".cog-nav-logo").boundingBox();
  expect(publicLogoBox).not.toBeNull();

  await page.getByLabel("Access password").fill("incorrect-password");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp-login\?error=invalid$/);
  await expect(page.locator("#lp-login-error")).toContainText("not valid");

  await page.getByLabel("Access password").fill(password);
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp$/);
  const portfolioSections = page.getByRole("navigation", { name: "Portfolio sections" });
  const investmentsSectionLink = portfolioSections.getByRole("link", { name: "Investments", exact: true });
  const insightsLink = portfolioSections.getByRole("link", { name: "Insights", exact: true });
  const performanceLink = portfolioSections.getByRole("link", { name: "Performance", exact: true });
  await expect(investmentsSectionLink).toHaveAttribute("aria-current", "page");
  await expect(insightsLink).not.toHaveAttribute("aria-current");
  await expect(performanceLink).not.toHaveAttribute("aria-current");
  await expect(page.locator("#lp-portfolio-heading")).toHaveClass(/sr-only/);
  await expect(page.getByRole("button", { name: "Graph view" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Table view" })).toHaveCount(0);
  await expect(page.getByText("43 companies · 1 not-yet-allocated balance", { exact: true })).toHaveCount(0);
  await expect(page.getByText("$661,014", { exact: true })).toBeVisible();
  const summaryGrid = page.locator(".lp-summary-grid");
  await expect(summaryGrid.getByText("$661,014.25", { exact: true })).toHaveCount(0);
  await expect(summaryGrid.getByText("$741,760.05", { exact: true })).toHaveCount(0);
  await expect(summaryGrid.getByText("$112,000.00", { exact: true })).toHaveCount(0);
  const aumTerm = summaryGrid.getByLabel("About AUM");
  const navTerm = summaryGrid.getByLabel("About NAV");
  const finalizingTerm = summaryGrid.getByLabel("About Finalizing allocation");
  const multipleTerm = summaryGrid.getByLabel("About Gross value multiple");
  await expect(summaryGrid.locator(".lp-summary-term")).toHaveCount(4);
  await expect(aumTerm).toHaveAttribute("aria-describedby", "lp-aum-tooltip");
  await expect(navTerm).toHaveAttribute("aria-describedby", "lp-nav-tooltip");
  await expect(finalizingTerm).toHaveAttribute("aria-describedby", "lp-pending-allocation-tooltip");
  await expect(multipleTerm).toHaveAttribute("aria-describedby", "lp-gross-value-multiple-tooltip");
  await aumTerm.hover();
  await expect(summaryGrid.getByRole("tooltip").filter({ hasText: /Assets under management \(AUM\) at recorded cost/ })).toBeVisible();
  await navTerm.focus();
  await expect(summaryGrid.getByRole("tooltip").filter({ hasText: /Net asset value \(NAV\) is assets minus liabilities/ })).toBeVisible();
  await finalizingTerm.hover();
  await expect(summaryGrid.getByRole("tooltip").filter({ hasText: /\$112,000 portion of H256 is being finalized between Atoms and Applied Intuition/ })).toBeVisible();
  await multipleTerm.focus();
  await expect(summaryGrid.getByRole("tooltip").filter({ hasText: /Gross value multiple is projected NAV divided by AUM at recorded cost/ })).toBeVisible();
  await expect(summaryGrid.locator(".lp-summary-metric--primary")).toHaveCount(2);
  await expect(summaryGrid.getByText("AUM", { exact: true })).toBeVisible();
  await expect(summaryGrid.getByText("NAV", { exact: true })).toBeVisible();
  await expect(summaryGrid.getByText("AUM · at cost", { exact: true })).toHaveCount(0);
  await expect(summaryGrid.getByText("Projected NAV", { exact: true })).toHaveCount(0);
  await expect(summaryGrid.getByText("Finalizing allocation", { exact: true })).toBeVisible();
  await expect(summaryGrid.getByText("Pending allocation", { exact: true })).toHaveCount(0);
  await expect(summaryGrid.getByText("$112,000", { exact: true })).toBeVisible();
  await expect(page.getByText("$741,760", { exact: true })).toBeVisible();
  await expect(page.getByText("Gross value multiple", { exact: true })).toBeVisible();
  await expect(page.getByText("Projected value multiple", { exact: true })).toHaveCount(0);
  await expect(page.getByText("1.12×", { exact: true })).toBeVisible();
  await expect(page.getByText("1.15×", { exact: true })).toHaveCount(0);
  const portfolioAum = await summaryGrid.locator("dd").nth(0).innerText();
  const portfolioNav = await summaryGrid.locator("dd").nth(1).innerText();
  const portfolioMultiple = await summaryGrid.locator("dd").nth(3).innerText();
  await expect(page.getByText(/Projection as of 2026-08-18/i)).toHaveCount(0);
  const portalLogoBox = await page.locator(".lp-portal-nav-logo").boundingBox();
  expect(portalLogoBox).not.toBeNull();
  expect(Math.abs(portalLogoBox!.x - publicLogoBox!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(portalLogoBox!.y - publicLogoBox!.y)).toBeLessThanOrEqual(1);
  await expect(page.getByText(/not the fund's audited net asset value/i)).toHaveCount(0);
  await expect(page.getByText("Stripe", { exact: true })).toHaveCount(0);
  await expect(page.getByText("AngelList", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Sydecar", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Capital Company", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Equity", { exact: true })).toHaveCount(0);
  await expect(page.getByText("SAFE", { exact: true })).toHaveCount(0);
  await expect(page.getByText("SPV", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "All companies" })).toHaveCount(0);
  await expect(page.getByRole("group", { name: "Investment view" })).toHaveCount(0);
  await expect(page.getByPlaceholder("Search investments…")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open search" })).toHaveCount(0);
  await expect(page.locator(".lp-table-controls")).toHaveCount(0);
  const portfolioTabsBox = await portfolioSections.boundingBox();
  const investmentHeaderBox = await page.locator(".lp-company-allocation-head").boundingBox();
  expect(portfolioTabsBox).not.toBeNull();
  expect(investmentHeaderBox).not.toBeNull();
  const investmentContentGap = investmentHeaderBox!.y - (portfolioTabsBox!.y + portfolioTabsBox!.height);
  expect(investmentContentGap).toBeGreaterThanOrEqual(16);
  expect(investmentContentGap).toBeLessThanOrEqual(32);
  await expect(page.locator(".lp-company-allocation-head")).toHaveText(/Company \/ allocationAmountAUM share/);
  await expect(page.locator(".lp-company-allocation-head")).toHaveCSS("border-bottom-style", "solid");
  await expect(page.locator(".lp-company-allocation-head")).toHaveCSS("border-bottom-width", "1px");
  const companyAllocationRows = page.locator(".lp-company-allocation-view .lp-figure-bar-row");
  await expect(companyAllocationRows).toHaveCount(44);
  await expect(page.locator(".lp-company-allocation-view .lp-figure-bar-row.is-lead")).toHaveCount(0);
  await expect(companyAllocationRows.nth(0)).toContainText("Finalizing allocation");
  await expect(companyAllocationRows.nth(0)).toContainText("Atoms or Applied Intuition");
  await expect(companyAllocationRows.nth(0)).toContainText("$112,000");
  await expect(companyAllocationRows.nth(0)).toContainText("16.9%");
  await expect(companyAllocationRows.nth(1)).toContainText("Anduril");
  await expect(companyAllocationRows.nth(1)).toContainText("$88,000");
  await expect(companyAllocationRows.nth(1)).toContainText("13.3%");
  const oneXAllocationRow = companyAllocationRows.filter({ hasText: "1X" });
  await expect(oneXAllocationRow).toContainText("2 positions");
  await expect(oneXAllocationRow).toContainText("$24,120");
  await expect(oneXAllocationRow).toContainText("3.6%");
  await expect(page.locator(".lp-company-allocation-view")).not.toContainText("H256 LLC Series 3");
  await expect(page.getByText(/This view combines multiple investments/i)).toHaveCount(0);
  const allocationViewBox = await page.locator(".lp-company-allocation-view").boundingBox();
  const leadAllocationValueBox = await companyAllocationRows.nth(0).locator(".lp-figure-bar-value").boundingBox();
  expect(allocationViewBox).not.toBeNull();
  expect(leadAllocationValueBox).not.toBeNull();
  expect(
    allocationViewBox!.x + allocationViewBox!.width - leadAllocationValueBox!.x - leadAllocationValueBox!.width,
  ).toBeGreaterThanOrEqual(12);
  await page.screenshot({
    path: "output/playwright/lp-portal/company-allocation-desktop.png",
    fullPage: true,
  });
  await expect(page.locator(".lp-portfolio-table")).toHaveCount(0);
  const investmentColumnTitleStyle = await page.locator(".lp-company-allocation-head span").first().evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      color: styles.color,
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing,
      textTransform: styles.textTransform,
      whiteSpace: styles.whiteSpace,
    };
  });
  await page.screenshot({ path: "output/playwright/lp-portal/portfolio-desktop.png", fullPage: true });

  await insightsLink.click();
  await expect(page).toHaveURL(/\/lp\?section=analysis$/);
  await expect(insightsLink).toHaveAttribute("aria-current", "page");
  await expect(investmentsSectionLink).not.toHaveAttribute("aria-current");
  await expect(page.locator("#lp-figure-portfolio-at-a-glance")).toHaveClass(/sr-only/);
  await expect(page.locator("#lp-figure-concentration-and-structure")).toHaveClass(/sr-only/);
  await expect(page.locator(".lp-figure-section-head")).toHaveCount(0);
  await expect(page.locator(".lp-summary-grid")).toBeVisible();
  await expect(page.locator(".lp-summary-grid").getByText("$741,760", { exact: true })).toBeVisible();
  await expect(page.locator(".lp-summary-grid").getByText("1.12×", { exact: true })).toBeVisible();
  const analysisSummaryBox = await page.locator(".lp-summary-grid").boundingBox();
  const analysisTabsBox = await portfolioSections.boundingBox();
  expect(analysisSummaryBox).not.toBeNull();
  expect(analysisTabsBox).not.toBeNull();
  expect(analysisTabsBox!.y).toBeGreaterThan(analysisSummaryBox!.y + analysisSummaryBox!.height);
  const insightsHeadingBox = await page.locator(".lp-figure-heading").first().boundingBox();
  expect(insightsHeadingBox).not.toBeNull();
  const insightsContentGap = insightsHeadingBox!.y - (analysisTabsBox!.y + analysisTabsBox!.height);
  expect(Math.abs(insightsContentGap - investmentContentGap)).toBeLessThanOrEqual(1);
  await expect(page.getByRole("button", { name: "Table view" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Graph view" })).toHaveCount(0);

  const allocationFigure = page.locator(".lp-figure-section").first();
  await expect(allocationFigure.getByRole("heading", { name: "Allocation by category" })).toBeVisible();
  await expect(allocationFigure.locator(".lp-figure-bar-row.is-lead")).toHaveCount(0);
  await expect(allocationFigure).toContainText("Defense and aerospace");
  await expect(allocationFigure).toContainText("$159,586");
  await expect(allocationFigure).toContainText("24.1%");
  await expect(allocationFigure).toContainText("Includes $88,000 deployed to Anduril in its Series H at a $60B entry valuation through H256");
  await expect(allocationFigure).toContainText("Finalizing allocation");
  await expect(allocationFigure).toContainText("$112,000");
  await expect(allocationFigure).toContainText("16.9%");
  await expect(allocationFigure).toContainText("H256 decision between Atoms and Applied Intuition · $112,000");
  await expect(allocationFigure).not.toContainText("Diversified frontier vehicle");
  const figureHeadingInsets = await allocationFigure.locator(".lp-figure-heading").first().evaluate((element) => {
    const styles = getComputedStyle(element);
    return { left: Number.parseFloat(styles.paddingLeft), right: Number.parseFloat(styles.paddingRight) };
  });
  const figureRowInsets = await allocationFigure.locator(".lp-figure-bar-row").first().evaluate((element) => {
    const styles = getComputedStyle(element);
    return { left: Number.parseFloat(styles.paddingLeft), right: Number.parseFloat(styles.paddingRight) };
  });
  const figureChartInsets = await allocationFigure.locator(".lp-figure-chart").first().evaluate((element) => {
    const styles = getComputedStyle(element);
    return { left: Number.parseFloat(styles.paddingLeft), right: Number.parseFloat(styles.paddingRight) };
  });
  for (const insets of [figureHeadingInsets, figureRowInsets, figureChartInsets]) {
    expect(insets.left).toBeGreaterThanOrEqual(16);
    expect(insets.right).toBeGreaterThanOrEqual(16);
  }
  const concentrationSection = page.locator(".lp-figure-section").filter({ hasText: "Concentration and structure" });
  await expect(concentrationSection.getByRole("heading", { name: "Ten largest positions" })).toHaveCount(0);
  await expect(concentrationSection).not.toContainText("Primary and secondary company equity together account for");
  await expect(concentrationSection.getByRole("heading", { name: "Security type" })).toBeVisible();
  for (const securityType of ["Equity", "SAFE", "Secondary", "Convertible note", "Not specified"]) {
    await expect(concentrationSection.getByText(securityType, { exact: true })).toBeVisible();
  }
  await expect(concentrationSection.getByText("SPV", { exact: true })).toHaveCount(0);
  await expect(concentrationSection).not.toContainText("Primary equity");
  await expect(concentrationSection).not.toContainText("Fund / SPV interests");
  await expect(concentrationSection.getByRole("heading", { name: "Entry round" })).toBeVisible();
  await expect(concentrationSection).not.toContainText("Anduril in Series C+");
  await expect(concentrationSection).toContainText("Finalizing allocation");
  await expect(concentrationSection.getByRole("heading", { name: "Access channel" })).toBeVisible();
  await expect(concentrationSection.getByRole("heading", { name: "Cost by entry valuation" })).toBeVisible();
  await expect(concentrationSection.locator(".lp-figure-compact")).toHaveCount(4);
  await expect(concentrationSection.getByRole("heading", { name: "Stage" })).toHaveCount(0);
  await expect(concentrationSection.getByRole("heading", { name: "Platform" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Where we bought" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Concentration curve" })).toHaveCount(0);
  await expect(page.locator(".lp-figure-table--marks")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Insights" })).toHaveCount(0);
  await page.screenshot({ path: "output/playwright/lp-portal/portfolio-analysis-desktop.png", fullPage: true });

  await performanceLink.click();
  await expect(page).toHaveURL(/\/lp\?section=performance$/);
  await expect(performanceLink).toHaveAttribute("aria-current", "page");
  await expect(investmentsSectionLink).not.toHaveAttribute("aria-current");
  await expect(insightsLink).not.toHaveAttribute("aria-current");
  await expect(page.locator("#lp-performance-section-title")).toHaveClass(/sr-only/);
  await expect(page.getByRole("heading", { name: "Allocated positions" })).toHaveCount(0);
  await expect(page.getByText("Green delta = gain vs. cost", { exact: true })).toHaveCount(0);
  const performanceTabsBox = await portfolioSections.boundingBox();
  const performanceTableBox = await page.locator(".lp-figure-table-wrap").boundingBox();
  expect(performanceTabsBox).not.toBeNull();
  expect(performanceTableBox).not.toBeNull();
  const performanceContentGap = performanceTableBox!.y - (performanceTabsBox!.y + performanceTabsBox!.height);
  expect(performanceContentGap).toBeGreaterThanOrEqual(16);
  expect(performanceContentGap).toBeLessThanOrEqual(32);
  const performanceColumnTitleStyle = await page.getByRole("columnheader", { name: "Position" }).evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      color: styles.color,
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing,
      textTransform: styles.textTransform,
      whiteSpace: styles.whiteSpace,
    };
  });
  expect(investmentColumnTitleStyle).toEqual(performanceColumnTitleStyle);
  const performanceRows = page.locator(".lp-figure-table--marks tbody tr");
  await expect(performanceRows).toHaveCount(44);
  const h256AndurilMark = performanceRows.filter({ hasText: "Anduril" });
  await expect(h256AndurilMark.getByRole("rowheader")).toContainText("Anduril");
  await expect(h256AndurilMark).toContainText("H256 → Anduril mark");
  await expect(h256AndurilMark).toContainText("$60B entry valuation");
  await expect(h256AndurilMark).toContainText("$100B assumed valuation");
  await expect(h256AndurilMark).toContainText("$88,000.00");
  await expect(h256AndurilMark).toContainText("1.67×");
  await expect(h256AndurilMark).toContainText("+$58,666.67");
  await expect(h256AndurilMark).toContainText("$146,666.67");
  await expect(performanceRows.filter({ hasText: "H256 LLC Series 3" })).toHaveCount(0);
  const valuationRows = page.locator(".lp-figure-table--marks tbody tr.has-gain");
  await expect(valuationRows).toHaveCount(9);
  await expect(valuationRows.first().getByRole("rowheader")).toHaveCSS("box-shadow", "none");
  for (const [company, carried] of [
    ["Replit", "$10,465.12"],
    ["Hark", "$10,389.61"],
    ["Corgi", "$16,000.00"],
    ["1X", "$7,649.24"],
    ["Decart.ai", "$10,526.32"],
  ]) {
    await expect(valuationRows.filter({ hasText: company })).toContainText(carried);
  }
  const positronPerformance = performanceRows.filter({ hasText: "Positron" });
  await expect(positronPerformance).toContainText("Held at cost");
  await expect(positronPerformance).toContainText("No approved mark");
  await expect(positronPerformance).toContainText("1.00×");
  await expect(positronPerformance).toContainText("At cost");
  const pendingPerformanceRow = page.locator(".lp-performance-pending-row");
  await expect(pendingPerformanceRow).toContainText("Finalizing allocation");
  await expect(pendingPerformanceRow).toContainText("Atoms or Applied Intuition");
  await expect(pendingPerformanceRow).toContainText("$112,000.00");
  await expect(pendingPerformanceRow).toContainText("No performance");
  await expect(pendingPerformanceRow).toContainText("In AUM, NAV, and total math");
  const performanceTotal = page.locator(".lp-performance-total-row");
  await expect(performanceTotal).toContainText("$661,014.25");
  await expect(performanceTotal).toContainText("1.12×");
  await expect(performanceTotal).toContainText("+$80,745.80");
  await expect(performanceTotal).toContainText("$741,760.05");
  await expect(page.getByRole("heading", { name: "Valuation evidence" })).toHaveCount(0);
  await page.screenshot({ path: "output/playwright/lp-portal/portfolio-performance-desktop.png", fullPage: true });

  const updatesResponse = await page.goto("/lp/updates");
  expect(updatesResponse?.status()).toBe(200);
  expect(updatesResponse?.headers()["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
  await expect(page.getByRole("heading", { name: "Investor Updates" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Investor Updates" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText(/at least twice per year/i)).toBeVisible();
  const augustUpdateLink = page.getByRole("link", { name: /Beyond the Anthropocene: Betting Together on the Post-Labor AI Economy/ });
  await expect(augustUpdateLink).toHaveAttribute("href", "/lp/updates/august-2026");
  await expect(page.getByText("Investor Update #1", { exact: true })).toBeVisible();
  await expect(page.getByText("August 14, 2026", { exact: true })).toBeVisible();
  await expect(page.getByText("01", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Our founding thesis/i)).toHaveCount(0);
  await expect(page.getByText(/Read update/i)).toHaveCount(0);
  await expect(page.getByText(/published update/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Return to portfolio/i })).toHaveCount(0);
  await page.screenshot({ path: "output/playwright/lp-portal/updates-index-desktop.png", fullPage: true });

  await augustUpdateLink.click();
  await expect(page).toHaveURL(/\/lp\/updates\/august-2026$/);
  await expect(page.getByRole("heading", { name: "Beyond the Anthropocene" })).toBeVisible();
  await expect(page.getByText("Betting Together on the Post-Labor AI Economy", { exact: true })).toBeVisible();
  await expect(page.getByText("Investor Update #1", { exact: true })).toBeVisible();
  await expect(page.getByText("August 14, 2026", { exact: true })).toBeVisible();
  const updateCopy = page.locator(".lp-update-article-copy");
  await expect(updateCopy).toContainText(portfolioAum);
  await expect(updateCopy).toContainText(portfolioNav);
  await expect(updateCopy).toContainText(portfolioMultiple);
  await expect(updateCopy).not.toContainText("$671,574.11");
  await expect(updateCopy).not.toContainText("1.02×");
  const updateParagraphs = updateCopy.locator(":scope > p");
  await expect(updateParagraphs).toHaveCount(15);
  await expect(updateParagraphs.nth(1)).toContainText("This is our first formal update");
  await expect(updateParagraphs.nth(2)).toContainText("We started All Together for a simple reason");
  await expect(updateParagraphs.nth(3)).toContainText("Our thesis is simple");
  await expect(updateParagraphs.nth(3)).toContainText("All Together exists to give our investors ownership in those companies");
  await expect(updateParagraphs.nth(4)).toContainText("We call this the post-labor economy");
  await expect(updateParagraphs.nth(5)).toContainText("Every investment therefore has to answer a direct question");
  await expect(updateParagraphs.nth(6)).toContainText("The portfolio reflects that test");
  await expect(updateParagraphs.nth(12)).toContainText("We do not know exactly which companies will define this transition");
  await expect(updateParagraphs.nth(12)).toContainText("That is how we will invest from here and how we will report to you");
  await expect(updateCopy).toContainText("at least twice per year");
  await expect(updateCopy).toContainText("1X, Figure AI, Apptronik, and Weave Robotics");
  await expect(updateCopy).toContainText("Aalo Atomics and Apollo Atomics");
  await expect(updateCopy).toContainText("Their presence is evidence, not a thesis");
  await expect(updateCopy).not.toContainText("The current landscape reinforces that view");
  await expect(updateCopy).not.toContainText("Stanford AI Index");
  await expect(updateCopy).not.toContainText("International Energy Agency");
  await expect(updateCopy).not.toContainText("That leads us to efficient compute and inference");
  await expect(updateCopy).not.toContainText("Compute makes intelligence cheaper");
  await expect(updateCopy).not.toContainText("Most positions remain at cost");
  await expect(updateCopy).not.toContainText("too early to call it performance");
  await expect(updateCopy).not.toContainText("$671,574.11");
  await expect(updateCopy).not.toContainText("30.3%");
  await expect(updateCopy).not.toContainText("$200,000 H256 LLC Series 3");
  await expect(updateCopy).not.toContainText("$88,000.00 (44%)");
  await expect(updateCopy).not.toContainText("$112,000.00 (56%)");
  await expect(page.locator(".lp-figure-section")).toHaveCount(0);
  const updateCopyText = await page.locator(".lp-update-article-copy").innerText();
  const financialReferences = updateCopyText.match(/\$(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?|[\d.]+%|[\d.]+×/g) ?? [];
  expect(financialReferences).toEqual(["$661,014.25", "$741,760.05", "1.12×"]);
  const updateWordCount = updateCopyText.trim().split(/\s+/).length;
  expect(updateWordCount).toBeLessThan(750);
  // Stated only in the confidentiality footer, not in the GP-to-LP letter body.
  await expect(
    page.getByText(/not (?:administrator-reported or )?audited net asset value/i),
  ).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Checked and held flat" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Basis of preparation" })).toHaveCount(0);
  await expect(page.locator(".lp-figure-index")).toHaveCount(0);
  await expect(page.locator(".lp-update-article-copy a")).toHaveCount(0);
  // The letter body stays unadorned prose. The figure suite below it is
  // allowed its own semantics, so these guards scope to the copy, not the page.
  await expect(page.locator(".lp-update-article-copy figure")).toHaveCount(0);
  await expect(page.locator(".lp-update-article-copy aside")).toHaveCount(0);
  await expect(
    page.locator(".lp-update-article-copy ol, .lp-update-article-copy ul, .lp-update-article-copy dl"),
  ).toHaveCount(0);
  await page.screenshot({ path: "output/playwright/lp-portal/update-august-2026-desktop.png", fullPage: true });

  await expect(page.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
  await page.getByRole("link", { name: "Back home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".cog-nav-button")).toHaveText("Email us");
  const publicNavSurface = await page.locator(".cog-desktop-nav").evaluate((element) => {
    const styles = getComputedStyle(element);
    return { backgroundColor: styles.backgroundColor, boxShadow: styles.boxShadow };
  });
  expect(publicNavSurface.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(publicNavSurface.boxShadow).not.toBe("none");
  const lpPortalLink = page.getByLabel("Primary").getByRole("link", { name: "LP Portal" });
  await expect(lpPortalLink).toHaveAttribute("href", "/lp");
  await lpPortalLink.click();
  await expect(page).toHaveURL(/\/lp$/);
  await expect(page.locator("#lp-portfolio-heading")).toHaveClass(/sr-only/);
  await expect(page.getByText(/All Together Drive · Schedule of Investments/i)).toHaveCount(0);
  await expect(page.locator(".lp-portal-footer > span")).toHaveCount(1);

  await page.waitForLoadState("networkidle");
  await page.locator(".lp-company-allocation-view").getByRole("link", { name: "Blue Origin", exact: true }).click();
  await expect(page).toHaveURL(/43-blue-origin$/);
  await expect(page.getByText("Pending acceptance", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Data status", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Visit Blue Origin website" })).toHaveAttribute("href", "https://www.blueorigin.com/");
  await expect(page.getByRole("heading", { name: "Position" })).toBeVisible();
  await expect(page.getByText("$15,000", { exact: true })).toHaveCount(2);
  await expect(page.getByText("$130B before the round", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Invested with a group · Investment held through a dedicated company", { exact: true })).toBeVisible();
  await expect(page.getByText("$0", { exact: true })).toBeVisible();
  await expect(page.getByText("Current value multiple", { exact: true })).toBeVisible();
  await expect(page.getByText("Projected value multiple", { exact: true })).toHaveCount(0);
  await expect(page.getByText("1.00×", { exact: true })).toBeVisible();
  await expect(page.getByText(/not the fund's official net asset value/i)).toBeVisible();
  await expect(page.getByText(/All Together Drive · Schedule of Investments/i)).toHaveCount(0);
  await expect(page.locator(".lp-portal-footer > span")).toHaveCount(1);
  await page.screenshot({ path: "output/playwright/lp-portal/detail-desktop.png", fullPage: true });

  await page.locator(".lp-back-link").click();
  await page.waitForLoadState("networkidle");
  await page.locator(".lp-company-allocation-view").getByRole("link", { name: "Positron", exact: true }).click();
  await expect(page).toHaveURL(/44-positron$/);
  await expect(page.getByRole("link", { name: "Visit Positron website" })).toHaveAttribute("href", "https://www.positron.ai/");
  await expect(page.getByText("$4.5B before the round", { exact: true })).toHaveCount(2);

  await page.goto("/lp/investments/35-decart-ai");
  await expect(page.getByRole("heading", { name: "Decart.ai" })).toBeVisible();
  await expect(page.getByText("Invested with a group · Shares in the company", { exact: true })).toBeVisible();
  await expect(page.getByText("AngelList", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Equity", { exact: true })).toHaveCount(0);

  await page.goto("/lp/investments/42-weave-robotics");
  await expect(page.getByRole("heading", { name: "Weave Robotics" })).toBeVisible();
  await expect(page.getByText("$5,000", { exact: true })).toHaveCount(2);

  await page.goto("/lp/investments/09-h256-series-3");
  await expect(page.getByRole("heading", { name: "H256 LLC Series 3" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vehicle allocation" })).toBeVisible();
  await expect(page.locator(".lp-vehicle-allocation")).toContainText("$88,000");
  await expect(page.locator(".lp-vehicle-allocation")).toContainText("44% deployed to Anduril in its Series H at a $60B entry valuation");
  await expect(page.locator(".lp-vehicle-allocation")).toContainText("$112,000");
  await expect(page.locator(".lp-vehicle-allocation")).toContainText("Finalizing allocation · 56% of the vehicle · Atoms or Applied Intuition");
  await expect(page.locator(".lp-vehicle-allocation")).toContainText("$200,000 vehicle investment remains one legal portfolio position");
  await expect(page.locator(".lp-vehicle-allocation")).toContainText("The remaining $112,000 allocation is being finalized between Atoms and Applied Intuition");
  await expect(page.getByText("$200,000", { exact: true })).toHaveCount(1);
  await expect(page.getByText("$258,666.67", { exact: true })).toBeVisible();
  await expect(page.getByText("$100B assumed valuation", { exact: true })).toBeVisible();
  await expect(page.getByText("Based on a stated scenario assumption", { exact: true })).toBeVisible();

  await page.goto("/lp/investments/41-atoms");
  await expect(page.getByRole("heading", { name: "Atoms" })).toBeVisible();
  await expect(page.getByText("$9,350", { exact: true })).toHaveCount(2);

  await expect(page.getByRole("button", { name: "Sign out" })).toHaveCount(0);
  await expect(page.getByLabel("Account options")).toHaveCount(0);
});

test("renders the login, portfolio, and detail views at every supported layout", async ({ browser }) => {
  test.setTimeout(90_000);

  const viewports = [
    { name: "phone", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "compact-desktop", width: 1285, height: 1320 },
    { name: "review-desktop", width: 1297, height: 1297 },
    { name: "desktop", width: 1440, height: 1000 },
    { name: "wide", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    await page.goto("/lp-login");
    await expect(page.getByRole("heading", { name: "Investor portal." })).toBeVisible();
    await expect(page.getByLabel("Access password")).toBeVisible();
    const loginFrame = page.locator(".lp-login-input-row");
    await expect(loginFrame).toHaveCSS("border-left-width", "1px");
    await expect(loginFrame).toHaveCSS("border-left-style", "solid");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/login-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByLabel("Access password").fill(password);
    await page.getByRole("button", { name: /Sign in/ }).click();
    await expect(page).toHaveURL(/\/lp$/);
    await expect(page.locator("#lp-portfolio-heading")).toHaveClass(/sr-only/);
    await expect(page.getByRole("button", { name: "Sign out" })).toHaveCount(0);
    const portfolioSections = page.getByRole("navigation", { name: "Portfolio sections" });
    await expect(portfolioSections.getByRole("link", { name: "Investments", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(portfolioSections.getByRole("link", { name: "Insights", exact: true })).toBeVisible();
    await expect(portfolioSections.getByRole("link", { name: "Performance", exact: true })).toBeVisible();
    const tabLinkBoxes = await portfolioSections.locator("a").evaluateAll((links) => links.map((link) => {
      const box = link.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom };
    }));
    expect(Math.max(...tabLinkBoxes.map((box) => box.top)) - Math.min(...tabLinkBoxes.map((box) => box.top))).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    const portalGuideCount = await page.locator(".lp-portal-page").evaluate((element) =>
      (getComputedStyle(element, "::before").backgroundImage.match(/linear-gradient/g) ?? []).length,
    );
    expect(portalGuideCount).toBe(2);

    const pageBox = await page.locator(".lp-portal-page").boundingBox();
    const summaryBox = await page.locator(".lp-summary-grid").boundingBox();
    expect(pageBox).not.toBeNull();
    expect(summaryBox).not.toBeNull();
    const rightGutter = pageBox!.x + pageBox!.width - summaryBox!.x - summaryBox!.width;
    if (viewport.width <= 719) {
      expect(Math.abs(summaryBox!.x - pageBox!.x - rightGutter)).toBeLessThanOrEqual(1);
    } else {
      const railEnd = await page.locator(".lp-portal-page").evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).getPropertyValue("--lp-rail-end")),
      );
      const leftGutter = summaryBox!.x - pageBox!.x - railEnd;
      expect(Math.abs(leftGutter - rightGutter)).toBeLessThanOrEqual(1);
    }

    const navBox = await page.locator(".lp-portal-nav").boundingBox();
    expect(navBox).not.toBeNull();
    if (viewport.width <= 719) {
      expect(navBox!.height).toBeLessThanOrEqual(60);
    } else {
      expect(navBox!.height).toBeGreaterThan(120);
    }

    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: "Graph view" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Table view" })).toHaveCount(0);
    const investmentTabsBox = await portfolioSections.boundingBox();
    const investmentHeadingBox = await page.locator(".lp-company-allocation-head").boundingBox();
    expect(investmentTabsBox).not.toBeNull();
    expect(investmentHeadingBox).not.toBeNull();
    const viewportInvestmentGap = investmentHeadingBox!.y - (investmentTabsBox!.y + investmentTabsBox!.height);
    expect(viewportInvestmentGap).toBeGreaterThanOrEqual(16);
    expect(viewportInvestmentGap).toBeLessThanOrEqual(32);
    await expect(page.getByRole("heading", { name: "All companies" })).toHaveCount(0);
    await expect(page.locator(".lp-company-allocation-view .lp-figure-bar-row")).toHaveCount(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    if (viewport.name === "phone") {
      await page.screenshot({
        path: "output/playwright/lp-portal/company-allocation-phone.png",
        fullPage: true,
      });
    }

    await portfolioSections.getByRole("link", { name: "Insights", exact: true }).click();
    await expect(page).toHaveURL(/\/lp\?section=analysis$/);
    await expect(page.locator("#lp-figure-portfolio-at-a-glance")).toHaveClass(/sr-only/);
    await expect(page.locator("#lp-figure-concentration-and-structure")).toHaveClass(/sr-only/);
    await expect(page.getByRole("heading", { name: "Investments" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Table view" })).toHaveCount(0);
    const insightsTabsBox = await portfolioSections.boundingBox();
    const insightsHeadingBox = await page.locator(".lp-figure-heading").first().boundingBox();
    expect(insightsTabsBox).not.toBeNull();
    expect(insightsHeadingBox).not.toBeNull();
    const viewportInsightsGap = insightsHeadingBox!.y - (insightsTabsBox!.y + insightsTabsBox!.height);
    expect(Math.abs(viewportInsightsGap - viewportInvestmentGap)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/portfolio-analysis-${viewport.name}.png`,
      fullPage: true,
    });
    await page.getByRole("navigation", { name: "Portfolio sections" })
      .getByRole("link", { name: "Performance", exact: true })
      .click();
    await expect(page).toHaveURL(/\/lp\?section=performance$/);
    await expect(page.getByRole("heading", { name: "Allocated positions" })).toHaveCount(0);
    await expect(page.getByText("Green delta = gain vs. cost", { exact: true })).toHaveCount(0);
    await expect(page.locator(".lp-figure-table--marks tbody tr")).toHaveCount(44);
    await expect(page.locator(".lp-performance-pending-row")).toContainText("Finalizing allocation");
    await expect(page.locator(".lp-performance-pending-row")).toContainText("Atoms or Applied Intuition");
    await expect(page.locator("#lp-performance-section-title")).toHaveClass(/sr-only/);
    const performanceTabsBox = await page.getByRole("navigation", { name: "Portfolio sections" }).boundingBox();
    const performanceTableBox = await page.locator(".lp-figure-table-wrap").boundingBox();
    expect(performanceTabsBox).not.toBeNull();
    expect(performanceTableBox).not.toBeNull();
    const viewportPerformanceGap = performanceTableBox!.y - (performanceTabsBox!.y + performanceTabsBox!.height);
    expect(viewportPerformanceGap).toBeGreaterThanOrEqual(16);
    expect(viewportPerformanceGap).toBeLessThanOrEqual(32);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/portfolio-performance-${viewport.name}.png`,
      fullPage: true,
    });
    await page.getByRole("navigation", { name: "Portfolio sections" })
      .getByRole("link", { name: "Investments", exact: true })
      .click();
    await expect(page).toHaveURL(/\/lp$/);

    await page.screenshot({
      path: `output/playwright/lp-portal/portfolio-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByRole("link", { name: "Investor Updates" }).click();
    await expect(page).toHaveURL(/\/lp\/updates$/);
    await expect(page.getByRole("heading", { name: "Investor Updates" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Investor Updates" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("link", { name: /Beyond the Anthropocene: Betting Together on the Post-Labor AI Economy/ })).toBeVisible();
    if (viewport.width >= 1285) {
      const updateTitleLineCount = await page
        .getByRole("link", { name: /Beyond the Anthropocene: Betting Together on the Post-Labor AI Economy/ })
        .locator("strong")
        .evaluate((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return Array.from(range.getClientRects()).filter((rect) => rect.width > 0).length;
        });
      expect(updateTitleLineCount).toBe(1);
    }
    await expect(page.getByRole("link", { name: "Back home" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/updates-index-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByRole("link", { name: /Beyond the Anthropocene: Betting Together on the Post-Labor AI Economy/ }).click();
    await expect(page).toHaveURL(/\/lp\/updates\/august-2026$/);
    await expect(page.getByRole("heading", { name: "Beyond the Anthropocene" })).toBeVisible();
    await expect(page.getByText("Betting Together on the Post-Labor AI Economy", { exact: true })).toBeVisible();
    await expect(page.locator(".lp-update-article-copy")).toContainText("$661,014.25");
    await expect(page.locator(".lp-update-article-copy")).toContainText("$741,760.05");
    await expect(page.locator(".lp-update-article-copy")).toContainText("1.12×");
    await expect(page.locator(".lp-update-article-copy")).not.toContainText("1.02×");
    await expect(page.locator(".lp-update-article-copy")).toContainText("at least twice per year");
    await expect(page.locator(".lp-update-article-copy")).toContainText("Our thesis is simple");
    await expect(page.locator(".lp-update-article-copy")).toContainText("1X, Figure AI, Apptronik, and Weave Robotics");
    await expect(page.locator(".lp-update-article-copy")).toContainText("Aalo Atomics and Apollo Atomics");
    await expect(page.locator(".lp-update-article-copy")).toContainText("That is how we will invest from here and how we will report to you");
    await expect(page.locator(".lp-figure-section")).toHaveCount(0);
    const updateCopyBox = await page.locator(".lp-update-article-copy").boundingBox();
    expect(updateCopyBox).not.toBeNull();
    expect(updateCopyBox!.width).toBeLessThanOrEqual(761);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/update-august-2026-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByRole("link", { name: "All investor updates", exact: true }).first().click();
    await expect(page).toHaveURL(/\/lp\/updates$/);
    await page.getByRole("link", { name: "Portfolio", exact: true }).click();
    await expect(page).toHaveURL(/\/lp$/);

    await page.locator(".lp-company-allocation-view").getByRole("link", { name: "Blue Origin", exact: true }).click();
    await expect(page).toHaveURL(/43-blue-origin$/);
    await expect(page.getByRole("heading", { name: "Blue Origin" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Visit Blue Origin website" })).toBeVisible();
    await expect(page.getByText("1.00×", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/detail-${viewport.name}.png`,
      fullPage: true,
    });

    await page.goto("/lp/investments/09-h256-series-3");
    await expect(page.getByRole("heading", { name: "Vehicle allocation" })).toBeVisible();
    await expect(page.locator(".lp-vehicle-allocation")).toContainText("$88,000");
    await expect(page.locator(".lp-vehicle-allocation")).toContainText("$112,000");
    await expect(page.locator(".lp-vehicle-allocation")).toContainText("remaining $112,000 allocation is being finalized between Atoms and Applied Intuition");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/detail-h256-${viewport.name}.png`,
      fullPage: true,
    });

    await context.close();
  }
});
