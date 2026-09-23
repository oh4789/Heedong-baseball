# 「희동이를 이겨라」 일자별 개선·에셋 일기

한눈에 보기: [디자인 갤러리](index.html) · 미러 https://oh4789.github.io/Heedong-baseball/ · 전체 개발로그 `/workspace/game-development-log.md`

## 2026-09-23 저녁 — 고정형 유도 불꽃(aim-lock bait fire) 시안

### 개선
- hold-lock/고정 조준 시 **lockX 스냅샷 불꽃** 비주얼 보드(민트 펄스→코랄 레인, 호밍 없음 vs 옆이동)
- 베이트 텔·고정타격 레퍼런스 2건(오전·오후와 분리)

### 에셋·자료
- ✅ [고정형 유도 불꽃 v1](assets/aim-lock-bait-fire-v1.png)
- ✅ [프로그래머 스펙](refs/aim-lock-bait-fire-v1.md) (비주얼/크롭 섹션 추가)
- ✅ [저녁 레퍼런스](research/refs-20260923-evening.md)

## 2026-09-23 오후 — 피격 플래시·공 그림자·VFX 4레인

### 개선
- Perfect/Good 시 **희동이 수신 측** 화이트 플래시 + 미세 리코일 — 인게임 반영
- 공 **그림자 크기·오프셋**으로 접근 깊이 큐(불꽃 착지 오벌 아래 페이드) — 인게임 반영
- VFX **4레인 가독성**(위협 텔 vs 임팩트 충돌 클램프·분위기 레인 토글) — 인게임 반영

### 에셋·자료
- ✅ [희동이 피격 플래시·리코일 v1](assets/heedong-hit-flash-recoil-v1.png)
- ✅ [공 그림자 깊이 큐 v1](assets/ball-shadow-depth-cue-v1.png)
- ✅ [VFX 4레인 가독성 v1](assets/vfx-4lane-readability-v1.png)
- ✅ [프로그래머 스펙](refs/heedong-hit-flash-recoil-v1.md) · [그림자](refs/ball-shadow-depth-cue-v1.md) · [4레인](refs/vfx-4lane-readability-v1.md)
- ✅ [오후 레퍼런스](research/refs-20260923-pm.md) · [아이디어 배치](research/ideas-batch-20260923-pm.md)

## 2026-09-23 오전 — 토스트 모션·티핑·juice

### 개선
- 첫 불꽃 코칭 토스트의 **idle→pop→hold→fade** 4프레임 가로 시트(연출만, 판정 불변)
- 토스트 스프링 enter/overshoot settle 레퍼런스 2건
- 투구 **몸짓 티핑**·Perfect **Trauma² 캠 펀치** 시안 → 인게임 반영
- 스윙 **스미어·팔로우스루**, Miss/Good/Perfect **juice 예산**, settle·idle fidget — 인게임 반영

### 에셋·자료
- ✅ [첫 불꽃 토스트 모션 시트 v1](assets/first-fire-toast-motion-sheet-v1.png)
- ✅ [투구 티핑 포즈 v1](assets/pitch-tipping-poses-v1.png)
- ✅ [Perfect Trauma² 캠 펀치 v1](assets/perfect-trauma-cam-punch-v1.png)
- ✅ [스윙 스미어·팔로우스루 v1](assets/swing-smear-followthrough-v1.png)
- ✅ [히트 juice 예산 v1](assets/hit-juice-budget-v1.png)
- ✅ [피치 settle·idle fidget v1](assets/pitch-settle-idle-fidget-v1.png)
- ✅ [프로그래머 스펙](refs/first-fire-toast-motion-sheet-v1.md) · [티핑](refs/pitch-tipping-poses-v1.md) · [캠](refs/perfect-trauma-cam-punch-v1.md)
- ✅ [오전 레퍼런스](research/refs-20260923-am.md) · [오전 아이디어](research/ideas-batch-20260923-am.md) · [사전 juice](research/ideas-batch-20260923-pm-juice-earlier.md)

## 2026-09-22 저녁 — 손가락 위 가이드·칭호 토스트 반영

### 개선
- 드래그 중 **접점 링·궤도**를 손가락 위에 표시(판정 불변, 비주얼만) — 인게임 반영
- 클리어 시 **칭호 해금 토스트**를 결과 CTA 위에 표시 — 인게임 반영
- 오후 아이디어 배치: Soft Heat · BeatWarping 필 · 페이크아웃 투구쌍 (Director 검토용)

### 에셋·자료
- ✅ [손가락 위 판정·궤도 가이드 v1](screens/above-finger-guide-v1.png)
- ✅ [프로그래머 스펙](refs/above-finger-guide-v1.md)
- ✅ [오후 아이디어 배치](research/ideas-batch-20260922-pm.md)
- ✅ [페이크아웃 투구쌍 v1](assets/fakeout-pitch-pair-v1.png)
- ✅ [BeatWarp 임팩트 v1](assets/beatwarp-impact-v1.png)

