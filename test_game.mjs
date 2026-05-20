import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));

  // Use local server
  await page.goto('http://localhost:8768/');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/vp_home_local.png' });
  console.log('Home local done. Errors:', errors.length);
  errors.length = 0;

  // Click Jugar → Game (via loading)
  await page.click('text=Jugar');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: '/tmp/vp_game_local.png' });
  console.log('Game local done. Errors:', errors.length);

  await browser.close();
})();
