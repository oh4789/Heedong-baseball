# 「희동이를 이겨라」 일자별 개선·에셋 일기

한눈에 보기: [디자인 갤러리](index.html) · 미러 https://oh4789.github.io/Heedong-baseball/ · 전체 개발로그 `/workspace/game-development-log.md`


## 2026-10-01 — 연타 배율 칩 모션 · 보스 웨어·마일스톤 리서치

### 개선
- **연타 배율 칩 모션** 선적(`171887c`): Perfect/Good 연타 pop→settle · ×≥4 코랄 림 · Miss/피격/pass 시 ×1 뮤트+shake · reduce-motion 스냅 — QA **PASS**(engine 불변)
- AM 리서치: 희동이 마운드 idle 강도 에스컬레이트 · 패배「한 호흡」인비트윈 · 릴리즈 스윙 시작 배트 후시(SFX) — 시안 PNG 없음
- PM 리서치: HP 연동 피격 웨어 · 패배 페이즈 마일스톤 래더 · 윈드업 글러브 가죽 크릭(SFX) — 시안 PNG 없음
- 디자인 AM/저녁: VFX 신규 시안 정지 유지(Perfect impact 큐 선적 전) — 레퍼런스만
- **HARD 준수:** 월드 시프트·보드/플로드라이트·관중 치어·PB 델타·「바꿀 한 수」·한 호흡·idle 강도 재제안 금지(AM TOP는 이미 HARD화)

### 에셋·자료
- ✅ [연타 배율 칩 모션](assets/combo-mult-chip-motion-v1.png) · [스펙](refs/combo-mult-chip-motion-v1.md) · [QA 증거](evidence/combo-mult-chip-motion/REPORT.md)
- ✅ [AM 아이디어](research/ideas-batch-20261001-am.md) · [PM 아이디어](research/ideas-batch-20261001-pm.md)
- ✅ [AM/디자인/PM/저녁 레퍼](research/refs-20261001-am.md) · [design-am](research/refs-20261001-design-am.md) · [pm](research/refs-20261001-pm.md) · [evening](research/refs-20261001-design-evening.md)

### 비고
- 칩 모션은 HUD만. 판정·점수·engine 불변.
- 오늘 리서치는 시안 없이 Director 검토용. Perfect impact 선적 전 VFX PNG 정지 유지.

## 2026-09-30 — 패배 개인 베스트 델타 · 리트라이/사운드 리서치

### 개선
- AM TOP② **패배 개인 베스트 델타** 시안: 잔여 HP 히어로 아래 보조 1줄(`개인 최고까지 ΔN%p` / `신기록!…`) — 히어로·CTA 불변
- PM 리서치: 관중 빌보드 치어 스파이크 · 「바꿀 한 수」전략 프롬프트 · 불꽃 회피 성공 처프(SFX) — 시안 PNG 없음
- 부모 스펙에 「바꿀 한 수」카피 풀 5문장 참고 추가(스토리 카피 확정 · 프로그래머 큐 아님)
- 저녁: VFX 신규 시안 정지 유지(Perfect impact 선적 전) — 레퍼런스만
- **HARD 준수:** soft continue·EARLY/LATE·월드 시프트/보드·플로드라이트·비행 라이저 재제안 금지

### 에셋·자료
- ✅ [패배 PB 델타 v1](assets/defeat-pb-delta-line-v1.png)
- ✅ [프로그래머 스펙](refs/defeat-pb-delta-line-v1.md) · [히어로 스펙 갱신](refs/defeat-near-win-hp-hero-v1.md)
- ✅ [AM 아이디어](research/ideas-batch-20260930-am.md) · [PM 아이디어](research/ideas-batch-20260930-pm.md)
- ✅ [AM/디자인/PM/저녁 레퍼](research/refs-20260930-am.md) · [design-am](research/refs-20260930-design-am.md) · [pm](research/refs-20260930-pm.md) · [evening](research/refs-20260930-evening.md)

