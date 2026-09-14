# night-regression-0914-post-polish

SUMMARY 30/30 failed=0
at 2026-09-14T13:51:42.603Z

- PASS start CTA visible
- PASS SPACE hint under CTA — PC: 방향키 / WASD 이동 · SPACE 스윙
- PASS title chip present
- PASS daily card present
- PASS daily goal stage_2 today — TODAY'S MATCH 시드 · 09.14 오늘의 승부 목표 · 스테이지 2 도달 보상 · 「일일 타자」 칭호 오늘 한 판 매일 자정(KST) 시드 갱신 · 랭킹 「오늘」에 기록
- PASS sticky CTA pinned on short viewport — y1=455.8125 y2=455.8125
- PASS SPACE hint still visible short
- PASS titles catalog opens — {"open":true,"cards":4}
- PASS titles catalog closes
- PASS header titles-open works — {"open":true,"cards":4}
- PASS daily button ready after wipe — 오늘 한 판
- PASS daily mode active in play — {"playing":true,"daily":true}
- PASS result daily clear note — 오늘의 승부 클리어! · 칭호 해금
- PASS title unlock note present — {"text":"칭호 해금! 「첫 퍼펙트」 · 「일일 타자」","pulse":true}
- PASS title unlock note lists first_perfect too — 칭호 해금! 「첫 퍼펙트」 · 「일일 타자」
- PASS daily clear note has 칭호 해금 on first unlock — 오늘의 승부 클리어! · 칭호 해금
- PASS locked toast visible in catalog — {"ok":true,"text":"아직 잠겨 있어요","h":41.1875}
- PASS continue clear note without false 칭호 해금 — 오늘의 승부 클리어!
- PASS LS daily.cleared true — {"day":"2026-09-14","cleared":true,"bestPerfects":2,"bestStage":2,"runs":2}
- PASS LS daily_batter unlocked — ["first_perfect","daily_batter","stage_3"]
- PASS board entry uses sessionPerfects not segment — {"goal":"perfect_3","r1cleared":false,"r2cleared":true,"session":3,"ok":true,"rowPerfects":3,"rowNick":"야간테스터","boardLen":1}
- PASS ranking today shows session PERFECTS — {"open":true,"sub":"오늘 시드 기준 · 목표 달성자만","hasNick":true,"hasPerfects3":true,"boardPerfects":3,"text":"순위 닉네임 목표 PERFECT 1 야간테스터 PERFECT 3회 3"}
- PASS menu shows 오늘 클리어 ✓ — 오늘 클리어 ✓
- PASS daily button disabled after clear
- PASS catalog 일일 타자 unlocked — {"found":true,"locked":false,"text":"📅일일타자달성·오늘의승부장착"}
- PASS re-enter normal play OK — {"playing":true,"daily":false}
- PASS after pause→menu still cleared — 오늘 클리어 ✓
- PASS loadnote SPACE kbd present — {"kbdText":"SPACE","reduceUnlock":true,"rankBtnOk":true,"rankingWorks":true}
- PASS reduce-motion title-unlock CSS
- PASS ranking-start rebound on menu
