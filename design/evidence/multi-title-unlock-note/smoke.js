'use strict';
/**
 * P3: same end() unlocks first_perfect + daily_batter → result note lists BOTH.
 * Before fix: noteDailyClear evaluate() wiped noteRun unlocks → only 「일일 타자」.
 * URL: http://127.0.0.1:8765/
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const OUT = __dirname;
const BASE = 'http://127.0.0.1:8765/';
const results = [];

function step(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail == null ? '' : String(detail) });
  console.log((ok ? 'PASS' : 'FAIL'), name, detail == null ? '' : detail);
}

async function shot(page, name) {
  try {
    await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  } catch (e) {
    console.warn('shot fail', name, e.message);
  }
}

async function waitReady(page) {
  await page.waitForFunction(() => {
    const s = document.querySelector('#start');
    return s && !s.disabled && /플레이/.test(s.textContent || '');
  }, { timeout: 60000 });
}

async function hardWipe(page) {
  await page.goto(BASE + '?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitReady(page);
  await page.evaluate(() => {
    try {
      localStorage.clear();
      localStorage.setItem('beat-heedong.video-v1-seen', '1');
    } catch {}
  });
  await page.goto(BASE + '?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitReady(page);
  await page.evaluate(() => {
    const c = document.querySelector('#cinematic');
    if (c && !c.classList.contains('hidden')) {
      const skip = document.querySelector('#cinematic-skip');
      if (skip) skip.click();
    }
  });
  await page.waitForTimeout(150);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  try {
    await hardWipe(page);
    await page.evaluate(() => {
      DailyMatch.__setTestToday('2026-09-14'); // stage_2
      DailyMatch.setAssetsReady(true);
      DailyMatch.renderCard();
    });

    const goal = await page.evaluate(() => DailyMatch.todayGoal());
    step('fixture day stage_2', goal && goal.id === 'stage_2', JSON.stringify(goal));

    await page.click('.daily-play');
    await page.waitForTimeout(400);
    step('daily active', await page.evaluate(() => DailyMatch.isActive()));

    // Real end() path: records.update → TitleBook.noteRun → DailyMatch.noteRun → unlockNoteHtml
    await page.evaluate(() => {
      game.stage = 2;
      game.perfects = 1;
      game.state = 'won';
      game.hits = 3;
      game.misses = 0;
      game.bestCombo = 2;
      game.time = 12;
      game.rallyCount = 1;
      game.dodges = 0;
      end();
    });
    await page.waitForTimeout(400);

    const unlock = await page.evaluate(() => {
      const n = document.querySelector('.title-unlock-note');
      const daily = document.querySelector('.daily-result-note');
      let ls = null;
      try { ls = JSON.parse(localStorage.getItem('beat-heedong.titles.v1') || 'null'); } catch {}
      return {
        text: n ? n.textContent.trim() : '',
        daily: daily ? daily.textContent.trim() : '',
        unlocked: ls && ls.unlocked ? ls.unlocked : []
      };
    });

    const hasBoth =
      /첫 퍼펙트/.test(unlock.text) &&
      /일일 타자/.test(unlock.text);
    step('unlock note lists BOTH titles', hasBoth, unlock.text);
    step('daily note has 칭호 해금', /칭호 해금/.test(unlock.daily), unlock.daily);
    step('LS has both unlocks',
      Array.isArray(unlock.unlocked) &&
        unlock.unlocked.includes('first_perfect') &&
        unlock.unlocked.includes('daily_batter'),
      JSON.stringify(unlock.unlocked));
    await shot(page, '01-both-titles-unlock-note.png');

    // Continue clear same day: no false unlock suffix; unlock note empty/absent for new titles
    await page.evaluate(() => {
      if (typeof start === 'function') start('continue');
    });
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      game.stage = 2;
      game.perfects = 1;
      game.state = 'won';
      game.hits = 2;
      game.misses = 0;
      game.bestCombo = 1;
      game.time = 8;
      game.rallyCount = 1;
      game.dodges = 0;
      end();
    });
    await page.waitForTimeout(400);

    const cont = await page.evaluate(() => {
      const daily = document.querySelector('.daily-result-note');
      const n = document.querySelector('.title-unlock-note');
      return {
        daily: daily ? daily.textContent.trim() : '',
        unlock: n ? n.textContent.trim() : ''
      };
    });
    step('continue daily note no false 칭호 해금',
      cont.daily === '오늘의 승부 클리어!',
      cont.daily);
    // start('continue') after stage_2 win advances to stage 3 → 「3회 연장전」 may legitimately unlock; that is OK.
    step('continue unlock note is not daily_batter again',
      !/일일 타자/.test(cont.unlock),
      cont.unlock);
    await shot(page, '02-continue-no-false-unlock.png');

    // Locked toast still works after polish path
    await page.evaluate(() => {
      if (typeof showStartMenu === 'function') showStartMenu();
    });
    await page.waitForTimeout(300);
    await page.locator('#title-chip').click();
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      const locked = document.querySelector('dialog.titles-dialog .title-card.locked');
      if (locked) locked.click();
    });
    await page.waitForTimeout(150);
    const toast = await page.evaluate(() => {
      const el = document.querySelector('dialog.titles-dialog .titles-toast');
      if (!el) return { ok: false };
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return {
        ok: !el.hidden && el.classList.contains('show') && /잠겨/.test(el.textContent || ''),
        text: (el.textContent || '').trim(),
        visible: r.height > 0 && st.opacity !== '0'
      };
    });
    step('locked toast visible in catalog', toast.ok && toast.visible, JSON.stringify(toast));
    await shot(page, '03-locked-toast.png');

  } catch (e) {
    step('smoke runner exception', false, String(e && e.stack || e));
  }

  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  const summary = {
    total: results.length,
    passed,
    failed,
    failures: results.filter(r => !r.ok).map(r => ({ name: r.name, detail: r.detail })),
    results,
    at: new Date().toISOString()
  };
  fs.writeFileSync(path.join(OUT, 'RESULTS.json'), JSON.stringify(summary, null, 2));
  const md = [
    '# multi-title unlock note',
    '',
    `SUMMARY ${passed}/${results.length} failed=${failed}`,
    '',
    ...results.map(r => `- ${r.ok ? 'PASS' : 'FAIL'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`)
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'RESULTS.md'), md + '\n');
  console.log('\nSUMMARY', passed + '/' + results.length, 'failed=' + failed);
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(err => {
  console.error(err);
  process.exit(2);
});