### 비고
- PB 델타 시안·스펙만. 판정·점수·engine 불변. Perfect impact 큐 이후 구현 대기.
- 히어로(절대 XX%)와 직교(역대 최저 잔여 HP% 비교 채널).

## 2026-09-29 오전 — Perfect FOV 줌 펀치

### 개선
- AM TOP① **Perfect FOV 줌 펀치** 시안: 렌즈 FOV / 2D ortho size / view-scale만(카메라 위치·회전 고정)
- IDLE→ZOOM-IN→HOLD→RETURN 4프레임 보드 + Perfect 풀(6–12%) / Good ½ or OFF / Miss OFF · reduce-motion OFF
- 외부 레퍼 2건(VionixStudio orthographicSize · Solana Garden FOV/ortho feel) — Feel/GJP/Saltmire와 다른 링크
- **HARD 준수:** Hold/Charge·Miss임펄스·CA·플로팅텍스트 미제작

### 에셋·자료
- ✅ [Perfect FOV 줌 펀치 v1](assets/perfect-fov-zoom-punch-v1.png)
- ✅ [프로그래머 스펙](refs/perfect-fov-zoom-punch-v1.md)
- ✅ [오전 디자인 레퍼런스](research/refs-20260929-design-am.md)
- 근거: [ideas-batch AM TOP①](research/ideas-batch-20260929-am.md)

### 비고
- 시안만(PIL 보드). 판정·점수·engine 불변. Director 구현 대기.
- Trauma/Miss임펄스/방향킥·DoF·CA·스쿼시와 직교(시야각/ortho 채널).

## 2026-09-29 오후 — 페이즈 월드 시프트 · 패배 잔여 HP 히어로

### 개선
- PM TOP① **보스 페이즈 월드 시프트**: 기존 HP 임계에서 구장 팔레트·희동이 실루엣 한 단 + 소형 칩「2회」/「FINAL」(HP청크·배너와 다른 채널)
- PM TOP② **패배 거의 이김 잔여 HP 히어로**: 결과 최상단 `희동이 HP 남은 XX%` · ≤15%「한 방이었다」 · 도전≥3 프라이드 1줄 · sticky「다시 승부」만
- **HARD 준수:** 페이즈 HP 청크·보스 배너 재도입 금지 · soft continue·EARLY/LATE·Perfect 스크린 juice 미제작
- 저녁 슬롯: VFX 신규 시안 일시 정지(Perfect impact 큐 선적 전) — 레퍼런스만, PNG 없음

### 에셋·자료
- ✅ [페이즈 월드 시프트 v1](assets/phase-world-shift-v1.png)
- ✅ [패배 잔여 HP 히어로 v1](assets/defeat-near-win-hp-hero-v1.png)
- ✅ [월드 시프트 스펙](refs/phase-world-shift-v1.md) · [HP 히어로 스펙](refs/defeat-near-win-hp-hero-v1.md)
- ✅ [오후 레퍼런스](research/refs-20260929-pm.md) · [저녁 레퍼런스](research/refs-20260929-evening.md)
- 근거: [ideas-batch PM](research/ideas-batch-20260929-pm.md)

### 비고
- 시안·스펙만. 판정·점수·engine·HP 임계값 불변. Director 구현 대기.
- FOV/스쿼시/먼지/임팩트프레임과 직교(월드·결과 레이아웃 채널).

## 2026-09-28 저녁 — 접촉 스쿼시·스트레치 펀치

### 개선
- PM 러너업 **배트/공 스쿼시·스케일 스프링 펀치**를 저녁 시안으로 실행: 오브젝트 scale만(카메라 아님)
- IDLE→SQUASH→STRETCH→SETTLE 4프레임 보드 + Perfect 풀/Good≈0.55×/Miss OFF · reduce-motion 주석
- 외부 레퍼 2건(Josh Comeau squash-and-stretch · Feel MMF_SquashAndStretchSpring) — AM/midday/pm과 다른 링크
- **HARD 준수:** Hold/Charge·Miss 임펄스·크로매틱 수차·접촉 플로팅 텍스트 미제작

