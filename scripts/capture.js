import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fame IT/.gemini/antigravity/brain/7bd6b650-c10f-473c-bece-2575acb17272';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function run() {
  console.log('Launching Chrome with puppeteer-core...');
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
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 3000));

  // 1. Overview Day
  console.log('Capturing Overview Day (1920x1080)...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_overview_day.png'),
  });

  // 2. Overview Evening
  console.log('Toggling Evening Mode...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.title && (b.title.includes('Evening') || b.title.includes('Day')));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  console.log('Capturing Overview Evening...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_overview_evening.png'),
  });

  // Toggle back to Day
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.title && (b.title.includes('Evening') || b.title.includes('Day')));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // 3. Team View Preset
  console.log('Switching to Team View...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const teamBtn = buttons.find(b => b.textContent && b.textContent.includes('Team View'));
    if (teamBtn) teamBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
  console.log('Capturing Team View...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_team_view.png'),
  });

  // 4. Laptop / Landscape (1440x900)
  console.log('Capturing Laptop 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_1440x900.png'),
  });

  // 5. Tablet (768x1024)
  console.log('Capturing Tablet 768x1024...');
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_tablet_768x1024.png'),
  });

  // 6. Mobile (390x844)
  console.log('Capturing Mobile 390x844...');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_mobile_390x844.png'),
  });

  // 7. Small Mobile (320x740)
  console.log('Capturing Small Mobile 320x740...');
  await page.setViewport({ width: 320, height: 740 });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_mobile_320x740.png'),
  });

  await browser.close();
  console.log('All responsive screenshots completed successfully!');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
