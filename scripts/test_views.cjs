const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new'],
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Click collapse button on left roster
  const collapseBtn = await page.$('button[aria-label="Collapse roster"]');
  if (collapseBtn) await collapseBtn.click();
  await new Promise(r => setTimeout(r, 800));

  // Capture wide cinematic view
  await page.screenshot({ path: 'C:/Users/Fame IT/.gemini/antigravity/brain/7bd6b650-c10f-473c-bece-2575acb17272/screenshot_wide_cinematic.png' });

  // Now click Inspect button on top right to open Inspector
  const inspectBtn = await page.$('button[title="Open Specialist Inspector"]');
  if (inspectBtn) await inspectBtn.click();
  await new Promise(r => setTimeout(r, 800));

  // Capture inspector open view
  await page.screenshot({ path: 'C:/Users/Fame IT/.gemini/antigravity/brain/7bd6b650-c10f-473c-bece-2575acb17272/screenshot_inspector_open.png' });

  await browser.close();
  console.log('SUCCESS: Captured wide cinematic and inspector views!');
})();
