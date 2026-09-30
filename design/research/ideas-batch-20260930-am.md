# 2026-09-30 AM 외부 아이디어

- **NO_NEW=false**
- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — 구장 스코어보드·플로드라이트 마이크로 비트 · 개인 베스트 델타 · 불꽃 비행 예감 라이저(SFX) 3개. **축:** 진행감 / 리트라이 동기 / 사운드. Perfect 히트 스크린 juice·타이밍 방향 힌트 **전면 금지**.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, 글러브 티핑, Trauma 카메라, VFX 4레인, 공 캐스트 그림자, 피격플래시+리코일, 시임/스핀 텔, Doppler 니어미스 whizz, 불꽃 직전 눈빛 텔, 열왜곡, 회피 애프터이미지, Miss 방향 카메라 임펄스, 방향성 임팩트 카메라 킥, 크라우드 RTPC, 주변시 엣지 밝기 펄스, 스윙 스미어+팔로우스루, Miss/Good/Perfect juice 예산표, settle+idle fidget, WANDR 가림, Bullet Dance aim-lock, Flukz 패턴 리믹스, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 히트스톱, 모양언어, 색만 구종 ID, EARLY/LATE 라벨·타이밍 방향 힌트, 약점글로우, 뮤직 스템[제안], 이점/약점 모디[제안], 비가시 타이밍창 DDA[제안], Nine Sols 부정확패리, mushy contact, Takamido 전신 텔, Witch Time 회피, 배트 킥백+접촉 더스트/스파크, 공 비행 트레일 잔상, Perfect 임팩트 프레임(1–2컷), 불꽃 Hold/Charge, Hitting DoF/릴리즈 존 DoF, Perfect 크로매틱 수차 펀치, 마운드/플레이트 환경 먼지, 접촉점 등급 플로팅 텍스트(Perfect/Good), 배트/공 스쿼시·스트레치 스프링 펀치, Perfect FOV 줌 펀치, Perfect 비네트 펄스, 배트/공 머티리얼 화이트 플래시, 확장 충격파 링(A), soft→hard 릴리즈 포커스 앵커(B), 스쿼시 쇼트리스트(C), Color Grade 골든 틴트, bloom 스파이크, 캐처 미트 스냅, 만화 방사 스피드라인. **추가 재제안 금지(기존 시안·HARD):** 페이즈 HP 청크·보스 페이즈 배너, 이닝스톱 CTA, 페일라인/페일 리뷰 칩, 피치 래더 SFX, 승리 결과 카드 골격, 패배「불꽃N·PERFECTN·MissN」한줄 요약 그 자체, 1탭 재도전·희동이 도발(이미 적용), 칭호·연승·스탬프·친구응원·고스트배트·FTUE, 구수 X/Y 카운터, 베스트 런 데미지 커브 고스트(러너업). **9/29 PM TOP→HARD:** 보스 페이즈 월드 시프트(구장 팔레트·희동이 실루엣·소형 페이즈 칩), 패배 거의 이김 잔여 HP 히어로(+도전 프라이드), 페이즈 BGM 인텐시티 스냅샷+실패 earned silence.
- **코드·밸런스·스토리:** 미수정. 본 문서만. 유료·코어 규칙 변경 = **[제안]** 만.

---

## TOP

### ① 구장 **스코어보드·플로드라이트** 마이크로 비트(페이즈 전환)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://www.avinteractive.com/markets-news/sports-and-arenas/skandal-makes-stadium-tech-responsive-to-on-pitch-play-25-11-2025/ (2025-11: 경기 이벤트→라이팅·미디어 파사드·디지털 서피스 실시간 반응) · https://sfxengine.com/blog/sound-effects-for-baseball-games (2026-03: 빈티지 스코어보드 beep/click을 구장 부수 사운드로) · https://gamedesignskills.com/game-design/game-boss-design/ (페이즈 전환에 **명확한 지표**; 환경·아레나 단서를 저비용 에스컬레이션으로) |
| ② 한줄 요약 | 페이즈 임계를 넘을 때 **스코어보드 이닝 숫자 플립 + 플로드라이트 1박 점멸**(선택: 짧은 보드 beep)로 ‘회가 바뀌었다’를 다이에게틱 프롭만으로 읽힌다 — 팔레트 월드 시프트·HP청크·배너 없이. |
| ③ 왜 희동이 게임에 맞는지 | HARD **페이즈 월드 시프트**(하늘/흙 틴트·실루엣·소형 UI 칩)와 **다른 채널**(구장 프롭·조명·보드). HP청크·배너 HARD와도 직교. Perfect juice·타이밍 힌트와 무관 — **페이즈 임계**만. 판정·점수 불변. |
| ④ TOP 적용안 | (1) 기존 페이즈 경계 통과 시: 배경 스코어보드(또는 상단 LED 스트립) 이닝 숫자 `1→2`/`2→FINAL` 0.4–0.8s 플립. (2) 동시에 마스트/코너 플로드라이트 스프라이트 opacity 또는 emissive를 **1회** 밝았다 복귀(총 300–500ms). (3) 선택: UI가 아닌 **보드 beep 1샷**(피치 래더·등급 SFX와 슬롯 분리). (4) 월드 팔레트·희동이 실루엣·소형「2회」칩은 재도입하지 않음(이미 PM HARD). Perfect 스크린 juice 끼워 넣지 않음. |
| 판정/규칙 변경 | **없음** (구장 프롭·조명·선택 SFX만). |

---

