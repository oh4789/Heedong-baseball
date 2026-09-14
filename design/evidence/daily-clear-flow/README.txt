daily-clear-flow smoke — 2026-09-14
URL: http://127.0.0.1:8765/ (hard-reload cache bust)
Method: playwright-core + Chrome headless; daily clear forced via game.stage=2 + end() while DailyMatch.active

Results: 23/23 PASS
- sticky CTA · titles · daily start regression
- wipe → 오늘 한 판 → daily play → stage_2 clear → result note + 「일일 타자」 unlock pulse
- LS beat-heedong.daily.v1 cleared=true; titles unlocked includes daily_batter
- #to-menu → 오늘 클리어 ✓ disabled; catalog unlocked; normal re-enter; pause→menu still cleared
- ranking 「오늘」 tab copy verified in follow-up (오늘 시드 기준 · 목표 달성자만)

Evidence: 01–11 png + RESULTS.json
Note: on start overlay, header #titles-open is pointer-blocked by .panel-body; chip #title-chip opens catalog (by design/current layout).