## 2026-09-22 오후 — 첫 불꽃 등장 카피 토스트

### 개선
- 첫 해저드(불꽃) 임박 시 **1회성 코칭 토스트** 시안(카피만, 규칙 변경 없음)
- 컨텍스트 FTUE 힌트·논블로킹 토스트 모션 레퍼런스(오전 juice/telegraph와 분리)

### 에셋·자료
- ✅ [첫 불꽃 등장 카피 토스트 v1](assets/first-fire-intro-toast-v1.png)
- ✅ [프로그래머 스펙](refs/first-fire-intro-toast-v1.md)
- ✅ [오후 레퍼런스](research/refs-20260922-pm.md)

## 2026-09-22 — juice sync·칭호 해금 토스트

### 개선
- Perfect 트레일 + hitstop juice **동시 spawn 프레임** 동기화 레퍼런스 정리(판정 변경 없음)
- 클리어 시 칭호 해금 토스트 연출 시안(결과 CTA 위)

### 에셋·자료
- ✅ [칭호 해금 토스트 v1](assets/title-unlock-toast-v1.png)
- ✅ [프로그래머 스펙](refs/title-unlock-toast-v1.md)
- ✅ [오전 레퍼런스](research/refs-20260922-am.md)

## 2026-09-21 — hitstop·취약창·고스트 배트

### 개선
- Perfect hitstop + 터치 레이턴시 보정
- 불꽃 회피 후 취약창×1.2 Perfect (금흰 글로우 매칭)
- hold-lock용 고스트 배트 실루엣

### 에셋·자료
- ✅ [hitstop 티어 juice](assets/hitstop-tier-juice-v1.png)
- ✅ [취약창 글로우](assets/vulnerable-window-glow-v1.png)
- ✅ [고스트 배트 실루엣](assets/ghost-bat-silhouette-v1.png)
- ✅ [오전 레퍼런스](research/refs-20260921-am.md)
- ✅ [오후 레퍼런스](research/refs-20260921-pm.md)

## 2026-09-15 — 아이디어 배치 몰입·FTUE·보스 페이즈

### 개선
- 30초 스윙 FTUE 히트존 가이드 · 페일라인 리뷰 카드
- 피치 래더 SFX · 보스 페이즈 HP 청크/배너 · 이닝스톱 CTA
- 친구 응원 FX · 텔레그래프 셰이프 랭귀지 · hold-lock 옵션 · 이지 실루엣

### 에셋·자료
- ✅ [FTUE 히트존](screens/ftue-hitzone-guide-v1.png)
- ✅ [FTUE 드래그·릴리즈](screens/ftue-swing-drag-release-v1.png)
- ✅ [페일라인 카드](screens/fail-line-card-v1.png)
- ✅ [이닝스톱 CTA](screens/inning-stop-cta-v1.png)
- ✅ [플레이 HUD 폴리시](screens/play-hud-polish-v1.png)
- ✅ [결과 승리·공유 시안](screens/result-victory-v1.png) · [공유 카드](screens/result-share-card-v1.png)
- ✅ [페이즈 HP 청크](assets/phase-hp-chunks-v1.png) · [보스 배너](assets/boss-phase-banner-v1.png)
- ✅ [친구 응원](assets/friend-cheer-fx-v1.png) · [텔레그래프 셰이프](assets/telegraph-shape-lang-v1.png)
- ✅ [hold-lock](assets/hold-lock-aim-v1.png) · [이지 실루엣](assets/easy-pitch-silhouette-v1.png)
- ✅ [페일 리뷰 칩](assets/fail-review-chip-v1.png) · [near-miss](assets/near-miss-flash-v1.png)
- ✅ [아이디어 배치 리서치](research/ideas-batch-20260915.md)

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
9c611e2 feat: add ghost bat silhouette for hold-lock
52f8c43 ui: match vulnerable glow to gold-white design v1
b559660 feat: fire dodge opens vulnerable window
d04024a feat: perfect hitstop and touch latency compensate
dbf3e17 feat: draw easy pitch silhouette when option on
685d0e6 feat: add optional hold-lock aim assist
79a0a49 feat: add telegraph shape language for windups
a2b39c7 feat: add local friend cheer FX on perfect
feb1961 feat: add inning-stop soft exit CTA
ac61996 feat: add boss phase HP chunks and banner
9f562aa feat: add procedural pitch-ladder SFX
7f037b9 feat: add fail-line review card on result
05e5f87 feat: add 30s swing FTUE hit-zone guide
```

_자동 갱신 2026-09-23. Director가 일자별로 갱신._
