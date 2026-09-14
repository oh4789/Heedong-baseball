'use strict';
/**
 * P3: daily result note only says 「칭호 해금」 when a title actually unlocked.
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

  try {
    await hardWipe(page);
    await page.evaluate(() => {
      DailyMatch.__setTestToday('2026-09-14'); // stage_2
      DailyMatch.setAssetsReady(true);
      DailyMatch.renderCard();
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitReady(page);
    await page.evaluate(() => {
      DailyMatch.__setTestToday('2026-09-14');
      DailyMatch.setAssetsReady(true);
      DailyMatch.renderCard();
    });

    const goal = await page.evaluate(() => DailyMatch.todayGoal());
    step('fixture day stage_2', goal && goal.id === 'stage_2', JSON.stringify(goal));

    await page.click('.daily-play');
    await page.waitForTimeout(400);
    step('daily active', await page.evaluate(() => DailyMatch.isActive()));

    // First clear → title unlock
    const first = await page.evaluate(() => {
      TitleBook.noteRun({ dodges: 0, stage: 2, perfects: 1 });
      const r = DailyMatch.noteRun({ stage: 2, perfects: 1, won: true });
      return {
        r,
        dailyHtml: DailyMatch.resultNoteHtml(),
        unlockHtml: TitleBook.unlockNoteHtml(),
        unlocked: TitleBook.state.unlocked.slice()
      };
    });
    step(
      'first clear note includes 칭호 해금',
      first.r.newlyCleared && first.r.lastResultNote === '오늘의 승부 클리어! · 칭호 해금',
      first.r.lastResultNote
    );
    step(
      'first clear unlock note shows 일일 타자',
      /일일 타자/.test(first.unlockHtml),
      first.unlockHtml
    );
    step(
      'daily_batter unlocked',
      first.unlocked.includes('daily_batter'),
      JSON.stringify(first.unlocked)
    );

    // Inject result UI for screenshot of first clear
    await page.evaluate((html) => {
      const panel = document.querySelector('#overlay .panel');
      if (!panel) return;
      panel.innerHTML =
        '<div class="panel-body"><h1>희동이를 이겼다!</h1><div class="result-grid"><div><b>1</b><small>PERFECT</small></div></div>' +
        html.unlock +
        html.daily +
        '</div><div class="panel-cta"><button class="primary" id="continue-max">다음</button></div>';
      document.querySelector('#overlay').classList.remove('hidden');
    }, { unlock: first.unlockHtml, daily: first.dailyHtml });
    await shot(page, '01-first-clear-with-unlock.png');

    // Continue segment after already cleared — still activeDaily
    const second = await page.evaluate(() => {
      TitleBook.noteRun({ dodges: 0, stage: 3, perfects: 1 });
      const r = DailyMatch.noteRun({ stage: 3, perfects: 1, won: true });
      return {
        r,
        dailyHtml: DailyMatch.resultNoteHtml(),
        unlockHtml: TitleBook.unlockNoteHtml(),
        active: DailyMatch.isActive()
      };
    });
    step('still daily after continue', second.active);
    step(
      'continue clear note omits 칭호 해금',
      second.r.cleared &&
        !second.r.newlyCleared &&
        second.r.lastResultNote === '오늘의 승부 클리어!' &&
        second.r.lastResultNote.indexOf('칭호') < 0,
      second.r.lastResultNote
    );
    step(
      'continue unlock note empty',
      second.unlockHtml === '',
      JSON.stringify(second.unlockHtml)
    );

    await page.evaluate((html) => {
      const panel = document.querySelector('#overlay .panel');
      if (!panel) return;
      panel.innerHTML =
        '<div class="panel-body"><h1>희동이를 이겼다!</h1><div class="result-grid"><div><b>1</b><small>PERFECT</small></div></div>' +
        html.unlock +
        html.daily +
        '</div><div class="panel-cta"><button class="primary" id="continue-max">다음</button></div>';
    }, { unlock: second.unlockHtml, daily: second.dailyHtml });
    await shot(page, '02-continue-clear-no-false-unlock.png');

    // Next KST day: clear again with title already owned
    const day2 = await page.evaluate(() => {
      DailyMatch.beginNormal();
      DailyMatch.__setTestToday('2026-09-15');
      try { localStorage.removeItem('beat-heedong.daily.v1'); } catch {}
      DailyMatch.renderCard();
      DailyMatch.setAssetsReady(true);
      // activate daily without full UI click: mimic startDailyPlay core
      const startFnOk = true;
      // poke via button if present
      const btn = document.querySelector('.daily-play');
      if (btn && !btn.disabled) btn.click();
      return {
        goal: DailyMatch.todayGoal(),
        active: DailyMatch.isActive(),
        unlocked: TitleBook.state.unlocked.slice()
      };
    });
    // If click didn't activate (menu destroyed), force via internal path
    if (!day2.active) {
      await page.evaluate(() => {
        // Reconstruct minimal activation: call noteRun path needs activeDaily
        // Use startDailyPlay if available
        if (typeof DailyMatch.startDailyPlay === 'function') {
          try { DailyMatch.startDailyPlay(); } catch {}
        }
      });
    }
    // Ensure activeDaily by reading source pattern — startDailyPlay sets it
    const activated = await page.evaluate(() => {
      if (DailyMatch.isActive()) return true;
      // Fallback: set via noteRun won't work. Re-open start and click.
      return false;
    });
    if (!activated) {
      await page.evaluate(() => {
        if (typeof showStartMenu === 'function') showStartMenu();
        DailyMatch.__setTestToday('2026-09-15');
        DailyMatch.setAssetsReady(true);
        DailyMatch.renderCard();
      });
      await page.waitForTimeout(200);
      await page.click('.daily-play');
      await page.waitForTimeout(300);
    }

    const day2clear = await page.evaluate(() => {
      const active = DailyMatch.isActive();
      const goal = DailyMatch.todayGoal();
      const stage = goal.kind === 'stage' ? goal.target : 3;
      const perfects = goal.kind === 'perfect' ? goal.target : 1;
      TitleBook.noteRun({ dodges: 0, stage, perfects });
      const r = DailyMatch.noteRun({ stage, perfects, won: true });
      return {
        active,
        goal,
        r,
        dailyHtml: DailyMatch.resultNoteHtml(),
        unlockHtml: TitleBook.unlockNoteHtml()
      };
    });
    step('day2 daily active', day2clear.active || day2clear.r != null, JSON.stringify({ active: day2clear.active, goal: day2clear.goal }));
    step(
      'day2 clear note omits 칭호 해금 (already owned)',
      day2clear.r &&
        day2clear.r.newlyCleared &&
        day2clear.r.lastResultNote === '오늘의 승부 클리어!' &&
        day2clear.r.lastResultNote.indexOf('칭호') < 0,
      day2clear.r && day2clear.r.lastResultNote
    );
    step(
      'day2 unlock note empty',
      day2clear.unlockHtml === '',
      JSON.stringify(day2clear.unlockHtml)
    );

    await page.evaluate((html) => {
      const panel = document.querySelector('#overlay .panel');
      if (!panel) return;
      panel.innerHTML =
        '<div class="panel-body"><h1>희동이를 이겼다!</h1>' +
        html.unlock +
        html.daily +
        '</div>';
      document.querySelector('#overlay').classList.remove('hidden');
    }, { unlock: day2clear.unlockHtml || '', daily: day2clear.dailyHtml || '' });
    await shot(page, '03-day2-clear-already-owned.png');

    // Regression: shortfall still works
    await page.evaluate(() => {
      DailyMatch.beginNormal();
      DailyMatch.__setTestToday('2026-09-16');
      try { localStorage.removeItem('beat-heedong.daily.v1'); } catch {}
    });
    await page.evaluate(() => {
      if (typeof showStartMenu === 'function') showStartMenu();
      DailyMatch.__setTestToday('2026-09-16');
      DailyMatch.setAssetsReady(true);
      DailyMatch.renderCard();
    });
    await page.waitForTimeout(200);
    await page.click('.daily-play');
    await page.waitForTimeout(300);
    const shortfall = await page.evaluate(() => {
      const goal = DailyMatch.todayGoal();
      TitleBook.noteRun({ dodges: 0, stage: 1, perfects: 0 });
      const r = DailyMatch.noteRun({ stage: 1, perfects: 0, won: false });
      return { goal, r, html: DailyMatch.resultNoteHtml() };
    });
    step(
      'shortfall note still present',
      shortfall.r && !shortfall.r.cleared && /부족/.test(shortfall.r.lastResultNote),
      shortfall.r && shortfall.r.lastResultNote
    );
  } finally {
    const passed = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok);
    const summary = {
      total: results.length,
      passed,
      failed: failed.length,
      failures: failed,
      results
    };
    fs.writeFileSync(path.join(OUT, 'RESULTS.json'), JSON.stringify(summary, null, 2));
    const md = [
      '# daily-clear-note-no-unlock',
      '',
      'P3 polish: result daily note appends `· 칭호 해금` only when TitleBook actually unlocked a title on this clear.',
      '',
      `- total: ${summary.total}`,
      `- passed: ${summary.passed}`,
      `- failed: ${summary.failed}`,
      '',
      ...results.map((r) => `- ${r.ok ? 'PASS' : 'FAIL'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`)
    ].join('\n');
    fs.writeFileSync(path.join(OUT, 'RESULTS.md'), md + '\n');
    await browser.close();
    if (failed.length) process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
