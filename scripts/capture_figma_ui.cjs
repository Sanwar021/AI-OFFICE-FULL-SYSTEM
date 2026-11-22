const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  // Capture 1440x900 desktop
  await page.screenshot({
    path: 'C:/Users/Fame IT/.gemini/antigravity/brain/7bd6b650-c10f-473c-bece-2575acb17272/screenshot_figma_desktop_1440.png'
  });
  console.log('Captured 1440x900');

  // Set viewport to 1920x1080
  await page.setViewport({ width: 1920, height: 1080 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: 'C:/Users/Fame IT/.gemini/antigravity/brain/7bd6b650-c10f-473c-bece-2575acb17272/screenshot_figma_desktop_1920.png'
  });
  console.log('Captured 1920x1080');

  // Set viewport to 390x844 mobile
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: 'C:/Users/Fame IT/.gemini/antigravity/brain/7bd6b650-c10f-473c-bece-2575acb17272/screenshot_figma_mobile_390.png'
  });
  console.log('Captured 390x844');

  await browser.close();
  console.log('Done capturing views!');
})();
