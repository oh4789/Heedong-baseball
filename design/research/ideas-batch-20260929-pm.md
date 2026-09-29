# 2026-09-29 PM 외부 아이디어

- **NO_NEW=false**
- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — 페이즈 월드 시프트 · 거의 이김 잔여 HP 결과 · 페이즈 BGM 인텐시티(+실패 silence) 3개. **축:** 진행감 / 리트라이 동기 / 사운드. Perfect 히트 스크린 juice·타이밍 방향 힌트 **전면 금지**.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, 글러브 티핑, Trauma 카메라, VFX 4레인, 공 캐스트 그림자, 피격플래시+리코일, 시임/스핀 텔, Doppler 니어미스 whizz, 불꽃 직전 눈빛 텔, 열왜곡, 회피 애프터이미지, Miss 방향 카메라 임펄스, 방향성 임팩트 카메라 킥, 크라우드 RTPC, 주변시 엣지 밝기 펄스, 스윙 스미어+팔로우스루, Miss/Good/Perfect juice 예산표, settle+idle fidget, WANDR 가림, Bullet Dance aim-lock, Flukz 패턴 리믹스, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 히트스톱, 모양언어, 색만 구종 ID, EARLY/LATE 라벨·타이밍 방향 힌트, 약점글로우, 뮤직 스템[제안], 이점/약점 모디[제안], 비가시 타이밍창 DDA[제안], Nine Sols 부정확패리, mushy contact, Takamido 전신 텔, Witch Time 회피, 배트 킥백+접촉 더스트/스파크, 공 비행 트레일 잔상, Perfect 임팩트 프레임(1–2컷), 불꽃 Hold/Charge, Hitting DoF/릴리즈 존 DoF, Perfect 크로매틱 수차 펀치, 마운드/플레이트 환경 먼지, 접촉점 등급 플로팅 텍스트(Perfect/Good), 배트/공 스쿼시·스트레치 스프링 펀치, Perfect FOV 줌 펀치, Perfect 비네트 펄스, 배트/공 머티리얼 화이트 플래시, 확장 충격파 링(A), soft→hard 릴리즈 포커스 앵커(B), 스쿼시 쇼트리스트(C), Color Grade 골든 틴트, bloom 스파이크, 캐처 미트 스냅, 만화 방사 스피드라인. **추가 재제안 금지(기존 시안·HARD):** 페이즈 HP 청크·보스 페이즈 배너, 이닝스톱 CTA, 페일라인/페일 리뷰 칩, 피치 래더 SFX, 승리 결과 카드 골격, 패배「불꽃N·PERFECTN·MissN」한줄 요약 그 자체, 1탭 재도전·희동이 도발(이미 적용), 칭호·연승·스탬프·친구응원·고스트배트·FTUE.
- **코드·밸런스·스토리:** 미수정. 본 문서만. 유료·코어 규칙 변경 = **[제안]** 만.

---

## TOP

### ① 보스 페이즈 **월드 시프트**(구장 팔레트 · 희동이 실루엣 · 소형 페이즈 칩)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://choostgames.com/blog/what-makes-a-good-boss-fight/ (2026-04: 페이즈=절→후렴→브릿지 리듬, Isshin·Cuphead식 에스컬레이션) · https://asidehouse.com/respawn/cuphead-the-run-and-gun-that-looks-like-a-1930s-cartoon/ (2026-07/09: 페이즈가 개그 에스컬레이션·세계 변화로 읽힘, 템포 시프트가 전환 텔) · http://huygamer.blogspot.com/2025/10/part-5-progress-status-ui-measuring.html (2025-10: 세그먼트 브레이크=“Phase 2 begins!” **내러티브 큐**, 바 색 블렌드로 드라마) |
| ② 한줄 요약 | HP 임계를 넘을 때 **구장 분위기·희동이 실루엣**이 한 단 바뀌고, 작은 “2회” 칩만 떠 **지금 페이즈가 바뀌었다**를 읽게 한다 — 배너·HP청크·Perfect juice 없이. |
| ③ 왜 희동이 게임에 맞는지 | HARD **페이즈 HP 청크·보스 배너**(기존 시안)와 **다른 채널**(다이에게틱 월드·실루엣). Perfect FOV/비네트/플래시/CA/먼지/임팩트프레임과도 직교 — 히트 순간이 아니라 **페이즈 임계**만. 판정·점수 불변. |
| ④ TOP 적용안 | (1) 임계 예: 잔여 HP ≈66%·33%(또는 기존 페이즈 경계) 통과 시 하늘/흙 틴트를 한 단 어둡게·채도↓, 희동이 실루엣 대비↑(또는 포즈 긴장) 300–600ms ease. (2) 상단 소형 칩 “2회”/“FINAL” 1회 팝 0.8–1.2s — Perfect/Good 등급 칩·칭호 토스트와 **문구·색 분리**. (3) HP바 세그먼트·풀폭 배너 재도입 금지. (4) 전환 순간에 Perfect 스크린 juice(CA·FOV·비네트·플래시) 끼워 넣지 않음. |
| 판정/규칙 변경 | **없음** (월드·실루엣·진행 UI만). |

---

