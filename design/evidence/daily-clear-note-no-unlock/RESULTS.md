# daily-clear-note-no-unlock

P3 polish: result daily note appends `· 칭호 해금` only when TitleBook actually unlocked a title on this clear.

- total: 12
- passed: 12
- failed: 0

- PASS fixture day stage_2 — {"id":"stage_2","kind":"stage","target":2,"label":"스테이지 2 도달"}
- PASS daily active
- PASS first clear note includes 칭호 해금 — 오늘의 승부 클리어! · 칭호 해금
- PASS first clear unlock note shows 일일 타자 — <p class="title-unlock-note pulse">칭호 해금! 「일일 타자」</p>
- PASS daily_batter unlocked — ["daily_batter"]
- PASS still daily after continue
- PASS continue clear note omits 칭호 해금 — 오늘의 승부 클리어!
- PASS continue unlock note empty — ""
- PASS day2 daily active — {"active":true,"goal":{"id":"stage_3","kind":"stage","target":3,"label":"스테이지 3 도달"}}
- PASS day2 clear note omits 칭호 해금 (already owned) — 오늘의 승부 클리어!
- PASS day2 unlock note empty — ""
- PASS shortfall note still present — 오늘의 목표까지 PERFECT 3회 부족
