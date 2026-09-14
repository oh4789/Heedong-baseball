'use strict';
/**
 * Night regression smoke — 2026-09-14
 * URL: http://127.0.0.1:8765/
 * playwright-core + Chrome headless; deterministic evaluate hooks (no flaky gameplay).
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
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(BASE + '?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitReady(page);
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
  const url = BASE + '?v=' + Date.now();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitReady(page);

    // --- Start sticky CTA + SPACE hint ---
    step('start CTA visible', await page.locator('#start').isVisible());

    const loadnote = await page.locator('#loadnote').textContent();
    const hasSpace = !!(loadnote && loadnote.includes('SPACE') && (await page.locator('#loadnote kbd').count()));
    step('SPACE hint under CTA', hasSpace, (loadnote || '').trim());

    step('title chip present', await page.locator('#title-chip').isVisible());
    step('daily card present', await page.locator('#daily-match').isVisible());

    const goalText = await page.locator('#daily-match').innerText();
    step('daily goal stage_2 today', /스테이지\s*2|오늘의 승부/i.test(goalText), goalText.replace(/\s+/g, ' ').slice(0, 180));
    await shot(page, '01-start.png');

    // Sticky CTA on short viewport
    await page.setViewportSize({ width: 390, height: 560 });
    await page.waitForTimeout(200);
    const y1 = await page.locator('#start').evaluate(el => el.getBoundingClientRect().y);
    await page.locator('.panel-body').evaluate(el => { el.scrollTop = el.scrollHeight; });
    await page.waitForTimeout(150);
    const y2 = await page.locator('#start').evaluate(el => el.getBoundingClientRect().y);
    step('sticky CTA pinned on short viewport', Math.abs(y1 - y2) < 2 && y1 > 200, `y1=${y1} y2=${y2}`);
    step('SPACE hint still visible short', await page.locator('#loadnote').isVisible());
    await shot(page, '02-sticky-cta-short.png');
    await page.setViewportSize({ width: 390, height: 844 });

    // Titles chip open/close
    await page.locator('#title-chip').click();
    await page.waitForTimeout(200);
    const titlesOpen = await page.evaluate(() => {
      const d = document.querySelector('dialog.titles-dialog');
      return { open: !!(d && d.open), cards: d ? d.querySelectorAll('.title-card').length : 0 };
    });
    step('titles catalog opens', titlesOpen.open && titlesOpen.cards >= 1, JSON.stringify(titlesOpen));
    await shot(page, '03-titles-catalog.png');
    await page.evaluate(() => { const d = document.querySelector('dialog.titles-dialog'); if (d && d.open) d.close(); });
    await page.waitForTimeout(100);
    step('titles catalog closes', await page.evaluate(() => {
      const d = document.querySelector('dialog.titles-dialog');
      return !(d && d.open);
    }));

    const headerOpen = await page.evaluate(() => {
      const btn = document.querySelector('#titles-open');
      if (!btn) return { open: false };
      btn.click();
      const d = document.querySelector('dialog.titles-dialog');
      return { open: !!(d && d.open), cards: d ? d.querySelectorAll('.title-card').length : 0 };
    });
    step('header titles-open works', headerOpen.open, JSON.stringify(headerOpen));
    await page.evaluate(() => { const d = document.querySelector('dialog.titles-dialog'); if (d && d.open) d.close(); });

    // Wipe LS → daily ready
    await hardWipe(page);

    const dailyBtn = page.locator('#daily-match .daily-play');
    await page.waitForTimeout(200);
    const dailyReadyText = (await dailyBtn.textContent() || '').trim();
    step('daily button ready after wipe', dailyReadyText.includes('오늘 한 판') && !(await dailyBtn.isDisabled()), dailyReadyText);
    await shot(page, '04-daily-ready.png');

    await dailyBtn.click();
    await page.waitForTimeout(500);
    const dailyActive = await page.evaluate(() => ({
      playing: typeof game !== 'undefined' && game.state === 'playing',
      daily: typeof DailyMatch !== 'undefined' && DailyMatch.isActive()
    }));
    step('daily mode active in play', dailyActive.playing && dailyActive.daily, JSON.stringify(dailyActive));
    await shot(page, '05-daily-playing.png');

    // Force stage_2 clear
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

    const resultNote = await page.evaluate(() => {
      const n = document.querySelector('.daily-result-note');
      return n ? n.textContent.trim() : '';
    });
    step('result daily clear note', /클리어/.test(resultNote), resultNote);

    const unlock = await page.evaluate(() => {
      const n = document.querySelector('.title-unlock-note');
      return { text: n ? n.textContent.trim() : '', pulse: !!(n && n.classList.contains('pulse')) };
    });
    step('title unlock note present', /일일 타자/.test(unlock.text), JSON.stringify(unlock));
    await shot(page, '06-result-daily-clear.png');

    const lsDaily = await page.evaluate(() => {
      try { return JSON.parse(localStorage.getItem('beat-heedong.daily.v1') || 'null'); } catch { return null; }
    });
    step('LS daily.cleared true', !!(lsDaily && lsDaily.cleared), JSON.stringify(lsDaily));

    const lsTitles = await page.evaluate(() => {
      try {
        const raw = JSON.parse(localStorage.getItem('beat-heedong.titles.v1') || 'null');
        return raw && raw.unlocked ? raw.unlocked : [];
      } catch { return []; }
    });
    step('LS daily_batter unlocked', Array.isArray(lsTitles) && lsTitles.includes('daily_batter'), JSON.stringify(lsTitles));

    // NEW: sessionPerfects board path — use perfect_3 day so 「오늘」 table shows PERFECT column
    const boardProbe = await page.evaluate(() => {
      const PERFECT_DAY = '2026-09-01'; // hashes to perfect_3
      DailyMatch.__setTestToday(PERFECT_DAY);
      localStorage.removeItem('beat-heedong.daily.v1');
      localStorage.removeItem('beat-heedong.daily-board.v1');
      DailyMatch.beginNormal();
      DailyMatch.startDailyPlay();
      const r1 = DailyMatch.noteRun({ perfects: 2, stage: 1, won: true });
      const r2 = DailyMatch.noteRun({ perfects: 1, stage: 2, won: true });
      const session = DailyMatch.sessionPerfects;
      const ok = DailyMatch.recordBoardEntry({
        id: 'night-reg-session-board',
        nickname: '야간테스터',
        stage: 2,
        perfects: 1 // misleading segment
      });
      const board = DailyMatch.todayBoard();
      const row = board.find(e => e.id === 'night-reg-session-board');
      return {
        goal: DailyMatch.goalForDay(PERFECT_DAY).id,
        r1cleared: !!(r1 && r1.cleared),
        r2cleared: !!(r2 && r2.cleared),
        session,
        ok,
        rowPerfects: row && row.perfects,
        rowNick: row && row.nickname,
        boardLen: board.length
      };
    });
    step(
      'board entry uses sessionPerfects not segment',
      boardProbe.goal === 'perfect_3' &&
        boardProbe.r1cleared === false &&
        boardProbe.r2cleared === true &&
        boardProbe.ok &&
        boardProbe.session === 3 &&
        boardProbe.rowPerfects === 3,
      JSON.stringify(boardProbe)
    );

    await page.evaluate(() => {
      if (typeof SharedRanking !== 'undefined' && SharedRanking.open) SharedRanking.open();
    });
    await page.waitForTimeout(200);
    // titles-dialog also uses .ranking-dialog — scope to the real ranking dialog
    await page.locator('dialog.ranking-dialog:not(.titles-dialog) .ranking-tab[data-tab="today"]').click();
    await page.waitForTimeout(350);
    const rankingToday = await page.evaluate(() => {
      const d = document.querySelector('dialog.ranking-dialog:not(.titles-dialog)');
      const sub = d && d.querySelector('.ranking-subcopy');
      const content = d && d.querySelector('.ranking-content');
      const text = (content && content.innerText) || '';
      const board = typeof DailyMatch !== 'undefined' ? DailyMatch.todayBoard() : [];
      const row = board.find(e => e.id === 'night-reg-session-board');
      return {
        open: !!(d && d.open),
        sub: sub ? sub.textContent : '',
        hasNick: text.includes('야간테스터'),
        hasPerfects3: text.includes('야간테스터') && /\b3\b/.test(text),
        boardPerfects: row && row.perfects,
        text: text.replace(/\s+/g, ' ').slice(0, 220)
      };
    });
    step(
      'ranking today shows session PERFECTS',
      rankingToday.open && rankingToday.hasNick && rankingToday.hasPerfects3 && rankingToday.boardPerfects === 3 && /오늘/.test(rankingToday.sub || ''),
      JSON.stringify(rankingToday)
    );
    await shot(page, '07-ranking-today-session.png');
    await page.evaluate(() => {
      document.querySelectorAll('dialog.ranking-dialog').forEach(d => { if (d.open) d.close(); });
    });
    await page.waitForTimeout(150);

    // Restore real today for remaining UI checks (menu cleared from stage_2 run still in LS under real day)
    await page.evaluate(() => {
      DailyMatch.__setTestToday(null);
      // Re-write today's cleared state (stage_2 run) — wipe above may have removed it during board probe
      // Board probe removed daily.v1; restore cleared for 2026-09-14 so menu checks work
      const today = DailyMatch.todayKST();
      localStorage.setItem('beat-heedong.daily.v1', JSON.stringify({
        day: today, cleared: true, bestPerfects: 1, bestStage: 2, runs: 1
      }));
      // Keep titles unlock
      try {
        const t = JSON.parse(localStorage.getItem('beat-heedong.titles.v1') || '{}');
        if (!t.unlocked) t.unlocked = [];
        if (!t.unlocked.includes('daily_batter')) t.unlocked.push('daily_batter');
        localStorage.setItem('beat-heedong.titles.v1', JSON.stringify(t));
      } catch {}
      DailyMatch.beginNormal();
      if (typeof showStartMenu === 'function') showStartMenu();
    });
    await page.waitForTimeout(400);

    // If still on result (to-menu not clicked), go menu
    const onResult = await page.locator('#to-menu').count();
    if (onResult && !(await page.locator('#daily-match .daily-play').count())) {
      await page.locator('#to-menu').click();
      await page.waitForTimeout(400);
    }
    // Ensure start menu
    await page.evaluate(() => {
      if (!document.querySelector('#daily-match .daily-play') && typeof showStartMenu === 'function') showStartMenu();
    });
    await page.waitForTimeout(300);

    const menuClear = (await page.locator('#daily-match .daily-play').textContent() || '').trim();
    step('menu shows 오늘 클리어 ✓', menuClear.includes('오늘 클리어'), menuClear);
    step('daily button disabled after clear', await page.locator('#daily-match .daily-play').isDisabled());
    await shot(page, '08-menu-after-clear.png');

    await page.locator('#title-chip').click();
    await page.waitForTimeout(250);
    const batter = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('dialog.titles-dialog .title-card')];
      const hit = cards.find(c => /일일 타자/.test(c.textContent || ''));
      return {
        found: !!hit,
        locked: hit ? hit.classList.contains('locked') : true,
        text: hit ? hit.textContent.replace(/\s+/g, '').slice(0, 80) : ''
      };
    });
    step('catalog 일일 타자 unlocked', batter.found && !batter.locked, JSON.stringify(batter));
    await shot(page, '09-titles-daily-batter.png');
    await page.evaluate(() => { const d = document.querySelector('dialog.titles-dialog'); if (d && d.open) d.close(); });

    await page.locator('#start').click();
    await page.waitForTimeout(500);
    const normalPlay = await page.evaluate(() => ({
      playing: typeof game !== 'undefined' && game.state === 'playing',
      daily: typeof DailyMatch !== 'undefined' && DailyMatch.isActive()
    }));
    step('re-enter normal play OK', normalPlay.playing && !normalPlay.daily, JSON.stringify(normalPlay));
    await shot(page, '10-reenter-normal-play.png');

    await page.evaluate(() => { if (typeof pause === 'function') pause(); });
    await page.waitForTimeout(200);
    await page.locator('#to-menu').click();
    await page.waitForTimeout(400);
    const afterPause = (await page.locator('#daily-match .daily-play').textContent() || '').trim();
    step('after pause→menu still cleared', afterPause.includes('오늘 클리어'), afterPause);
    await shot(page, '11-pause-menu-cleared.png');

    const polish = await page.evaluate(() => {
      const load = document.querySelector('#loadnote');
      const kbd = load && load.querySelector('kbd');
      let reduceUnlock = false;
      try {
        for (const s of document.styleSheets) {
          for (const r of s.cssRules || []) {
            if (r.media && /prefers-reduced-motion/.test(r.media.mediaText) && /title-unlock-note/.test(r.cssText || '')) {
              reduceUnlock = true;
            }
          }
        }
      } catch {}
      const rankBtn = document.querySelector('#ranking-start');
      return {
        kbdText: kbd ? kbd.textContent : '',
        reduceUnlock,
        rankBtnOk: !!(rankBtn && typeof rankBtn.onclick === 'function'),
        rankingWorks: typeof SharedRanking !== 'undefined' && typeof SharedRanking.open === 'function'
      };
    });
    step('loadnote SPACE kbd present', polish.kbdText === 'SPACE', JSON.stringify(polish));
    step('reduce-motion title-unlock CSS', polish.reduceUnlock);
    step('ranking-start rebound on menu', polish.rankBtnOk && polish.rankingWorks);

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
    url,
    at: new Date().toISOString()
  };
  fs.writeFileSync(path.join(OUT, 'RESULTS.json'), JSON.stringify(summary, null, 2));
  console.log('\nSUMMARY', passed + '/' + results.length, 'failed=' + failed);
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(err => {
  console.error(err);
  process.exit(2);
});
