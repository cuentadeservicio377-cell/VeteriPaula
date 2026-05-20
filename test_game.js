const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  
  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));
  
  // 1. Home screen
  await page.goto('https://celadon-beijinho-385d9f.netlify.app/');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/vp_home.png' });
  console.log('Home errors:', errors.length);
  errors.length = 0;
  
  // 2. Click Jugar → Map
  await page.click('text=Jugar');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/vp_map.png' });
  console.log('Map errors:', errors.length);
  errors.length = 0;
  
  // 3. Click level 1 → Game
  const lvl1 = await page.$('button:has-text("1")');
  if (lvl1) await lvl1.click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: '/tmp/vp_game.png' });
  console.log('Game errors:', errors.length);
  errors.length = 0;
  
  // 4. Click correct answer → Celebration
  await page.click('text=VENDA');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: '/tmp/vp_celebration.png' });
  console.log('Celebration errors:', errors.length);
  
  console.log('All console errors:', errors);
  
  await browser.close();
})();
