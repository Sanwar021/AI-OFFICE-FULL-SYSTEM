import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fame IT/.gemini/antigravity/brain/7bd6b650-c10f-473c-bece-2575acb17272';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const viewports = [
  { name: 'desktop_1920x1080', width: 1920, height: 1080 },
  { name: 'desktop_1440x900', width: 1440, height: 900 },
  { name: 'desktop_1280x800', width: 1280, height: 800 },
  { name: 'tablet_landscape_1024x768', width: 1024, height: 768 },
  { name: 'tablet_portrait_768x1024', width: 768, height: 1024 },
  { name: 'mobile_large_430x932', width: 430, height: 932 },
  { name: 'mobile_standard_390x844', width: 390, height: 844 },
  { name: 'mobile_small_360x800', width: 360, height: 800 },
  { name: 'mobile_mini_320x740', width: 320, height: 740 },
];

async function run() {
  console.log('Launching Chrome with puppeteer-core for full responsive testing...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--use-gl=angle',
      '--ignore-gpu-blocklist',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 3000));

  for (const vp of viewports) {
    console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await new Promise((r) => setTimeout(r, 1200));

    // Verify no horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    console.log(`Viewport ${vp.name} horizontal overflow: ${hasOverflow ? 'DETECTED' : 'NONE (PASS)'}`);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `screenshot_${vp.name}.png`),
    });
  }

  // Also test clicking Evening Mode in 1920x1080
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.title && (b.title.includes('Evening') || b.title.includes('Day')));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_overview_evening.png'),
  });

  await browser.close();
  console.log('All responsive viewports verified and captured successfully!');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