### ② 패배 **거의 이김** 잔여 HP 히어로 + 도전 프라이드 카피

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://choostgames.com/blog/what-makes-a-good-boss-fight/ (“I almost had it”이면 설계 성공 / “unfair”면 수정) · https://www.vice.com/en/article/celeste-the-ultra-hard-platformer-that-also-wants-to-give-you-a-hug/ (Celeste: “Be proud of your death count… Keep going!”) · http://mkremins.github.io/blog/failure-margins-feedback-loops/ (killcam·구체적 실패 피드백이 재도전 루프를 닫음; soft continue와 별개) |
| ② 한줄 요약 | 패배 화면의 **히어로 숫자=희동이 남은 HP%**로 ‘거의 이겼다’를 각인하고, 도전 N회째엔 응원 카피 한 줄 — EARLY/LATE·soft continue 없이. |
| ③ 왜 희동이 게임에 맞는지 | 9/15 **「불꽃N·PERFECTN·MissN」요약**·페일 리뷰 칩(원인)과 **다른 슬롯**(거리-to-win 히어로). soft continue·이닝스톱 CTA HARD와 직교 — CTA는 기존 1탭「다시 승부」만. 타이밍 방향 힌트 금지. |
| ④ TOP 적용안 | (1) 패배 패널 최상단 큰 숫자: `희동이 HP 남은 XX%`(또는 하트/바 잔량 시각화 1개). XX≤15면 카피 “한 방이었다”. (2) 보조 한줄은 기존 학습 요약 유지 가능하되 **히어로 아래**. (3) 도전 횟수≥3이면 Celeste식 1줄(“배울수록 강하다 · N회째”) — 수치 보상·연승 배지 없음(연승 HARD). (4) soft continue·유료 이어하기 **금지**. sticky「다시 승부」만. |
| 판정/규칙 변경 | **없음** (결과 카피·레이아웃만. 점수식 불변). |

---

### ③ 보스 페이즈 **BGM 인텐시티 스냅샷** + 실패 **earned silence**

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://uhiyama-lab.com/en/notes/unity/unity-audio-mixer-dynamic-music/ (2026-07: Snapshot·Ducking·Crossfade — 동일 트랙 밸런스/필터 전환, 스템 mute와 다른 무기) · https://sgg-modding.github.io/Hades2ModWiki/docs/creating-mods/audio/adding-dynamic-music (Hades/H2: `Section`으로 페이즈 구간 전환 — multi-track stem mute와 **역할 분리** 명시) · https://substreammagazine.com/2026/09/why-sound-design-matters-more-than-players-realize/ (2026-09: **Silence is part of the design** — 연속 사운드 피로↓, 중요 순간 대비) · https://asidehouse.com/respawn/cuphead-the-run-and-gun-that-looks-like-a-1930s-cartoon/ (페이즈 전환에 템포/스코어 시프트가 2차 텔) |
| ② 한줄 요약 | 페이즈가 오르면 **믹서 스냅샷**(LPF·볼륨·선택적 트랙 크로스페이드)으로 긴장을 올리고, 패배 순간엔 BGM을 짧게 비워 결과 UI 클릭음이 들리게 한다 — **스템 레이어[제안] 아님**. |
| ③ 왜 희동이 게임에 맞는지 | HARD **뮤직 스템[제안]**·**크라우드 RTPC**·**불꽃 VO 텔**·피치 래더 SFX와 **다른 슬롯**(페이즈 상태→믹서 / 실패→silence→UI). 판정창·히트 등급 규칙 불변. 웹은 Web Audio gain/filter 또는 두 `<audio>` 크로스페이드로 동일 의도. |
| ④ TOP 적용안 | (1) Phase1=기본 스냅샷; Phase2=BGM +2~4dB 또는 LPF cutoff↑ / 드라이↑, TransitionTo ≈0.8–1.5s; Phase3(FINAL)=추가 +스팅어 1샷 또는 별도 루프 클립 **크로스페이드**(스템 mute/unmute 금지). (2) 패배 확정: BGM −12dB→near-silence **1–2s**(earned silence) → 결과 패널 등장 SFX →「다시 승부」확인 SFX. (3) 희동이 도발 VO가 있으면 Voice 버스로 BGM duck 3–6dB(불꽃 구종 텔 VO 재도입 금지). (4) 뮤트·reduce-audio 옵션 존중. |
| 판정/규칙 변경 | **없음** (믹스·큐만). 스템 풀레이어·행동반응형 스템은 계속 **[제안]** 보류. |

---

## 제외/확장만

| 아이디어 | 처리 | 이유 |
|---|---|---|
| 페이즈 HP 청크·보스 배너 | HARD/기존 시안 | `phase-hp-chunks-v1`·`boss-phase-banner-v1` — 재제안 금지. ①은 월드 시프트만. |
| 패배「불꽃N·PERFECTN·MissN」한줄 | 기존 9/15 | 골격 유지 가능·히어로는 잔여 HP로 **슬롯 분리**. |
| 페일라인/페일 리뷰 칩 | 기존 시안 | 원인 칩 재제안 금지. ②는 거리-to-win. |
| 피치 래더 SFX·juice 예산 SFX pitch | HARD/기존 | 등급별 타격음 사다리 재제안 금지. |
| 희동이 페이즈/패배 VO 구조 | 러너업 | 도발(적용)·불꽃 VO 텔(HARD)과 경계 — Director가 VO 예산 열면 ③ duck와 묶기. |
| 베스트 런 데미지 커브 고스트 | 러너업 | 고스트배트(FTUE)와 다름이나 구현·가독 부담 → 잔여 HP 우선. |
| 구수 X/Y 카운터 | 스킵 | 이닝스톱 CTA·진행 UI 과다. |
| 뮤직 스템 풀레이어 | HARD [제안] | ③은 스냅샷·섹션·silence만. |

---

## Director용 한줄 요약

**PM TOP(판정불변·진행/리트라이/사운드):** ①페이즈 월드 시프트(구장·실루엣·소형 칩, HP청크·배너 금지) → ②거의 이김 잔여 HP 히어로(+도전 프라이드, soft continue·EARLY/LATE 금지) → ③페이즈 BGM 인텐시티 스냅샷+실패 earned silence(스템[제안]·크라우드 RTPC 아님).

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-29 16:25 KST PM 루틴