### 에셋·자료
- ✅ [접촉 스쿼시·스트레치 펀치 v1](assets/bat-ball-squash-punch-v1.png)
- ✅ [프로그래머 스펙](refs/bat-ball-squash-punch-v1.md)
- ✅ [저녁 레퍼런스](research/refs-20260928-evening.md)
- 근거: [ideas-batch PM 러너업](research/ideas-batch-20260928-pm.md)

### 비고
- 시안만(PIL 보드). 판정·점수·engine 불변. Director 구현 대기.
- 임팩트 프레임·트레일·DoF·마운드 먼지·카메라 트라우마와 직교(오브젝트 scale 채널).


## 2026-09-28 오후 — 마운드·플레이트 환경 먼지

### 개선
- PM TOP2 **마운드 릴리즈·플레이트 도착 먼지**: 세계 잔향만(결과·구종 무관, 타이밍 힌트 금지)
- 고정 테이블 입자·낮은 α · 배트 접촉 더스트와 슬롯 분리
- 외부 레퍼(Swink environmental response · MoCap foot-notify dust) — AM/midday와 다른 링크
- **HARD 준수:** Perfect 크로매틱 수차·접촉 플로팅 텍스트 미제작

### 에셋·자료
- ✅ [마운드·플레이트 먼지 v1](assets/mound-plate-dust-v1.png)
- ✅ [프로그래머 스펙](refs/mound-plate-dust-v1.md)
- ✅ [오후 레퍼런스](research/refs-20260928-pm.md)
- 근거: [ideas-batch PM](research/ideas-batch-20260928-pm.md)

### 비고
- 시안만. 판정·점수·engine 불변. Director 구현 대기.
- 트레일·임팩트 프레임·DoF·스쿼시와 직교(환경 레이어).

## 2026-09-28 한낮 — 릴리즈·존 집중 DoF

### 개선
- AM 러너업 **Hitting Depth of Field**를 한낮 시안으로 실행: 접근 중만 소프트 배경 블러 → 릴리즈·공·존 집중
- OFF(평탄)·ON(블러) 2패널 보드 + 블러 강도·적용 구간·reduce-motion/GPU 주석
- 외부 레퍼 2건(U4N The Show 26 DoF · Unity 2D 배경 블러 가독) — AM Showzone/OS와 다른 링크
- **HARD 준수:** 불꽃 Hold/Charge·Miss 방향 임펄스 미제작

### 에셋·자료
- ✅ [릴리즈·존 집중 DoF v1](assets/pitch-release-dof-focus-v1.png)
- ✅ [프로그래머 스펙](refs/pitch-release-dof-focus-v1.md)
- ✅ [한낮 레퍼런스](research/refs-20260928-midday.md)
- 근거: [ideas-batch AM 러너업](research/ideas-batch-20260928-am.md)

### 비고
- 시안만(PIL 보드). 판정·점수·engine 불변. Director 구현 대기.
- AM TOP1 트레일·TOP2 임팩트 프레임과 직교(카메라/배경 채널).

## 2026-09-28 오전 — 공 트레일·Perfect 임팩트 프레임

### 개선
- AM TOP1 **공 비행 트레일 잔광**: 과거 위치 짧은 페이드(일반 크림 / 불꽃 오렌지, Perfect 금빛과 시간 겹침 0)
- AM TOP2 **Perfect 전용 임팩트 프레임**: 접촉점 원형 흑백·잉크 1컷(16–40ms), 히트스톱·카메라 불변
- 보조 텍스처 `perfect-impact-ink-lines-v1` · 외부 레퍼(Flukz trail · Lush impact frames 등)
- **HARD 준수:** 불꽃 Hold/Charge 정지 텔 미제작

