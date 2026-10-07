// Capture design artifacts. This script does not exercise or assert game behaviour.
import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = fileURLToPath(new URL("../../../docs/design/round-02/", import.meta.url));
const html = await readFile(path.join(root, "playable-study.html"), "utf8");
const browser = await puppeteer.launch({
  executablePath: process.env.STUDY_CHROMIUM_PATH ?? "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--no-first-run"],
  timeout: 20000,
});
try {
  for (const [name, width, height] of [["mobile", 390, 844], ["desktop", 1440, 960]]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    // Render the authored document in memory; no browser filesystem access is needed.
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForSelector(".selection-card", { timeout: 15000 });
    // Let the camera's first layout and transform paint before capturing the design.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: path.join(root, `${name}-map.png`) });
    console.log(`Rendered ${name} design at ${width} × ${height}.`);
    await page.close();
  }
} finally {
  await browser.close();
}
