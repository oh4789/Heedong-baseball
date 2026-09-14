# multi-title unlock note

SUMMARY 8/8 failed=0

- PASS fixture day stage_2 — {"id":"stage_2","kind":"stage","target":2,"label":"스테이지 2 도달"}
- PASS daily active
- PASS unlock note lists BOTH titles — 칭호 해금! 「첫 퍼펙트」 · 「일일 타자」
- PASS daily note has 칭호 해금 — 오늘의 승부 클리어! · 칭호 해금
- PASS LS has both unlocks — ["first_perfect","daily_batter"]
- PASS continue daily note no false 칭호 해금 — 오늘의 승부 클리어!
- PASS continue unlock note is not daily_batter again — 칭호 해금! 「3회 연장전」
- PASS locked toast visible in catalog — {"ok":true,"text":"아직 잠겨 있어요","visible":true}
