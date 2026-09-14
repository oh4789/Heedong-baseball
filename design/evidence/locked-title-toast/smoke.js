'use strict';
/**
 * P3 locked-title toast — visible inside titles dialog (not behind #feedback).
 * Viewport 390×844 mobile.
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
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
}

async function waitReady(page) {
  await page.waitForFunction(() => {
    const s = document.querySelector('#start');
    return s && !s.disabled && /플레이/.test(s.textContent || '');
  }, { timeout: 60000 });
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
    // ensure cinematic dismissed if it still appeared
    await page.evaluate(() => {
      const c = document.querySelector('#cinematic');
      if (c && !c.classList.contains('hidden')) {
        const skip = document.querySelector('#cinematic-skip');
        if (skip) skip.click();
      }
    });
    await page.waitForTimeout(200);

    step('title chip visible', await page.locator('#title-chip').isVisible());
    await page.locator('#title-chip').click();
    await page.waitForTimeout(200);

    const catalog = await page.evaluate(() => {
      const d = document.querySelector('dialog.titles-dialog');
      return {
        open: !!(d && d.open),
        locked: d ? d.querySelectorAll('.title-card.locked').length : 0,
        toastEl: !!(d && d.querySelector('.titles-toast'))
      };
    });
    step('catalog open with locked cards', catalog.open && catalog.locked >= 1, JSON.stringify(catalog));
    step('titles-toast element present', catalog.toastEl);
    await shot(page, '01-catalog-before-toast.png');

    await page.locator('.titles-dialog .title-card.locked').first().click();
    await page.waitForTimeout(120);

    const toast = await page.evaluate(() => {
      const d = document.querySelector('dialog.titles-dialog');
      const t = d && d.querySelector('.titles-toast');
      if (!t) return null;
      const r = t.getBoundingClientRect();
      const cs = getComputedStyle(t);
      // Is toast inside dialog top-layer and visible?
      return {
        text: t.textContent,
        hidden: t.hidden,
        show: t.classList.contains('show'),
        opacity: cs.opacity,
        width: r.width,
        height: r.height,
        top: r.top,
        // feedback still set? (legacy path should NOT be required)
        feedback: (document.querySelector('#feedback') || {}).textContent || ''
      };
    });
    step('toast text 아직 잠겨 있어요', toast && toast.text === '아직 잠겨 있어요', JSON.stringify(toast));
    step('toast visible (show + opacity)', toast && toast.show && Number(toast.opacity) > 0.5 && toast.height > 10, JSON.stringify(toast));
    step('toast not relying on #feedback', toast && toast.feedback !== '아직 잠겨 있어요', 'fb=' + (toast && toast.feedback));
    await shot(page, '02-locked-toast-visible.png');

    // keyboard path
    await page.locator('.titles-dialog .title-card.locked').nth(1).focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    const kb = await page.evaluate(() => {
      const t = document.querySelector('dialog.titles-dialog .titles-toast');
      return t && !t.hidden && t.classList.contains('show') && t.textContent === '아직 잠겨 있어요';
    });
    step('keyboard Enter shows toast', kb);

    // close clears toast
    await page.locator('.titles-dialog .titles-close').click();
    await page.waitForTimeout(100);
    const closed = await page.evaluate(() => {
      const d = document.querySelector('dialog.titles-dialog');
      const t = d && d.querySelector('.titles-toast');
      return { open: !!(d && d.open), toastHidden: !t || t.hidden || !t.classList.contains('show') };
    });
    step('close catalog clears toast', !closed.open && closed.toastHidden, JSON.stringify(closed));

    // reopen: toast stays hidden until next lock tap
    await page.locator('#title-chip').click();
    await page.waitForTimeout(150);
    const reopen = await page.evaluate(() => {
      const t = document.querySelector('dialog.titles-dialog .titles-toast');
      return !t || t.hidden || !t.classList.contains('show');
    });
    step('reopen starts without toast', reopen);
    await shot(page, '03-reopen-no-toast.png');

    // sticky CTA + header titles still ok (regression light)
    await page.evaluate(() => { const d = document.querySelector('dialog.titles-dialog'); if (d && d.open) d.close(); });
    step('start CTA still visible', await page.locator('#start').isVisible());
    await page.locator('#titles-open').click();
    await page.waitForTimeout(150);
    const hdr = await page.evaluate(() => {
      const d = document.querySelector('dialog.titles-dialog');
      return !!(d && d.open);
    });
    step('header titles-open over start', hdr);
    await page.locator('.titles-dialog .titles-close').click();

  } catch (e) {
    step('smoke threw', false, e && e.stack || String(e));
  }

  const pass = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok).length;
  const summary = { pass, fail, total: results.length, results };
  fs.writeFileSync(path.join(OUT, 'RESULTS.json'), JSON.stringify(summary, null, 2));
  const md = [
    '# Locked-title toast smoke — 2026-09-14',
    '',
    'Bug: design `run-meta-ui-v1` says locked card tap → toast `아직 잠겨 있어요`, but `say()` wrote `#feedback` under the native `<dialog>` top-layer (invisible).',
    '',
    'Fix: in-dialog `.titles-toast` inside `dialog.titles-dialog`.',
    '',
    `Viewport: 390×844 · **${pass}/${results.length} PASS**` + (fail ? ` (${fail} FAIL)` : ''),
    '',
    '| Step | Result | Detail |',
    '|---|---|---|',
    ...results.map(r => `| ${r.name} | ${r.ok ? 'PASS' : 'FAIL'} | ${(r.detail || '').replace(/\|/g, '/').slice(0, 120)} |`),
    '',
    'Screenshots: `01-catalog-before-toast.png`, `02-locked-toast-visible.png`, `03-reopen-no-toast.png`',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'RESULTS.md'), md);
  console.log('\nSUMMARY', pass + '/' + results.length);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