### ② 패배 **개인 베스트 델타**(최고 기록 대비)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://www.gamedeveloper.com/design/staying-power-rethinking-feedback-to-keep-players-in-the-game (Phillips/MGS: TF2 사망 피드백 — “came close to your record…”, 개인 최고와 비교가 재도전 동기) · https://www.bloodmooninteractive.com/articles/designing-around-player-failure.html (Motivation Response: “You got closer this time! You're improving with each attempt.”) · https://www.joyplayx.com/article/how-to-handle-failure-in-games-designing-death-and-retry-loops (실패→즉시 재도전 루프; 진행감이 남는 패배) |
| ② 한줄 요약 | 패배 화면에 **이번 런 vs 개인 최고**(잔여 HP% 또는 누적 데미지) 한 줄 델타를 붙여 ‘기록에 가까워졌다/신기록’을 각인 — 이번 판 절대 잔여 HP 히어로·EARLY/LATE와 슬롯 분리. |
| ③ 왜 희동이 게임에 맞는지 | HARD **거의 이김 잔여 HP 히어로**(이번 판 절대 XX%)와 **다른 축**(세션/역대 최고와의 비교). soft continue·페일 리뷰 칩·연승 HARD와 직교 — CTA는 기존 1탭「다시 승부」만. 타이밍 방향 힌트 금지. |
| ④ TOP 적용안 | (1) 히어로(잔여 HP) **아래** 보조 1줄: `개인 최고까지 ΔN%p`(이번 잔여 > 최고 잔여일 때) 또는 `신기록! 희동이 HP XX%(이전 YY%)`. (2) 첫 도전·비교 데이터 없으면 줄 숨김. (3) 수치 보상·연승 배지·칭호 토스트 재도입 금지. (4) EARLY/LATE·soft continue·유료 이어하기 금지. sticky「다시 승부」만. |
| 판정/규칙 변경 | **없음** (결과 카피·비교 표시만. 점수식·판정창 불변). |

---

### ③ 불꽃 투구 **비행 예감 라이저**(SFX, VO 텔 아님)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://duendesounds.com/creating-tension-with-sound-effects/ (drone→**riser** 3–6s→impact→짧은 릴리즈; heartbeat/stinger와 역할 분리) · https://sfxengine.com/blog/sound-effects-for-baseball-games (2026-03: 패스트볼 whoosh를 임팩트 전 **라이저**로 쓰는 레이어링; 드라이 임팩트와 분리) · https://sonalsystem.com/blogs/frequencies/stingers-stems-and-the-machinery-behind-an-adaptive-score (2026-07: 원샷 이벤트 큐 vs 스템 — 짧은 어택·잔향 짧게) |
| ② 한줄 요약 | **이미 불꽃으로 식별된** 투구의 비행 구간만 짧은 SFX 라이저(피치↑·볼륨↑)를 올려 회피 긴장을 만들고, 플레이트 도착/회피 성공에서 끊는다 — BGM 스냅샷·스템·불꽃 VO 텔 아님. |
| ③ 왜 희동이 게임에 맞는지 | HARD **페이즈 BGM 인텐시티 스냅샷+silence**·**뮤직 스템[제안]**·**크라우드 RTPC**·**불꽃 VO/오디오 텔**(구종 사전 고지)과 **다른 슬롯**(식별 후 비행 중 SFX 레이어). 피치 래더(등급별 타격음)와도 분리 — 등급 pitch 사다리 없음. 판정창 불변. |
| ④ TOP 적용안 | (1) 불꽃 투구가 비주얼로 확정된 뒤→플레이트 도착 직전 **0.6–1.2s** SFX riser(신스/에어 whoosh, 키는 BGM과 충돌 적게). (2) 회피 성공·도착·Miss 확정 시 즉시 stop(또는 40ms fade). (3) 일반 투구=OFF. 릴리즈 **전**·글러브 티핑·눈빛·VO로 다음 구종을 미리 알리지 않음(불꽃 텔 HARD 유지). (4) BGM gain/filter 스냅샷·스템 mute·크라우드 RTPC 재도입 금지. 뮤트·reduce-audio 옵션 존중. |
| 판정/규칙 변경 | **없음** (비행 중 SFX 레이어만). |

---

## 제외/확장만

| 아이디어 | 처리 | 이유 |
|---|---|---|
| 페이즈 월드 시프트·잔여 HP 히어로·BGM 스냅샷+silence | HARD(9/29 PM) | 재제안 금지. ①②③은 각각 프롭·PB비교·비행 SFX로 슬롯 분리. |
| 페이즈 진입 뮤지컬 스팅어(연속 BGM 위 1샷) | 러너업 | SonalSystem·Pete Frogs 유효하나 PM③ FINAL 스팅어 옵션과 경계 → 불꽃 라이저 우선. |
| 플레이어 저HP 심박 베드 | 러너업 | Duende/Hove — 구조는 새로우나 모바일에서 피로·접근성 이슈 → 라이저 우선. |
| 접촉 머티리얼 레이어(나무+바디, 등급 pitch 없이) | 러너업 | SFX Engine 레이어링 — 피치 래더 HARD와 구분되나 타격 juice 슬롯과 근접. |
| FINAL 도달 프라이드 배지 | 러너업 | ② PB 델타와 비슷한 감정 슬롯 — 델타 우선. |
| 세션 개선 스파크라인 | 스킵 | 구현·가독 부담, 모바일 결과 패널 과다. |
| 페일 리뷰·soft continue·피치 래더·크라우드 RTPC·스템 | HARD | 재제안 금지. |

---

## Director용 한줄 요약

**AM TOP(판정불변·진행/리트라이/사운드):** ①구장 스코어보드·플로드라이트 마이크로 비트(월드 시프트·HP청크·배너 금지) → ②개인 베스트 델타(잔여 HP 히어로와 슬롯 분리, soft continue·EARLY/LATE 금지) → ③불꽃 비행 예감 라이저 SFX(스냅샷·스템·VO 텔·피치 래더 아님).

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-30 10:20 KST AM 루틴
