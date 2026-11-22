const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Fame IT/.gemini/antigravity/brain/7bd6b650-c10f-473c-bece-2575acb17272';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  console.log('🚀 Starting Comprehensive UI & Interaction Logic Verification...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  
  // Listen for console errors
  const pageErrors = [];
  page.on('pageerror', (err) => {
    console.error('Browser Page Error:', err.message);
    pageErrors.push(err.message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.warn('Browser Console Error:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);
    console.log('✅ Page loaded successfully.');

    // Screenshot 1: Initial Dashboard Loaded
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_01_initial_dashboard.png') });
    console.log('📸 Captured: verify_01_initial_dashboard.png');

    // Helper: find button by text content
    const clickButtonWithText = async (text) => {
      const clicked = await page.evaluate((btnText) => {
        const buttons = Array.from(document.querySelectorAll('button, div[role="button"], a, span'));
        const target = buttons.find((el) => el.innerText && el.innerText.trim().includes(btnText));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.click();
          return true;
        }
        return false;
      }, text);
      return clicked;
    };

    // 1. TEST SIDEBAR: Tasks Modal
    console.log('\n--- 1. Testing Sidebar Tasks Modal ---');
    const clickedTasks = await clickButtonWithText('Tasks');
    console.log('Clicked Tasks in Sidebar:', clickedTasks);
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_02_tasks_modal.png') });
    console.log('📸 Captured: verify_02_tasks_modal.png');

    // Test filter pills inside Tasks Modal
    console.log('Testing Tasks filter tabs (running, needs approval, completed)...');
    await clickButtonWithText('running');
    await sleep(500);
    await clickButtonWithText('needs approval');
    await sleep(500);
    await clickButtonWithText('completed');
    await sleep(500);
    await clickButtonWithText('all');
    await sleep(500);

    // Test search inside Tasks Modal
    const searchInput = await page.$('input[placeholder*="Filter tasks"]');
    if (searchInput) {
      await searchInput.type('SEO');
      await sleep(500);
      console.log('Typed "SEO" into tasks filter search');
    }

    // Inspect deliverable from Tasks Modal
    const clickedInspect = await clickButtonWithText('Inspect Deliverable');
    console.log('Clicked Inspect Deliverable in Tasks modal:', clickedInspect);
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_03_task_details_modal.png') });
    console.log('📸 Captured: verify_03_task_details_modal.png');

    // Switch tabs in Task Details Modal
    await clickButtonWithText('Task Instructions & Details');
    await sleep(500);
    await clickButtonWithText('Deliverable Content');
    await sleep(500);

    // Close Task Details Modal
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      // Find the last close button or SVG with X
      const xBtn = closeButtons.find(b => b.innerHTML.includes('lucide-x') || b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(1000);

    // 2. TEST SIDEBAR: Approvals Modal
    console.log('\n--- 2. Testing Approvals Modal ---');
    await clickButtonWithText('Approvals');
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_04_approvals_modal.png') });
    console.log('📸 Captured: verify_04_approvals_modal.png');

    // Close Approvals modal
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const xBtn = closeButtons.find(b => b.innerHTML.includes('lucide-x') || b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(800);

    // 3. TEST SIDEBAR: Routines Modal
    console.log('\n--- 3. Testing Routines Modal ---');
    await clickButtonWithText('Routines');
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_05_routines_modal.png') });
    console.log('📸 Captured: verify_05_routines_modal.png');

    // Close Routines modal
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const xBtn = closeButtons.find(b => b.innerHTML.includes('lucide-x') || b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(800);

    // 4. TEST SIDEBAR: Reports Modal
    console.log('\n--- 4. Testing Reports Modal ---');
    await clickButtonWithText('Reports');
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_06_reports_modal.png') });
    console.log('📸 Captured: verify_06_reports_modal.png');

    // Close Reports modal
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const xBtn = closeButtons.find(b => b.innerHTML.includes('lucide-x') || b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(800);

    // 5. TEST KPI CARDS
    console.log('\n--- 5. Testing KPI Cards ---');
    // Click Card 4 (24 Completed today) to verify KPI interaction
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('div')).find(d => d.innerText && d.innerText.includes('Completed today'));
      if (el) el.click();
    });
    await sleep(800);
    // Close Reports modal again
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const xBtn = closeButtons.find(b => b.innerHTML.includes('lucide-x') || b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(800);

    // 6. TEST TEAM SELECTION IN ROSTER & 3D FOCUS
    console.log('\n--- 6. Testing Team Selection in Roster & 3D Focus ---');
    // Select Olivia Chen
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div'));
      const olivia = items.find(el => el.innerText && el.innerText.includes('Olivia Chen'));
      if (olivia) olivia.click();
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_07_olivia_selected.png') });
    console.log('📸 Captured: verify_07_olivia_selected.png');

    // Select Ethan Brooks
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div'));
      const ethan = items.find(el => el.innerText && el.innerText.includes('Ethan Brooks'));
      if (ethan) ethan.click();
    });
    await sleep(1200);

    // 7. TEST EMPLOYEE OVERVIEW: TABS & ACTION MENU
    console.log('\n--- 7. Testing Employee Overview Tabs & Action Menu ---');
    // Switch to Overview tab
    await clickButtonWithText('Overview');
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_08_employee_overview_tab.png') });
    console.log('📸 Captured: verify_08_employee_overview_tab.png');

    // Switch back to Live activity tab
    await clickButtonWithText('Live activity');
    await sleep(800);

    // Open specialist action menu (...)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const menuBtn = buttons.find(b => b.title === 'Specialist actions' || (b.innerHTML.includes('lucide-more-horizontal') && !b.innerText));
      if (menuBtn) menuBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_09_specialist_action_menu.png') });
    console.log('📸 Captured: verify_09_specialist_action_menu.png');

    // Close menu by clicking outside
    await page.mouse.click(10, 10);
    await sleep(500);

    // 8. TEST 3D CONTROLS: Camera Presets & Zoom
    console.log('\n--- 8. Testing 3D Camera Presets & Zoom Controls ---');
    await clickButtonWithText('Team View');
    await sleep(1000);
    await clickButtonWithText('Follow Employee');
    await sleep(1000);
    await clickButtonWithText('Overview');
    await sleep(1000);

    // Click Zoom In button twice
    await page.evaluate(() => {
      const plusBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Zoom In');
      if (plusBtn) {
        plusBtn.click();
        plusBtn.click();
      }
    });
    await sleep(800);

    // Click Reset Camera button
    await page.evaluate(() => {
      const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Reset View');
      if (resetBtn) resetBtn.click();
    });
    await sleep(800);

    // 9. TEST NOTIFICATIONS POPOVER
    console.log('\n--- 9. Testing Notifications Dropdown ---');
    await page.evaluate(() => {
      const bellBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Notifications'));
      if (bellBtn) bellBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_10_notifications_popover.png') });
    console.log('📸 Captured: verify_10_notifications_popover.png');

    // Close notifications by clicking bell again
    await page.evaluate(() => {
      const bellBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Notifications'));
      if (bellBtn) bellBtn.click();
    });
    await sleep(500);

    // 10. TEST DAY / NIGHT LIGHTING TOGGLE
    console.log('\n--- 10. Testing Day/Night Lighting Toggle ---');
    await page.evaluate(() => {
      const lightBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('lighting'));
      if (lightBtn) lightBtn.click();
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_11_evening_lighting.png') });
    console.log('📸 Captured: verify_11_evening_lighting.png');

    // Switch back to Day lighting
    await page.evaluate(() => {
      const lightBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('lighting'));
      if (lightBtn) lightBtn.click();
    });
    await sleep(800);

    // 11. TEST BOTTOM PROMPT BAR TEXT SUBMISSION
    console.log('\n--- 11. Testing Bottom Prompt Bar Prefill & Submission ---');
    const promptInput = await page.$('input[placeholder*="What would you like your team to work on"]');
    if (promptInput) {
      await promptInput.type('Synthesize Q3 B2B Enterprise GTM Plan');
      await sleep(500);
      await page.keyboard.press('Enter');
      await sleep(1200);
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_12_prefilled_new_task_modal.png') });
      console.log('📸 Captured: verify_12_prefilled_new_task_modal.png');
    }

    // Close New Task modal
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const xBtn = closeButtons.find(b => b.innerHTML.includes('lucide-x') || b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(800);

    // 12. TEST SETTINGS MODAL
    console.log('\n--- 12. Testing Settings Modal ---');
    await page.evaluate(() => {
      const settingsBtns = Array.from(document.querySelectorAll('button')).filter(b => b.title === 'Settings' || b.innerText.includes('Settings'));
      if (settingsBtns.length > 0) settingsBtns[0].click();
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_13_settings_modal.png') });
    console.log('📸 Captured: verify_13_settings_modal.png');

    // Close settings
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const xBtn = closeButtons.find(b => b.innerHTML.includes('lucide-x') || b.querySelector('svg.lucide-x'));
      if (xBtn) xBtn.click();
    });
    await sleep(800);

    // Final full page screenshot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verify_14_final_state.png') });
    console.log('📸 Captured: verify_14_final_state.png');

    console.log('\n=============================================');
    console.log(`✅ VERIFICATION COMPLETE! Total Page Errors: ${pageErrors.length}`);
    if (pageErrors.length > 0) {
      console.error('Page errors encountered:', pageErrors);
    }
    console.log('=============================================');

  } catch (err) {
    console.error('Verification failed with error:', err);
  } finally {
    await browser.close();
  }
})();