### 에셋·자료
- ✅ [공 비행 트레일 v1](assets/ball-flight-trail-v1.png)
- ✅ [Perfect 임팩트 프레임 v1](assets/perfect-impact-frame-v1.png)
- ✅ [잉크 속도선 텍스처](assets/perfect-impact-ink-lines-v1.png)
- ✅ [트레일 스펙](refs/ball-flight-trail-v1.md) · [임팩트 스펙](refs/perfect-impact-frame-v1.md)
- ✅ [오전 레퍼런스](research/refs-20260928-am.md)
- 근거: [ideas-batch AM](research/ideas-batch-20260928-am.md)

### 비고
- 시안·스펙만. 판정·점수·engine 불변. Director 구현 대기.
- 한낮 DoF·저녁 스쿼시·오후 먼지와 직교(비행 잔광 / 화면 스타일 채널).

## 2026-09-24 저녁 — 연타 배율 칩 모션(pop/settle/reset)

### 개선
- 정적 `combo-mult-chip-v1`의 **증가 pop · hot settle · 리셋 shake** 모션 시트(판정·배율 공식 불변)
- 외부 레퍼 2건(SEELE clicker UI scale pop · UI Juice Scale Punch/Reduce Motion) — 오늘 am/midday/pm과 다른 링크
- Miss 방향 임펄스·불꽃/시임/휘즈와 직교(HUD 채널)

### 에셋·자료
- ✅ [연타 배율 칩 모션 v1](assets/combo-mult-chip-motion-v1.png)
- ✅ [프로그래머 스펙](refs/combo-mult-chip-motion-v1.md)
- ✅ [저녁 레퍼런스](research/refs-20260924-evening.md)

### 비고
- 시안만. Director 구현 대기. 정적 원본 `combo-mult-chip-v1` 유지.

## 2026-09-24 한낮 — 공기 휘즈 패스바이(Doppler sync)

### 개선
- Director AM TOP2: 니어미스·불꽃 회피 **공기 휘즈**의 **시각 동기 모션 시트**(approach→closest→pass→settle, 80–150ms)
- 불꽃 회피 강(~120ms) vs 일반 아슬아슬 약(~85ms) · Doppler 피치↑↓ 주석 · near-miss-flash/스침/회피 juice와 **분리**
- 외부 레퍼 2건(Dodge This pass-by · Wwise Doppler RTPC) — AM CRI/cogconnected와 다른 링크

### 에셋·자료
- ✅ [공기 휘즈 패스바이 v1](assets/air-whizz-passby-v1.png)
- ✅ [프로그래머 스펙](refs/air-whizz-passby-v1.md)
- ✅ [한낮 레퍼런스](research/refs-20260924-midday.md)
- 근거: [ideas-batch AM TOP2](research/ideas-batch-20260924-am.md)

### 비고
- 판정·점수·코드 변경 없음(시안만). AM TOP1 시임·TOP3 눈빛은 이미 완료.

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
5bb8222 ui: fire dodge afterimage
5d9dff3 ui: fire heat haze halo
db91d92 ui: air whizz passby streak sync
9ec41bf ui: near-miss dodge doppler whizz
98db028 ui: heedong fire eye tell
3fa447d ui: ball seam spin pitch tell
8104a49 docs: refresh design diary for 9/23 polish
1ffbc01 ui: aim-lock bait fire visual polish
36f2bdc ui: vfx mood lane toggle
5a91e94 ui: vfx lane clash clamp fire tel and toast
1e5c74c ui: fade ball shadow under fire land oval
5b601fb ui: ball shadow depth approach cue
750dee9 ui: heedong hit flash and micro recoil
f3f50e8 ui: first-fire toast motion sheet pop hold fade
```

_자동 갱신 2026-09-28. Director가 일자별로 갱신._
