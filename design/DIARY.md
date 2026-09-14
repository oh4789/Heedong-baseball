# 「희동이를 이겨라」 일자별 개선·에셋 일기

한눈에 보기: [디자인 갤러리](index.html) · 미러 https://oh4789.github.io/Heedong-baseball/ · 전체 개발로그 `/workspace/game-development-log.md`

## 2026-09-14 — 런메타·몰입 juice·아트 폴리시·에셋 파이프라인

### 개선
- 칭호 / 오늘의 승부 / 시작메뉴 복원 / 불꽃 코칭 토스트
- 불꽃 3단 텔레그래프 · Perfect 금빛 트레일 · 1탭 재도전 · 도발 멘트
- 캐릭터 레터박스 제거 · 세로 구장 v2 · 보스 시작 클로즈업 · 결과/META HUD/도감 폴리시
- 아이디어 조사 봇 + 디자이너 상시 에셋 루틴

### 에셋·자료
- ✅ [구장 세로 v2](screens/stadium-bg-v2-portrait-960x1700.png)
- ✅ [보스 시작 클로즈업](screens/heedong-boss-start-closeup-v1-960x1700.png)
- ✅ [결과 패널 시안](screens/result-panel-polish-v1.png)
- ✅ [칭호·데일리 HUD](screens/meta-hud-title-daily-v1.png)
- ✅ [칭호 도감 카드](screens/titles-book-cards-v1.png)
- ✅ [불꽃 텔레그래프 VFX](assets/fire-pitch-telegraph-vfx-v1.png)
- ✅ [Perfect 트레일 VFX](assets/perfect-gold-trail-vfx-v1.png)
- ✅ [스윙 타이밍 링](assets/swing-timing-ring-v1.png)
- ✅ [몰입·전략 리서치](research/immersion-strategy-20260914.md)
- ✅ [구장 인게임 증거](evidence/stadium-v2-portrait-ingame.png)
- ✅ [시작 화면 증거](evidence/boss-start-closeup-ingame.png)

## 2026-09-13 — 코어 플레이어블·투수/타자 모션·BGM·미러 구축

### 개선
- 로컬 랭킹 mock / 오프닝 카피 / 밸런스 v1.1 / 풀스크린·CTA 핀
- 투수 5프레임 포즈 + 타자 스윙 프레임
- GitHub Pages 미러: https://oh4789.github.io/Heedong-baseball/

### 에셋·자료
- ✅ [투수 투구 시트 v1](characters/heedong-pitch-sheet-v1.png)
- ✅ [투수 프레임 v2](characters/heedong-pitch-frames-v2.png)
- ✅ [투수 프레임 v3](characters/heedong-pitch-frames-v3.png)
- ✅ [타자 스윙 시트](characters/batter-swing-sheet-v1.png)

## 최근 커밋 (참고)
```
22c845a ui: polish titles catalog cards to design v1
e9e35df fix: hide start panel horizontal records scrollbar
5e3d0e4 fix: hide horizontal scrollbar on personal records
f31baca ui: polish title chip and daily meta HUD to design v1
0006604 ui: avoid nested scrollbar on result personal records
2b9b5f3 ui: polish result panel to design v1
f7e7085 ui: use Heedong boss close-up for start menu art
0e5b879 ui: use true portrait stadium background v2
8d613ab fix: cover-crop stadium v2 to portrait without stretch
d14416a ui: swap stadium background to design v2
c03b670 ui: polish swing zone colors from timing-ring v1
0f604ac ui: polish perfect gold trail to design v1
b1d8da6 ui: match fire telegraph to design palette v1
05650e2 feat: expand heedong taunt lines
56ca472 feat: defeat one-tap retry
2cf08d6 feat: perfect gold trail polish
942d988 feat: fire pitch 3-stage telegraph
ddfc8bd fix: remove character letterbox cards and opaque pose backdrops
37dfd2a test: multi-title unlock note + post-polish night regression
bfe4252 fix: merge noteRun unlocks into daily clear note
382e6f6 test: daily clear note no-false-unlock evidence
004f18d fix: daily clear note only when title unlocked
64633b6 test: locked-title toast evidence
670011f ui: show locked-title toast inside titles catalog
c9769fe test: night regression after daily board session PERFECTS
3a903c7 test: board entry session PERFECT evidence
2e62403 fix: daily board entry uses session PERFECT total
46bbfb1 test: add daily PERFECT accumulate evidence
0b07de9 fix: accumulate daily PERFECT across continue segments
24bd92d test: add titles-open-header smoke evidence
aad5056 ui: let header titles button work over start overlay
f062d75 ui: pulse newly unlocked title cards in catalog
1ba9b3d test: add daily-clear full-flow smoke evidence
78d5e2f test: add start-menu-restore smoke evidence
1ef46d9 ui: restore start menu after end/pause
66750fd test: add today's match UI smoke evidence
d2a68e1 feat: add today's match daily challenge card and ranking tab
da8f8d6 ui: pin start CTA and strengthen PC SPACE hint
a0b096d test: add titles chip/catalog smoke evidence
9480d9d feat: run-meta titles chip and catalog (local unlock/equip)
```

_자동 생성 2026-09-14. Director가 일자별로 갱신._