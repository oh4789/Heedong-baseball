night-regression-0914 — overnight demo loop smoke
=================================================
Date: 2026-09-14
URL: http://127.0.0.1:8765/ (cache-bust ?v=)
Method: playwright-core + Chrome headless; deterministic evaluate hooks (no flaky gameplay)

Also re-ran: node design/evidence/daily-perfect-accumulate/test-session-perfects.js → 7/7 PASS

Browser RESULTS.json: 26/26 PASS
Coverage:
1. start sticky CTA + #loadnote SPACE kbd hint (normal + short 560px viewport)
2. titles chip/catalog open/close; header #titles-open through overlay
3. wipe LS → daily 오늘 한 판 → daily play → force stage_2 clear via game.stage=2 + end()
4. result daily clear note + 「일일 타자」 unlock pulse; LS daily.cleared + titles
5. NEW: sessionPerfects board path (fixture day 2026-09-01 perfect_3): noteRun 2+1 → session 3;
   recordBoardEntry(segment perfects=1) stores 3; ranking 「오늘」 shows 야간테스터 · PERFECT 3
6. menu 오늘 클리어 ✓ disabled; catalog unlocked; normal re-enter; pause→menu still cleared
7. polish checks: reduce-motion title-unlock CSS; ranking-start rebound after showStartMenu

Evidence: 01–11 png + RESULTS.json + smoke.js
Note: titles-dialog also uses class ranking-dialog — smoke scopes with :not(.titles-dialog).
Push: BLOCKED (needs user approval) — evidence committed locally only.
