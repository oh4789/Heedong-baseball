# 2026-09-30 PM 외부 아이디어

- **NO_NEW=false**
- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — 관중 빌보드 치어 에너지 스파이크 · 재도전「바꿀 한 수」전략 프롬프트 · 불꽃 회피 성공 확인 처프(SFX) 3개. **축:** 진행감 / 리트라이 동기 / 사운드. Perfect 히트 스크린 juice·타이밍 방향 힌트 **전면 금지**.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, 글러브 티핑, Trauma 카메라, VFX 4레인, 공 캐스트 그림자, 피격플래시+리코일, 시임/스핀 텔, Doppler 니어미스 whizz, 불꽃 직전 눈빛 텔, 열왜곡, 회피 애프터이미지, Miss 방향 카메라 임펄스, 방향성 임팩트 카메라 킥, 크라우드 RTPC, 주변시 엣지 밝기 펄스, 스윙 스미어+팔로우스루, Miss/Good/Perfect juice 예산표, settle+idle fidget, WANDR 가림, Bullet Dance aim-lock, Flukz 패턴 리믹스, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 히트스톱, 모양언어, 색만 구종 ID, EARLY/LATE 라벨·타이밍 방향 힌트, 약점글로우, 뮤직 스템[제안], 이점/약점 모디[제안], 비가시 타이밍창 DDA[제안], Nine Sols 부정확패리, mushy contact, Takamido 전신 텔, Witch Time 회피, 배트 킥백+접촉 더스트/스파크, 공 비행 트레일 잔상, Perfect 임팩트 프레임(1–2컷), 불꽃 Hold/Charge, Hitting DoF/릴리즈 존 DoF, Perfect 크로매틱 수차 펀치, 마운드/플레이트 환경 먼지, 접촉점 등급 플로팅 텍스트(Perfect/Good), 배트/공 스쿼시·스트레치 스프링 펀치, Perfect FOV 줌 펀치, Perfect 비네트 펄스, 배트/공 머티리얼 화이트 플래시, 확장 충격파 링(A), soft→hard 릴리즈 포커스 앵커(B), 스쿼시 쇼트리스트(C), Color Grade 골든 틴트, bloom 스파이크, 캐처 미트 스냅, 만화 방사 스피드라인. **추가 재제안 금지(기존 시안·HARD):** 페이즈 HP 청크·보스 페이즈 배너, 이닝스톱 CTA, 페일라인/페일 리뷰 칩, 피치 래더 SFX, 승리 결과 카드 골격, 패배「불꽃N·PERFECTN·MissN」한줄 요약 그 자체, 1탭 재도전·희동이 도발(이미 적용), 칭호·연승·스탬프·친구응원·고스트배트·FTUE, 구수 X/Y 카운터, 베스트 런 데미지 커브 고스트(러너업). **9/29 PM TOP→HARD:** 보스 페이즈 월드 시프트(구장 팔레트·희동이 실루엣·소형 페이즈 칩), 패배 거의 이김 잔여 HP 히어로(+도전 프라이드), 페이즈 BGM 인텐시티 스냅샷+실패 earned silence. **9/30 AM TOP→HARD:** 구장 스코어보드·플로드라이트 마이크로 비트, 패배 개인 베스트 델타, 불꽃 비행 예감 라이저 SFX. **AM 러너업 1차 TOP 금지:** 페이즈 진입 뮤지컬 스팅어, 플레이어 저HP 심박 베드, 접촉 머티리얼 레이어, FINAL 도달 프라이드 배지, 세션 개선 스파크라인.
- **코드·밸런스·스토리:** 미수정. 본 문서만. 유료·코어 규칙 변경 = **[제안]** 만.

---

## TOP

### ① 관중 **빌보드 치어 에너지** 스파이크(페이즈 전환·비주얼만)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://github.com/0800tim/tournamental/blob/main/docs/27c-fidelity-phase3-stadium-crowd.md (2026-05: 인스턴스 관중 빌보드·`crowdEnergy` 스파이크 시 아틀라스 프레임레이트↑ 4s) · https://flukz.org/devlog/boss-fight-design-indie-shmup/ (2026-06: 페이즈 전환을 북키핑이 아닌 **신호·리스파이트 순간**으로) · https://winifredphillips.wpcomstaging.com/2025/04/06/gdc-2024-dial-up-the-diegetics-the-human-soundscape/ (GDC 2024→2025-04: 관중 반응을 경기/보스 순간에 묶는 다이에게틱 인간 사운드스케이프 — **비주얼 채널로만 차용**) |
| ② 한줄 요약 | 페이즈 임계에서 **스탠드 관중 스프라이트만** 짧은 치어/웨이브 에너지 스파이크(프레임 가속·기립 포즈 비중↑)로 ‘회가 바뀌었다’를 읽힌다 — 팔레트·보드·조명·크라우드 오디오 RTPC 없이. |
| ③ 왜 희동이 게임에 맞는지 | HARD **월드 시프트**(하늘/흙·실루엣·소형 칩)·**스코어보드·플로드라이트**·**크라우드 RTPC**(연속 오디오)·HP청크·배너와 **다른 채널**(관중 빌보드 애니만). Perfect juice·타이밍 힌트와 무관 — **페이즈 임계**만. 판정·점수 불변. |
| ④ TOP 적용안 | (1) 기존 페이즈 경계 통과 시: 배경 관중(또는 스탠드 실루엣 스트립) `crowdEnergy` 0→1을 2.5–4s 스파이크 — 애니 속도 1.5–2× 또는 기립 프레임 비중↑. (2) 동시에 팔레트·스코어보드 플립·플로드라이트·소형「2회」칩·HP청크·배너 재도입 금지. (3) 오디오 크라우드 루프/RTPC·BGM 스냅샷 끼워 넣지 않음(시각만). (4) 저사양: 관중 레이어 없을 땐 상단 스탠드 실루엣 opacity 펄스 1회로 폴백. Perfect 스크린 juice 금지. |
| 판정/규칙 변경 | **없음** (배경 관중 애니만). |

---

### ② 재도전 **「바꿀 한 수」** 전략 프롬프트(저스포일러)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://dotgg.gg/the-one-more-try-effect-why-instant-restarts-make-browser-games-so-replayable/ (2026-09: 실패→「무엇을 바꿀까」가설→즉시 재시도) · https://www.joyplayx.com/article/how-to-handle-failure-in-games-designing-death-and-retry-loops (2025-06: clear feedback·teachable moment; Celeste식 격려·빠른 재시작) · https://www.gamedeveloper.com/design/how-and-why-to-write-low-spoiler-hints-for-adventure-games- (저스포일러 힌트: 행동 범주만 제안, 해답 직접 명명 회피) |
| ② 한줄 요약 | 패배 화면에 **이번 판 원인 진단이 아닌** 다음 시도용 전략 한 줄(로테이션)을 붙여 ‘다음에 바꿀 한 수’를 남긴다 — 잔여 HP 히어로·PB 델타·페일 리뷰·EARLY/LATE와 슬롯 분리. |
| ③ 왜 희동이 게임에 맞는지 | HARD **거의 이김 잔여 HP**·**개인 베스트 델타**(수치 비교)·**페일라인/페일 리뷰 칩**(이번 실패 원인)·「불꽃N·PERFECTN·MissN」요약·soft continue와 **다른 축**(미래 지향 전략 카피). 타이밍 방향(early/late)·구종 사전 텔 금지. CTA는 기존 1탭「다시 승부」만. |
| ④ TOP 적용안 | (1) 히어로/델타 **아래** 보조 1줄, 풀에서 로테이션(예: `다음: 불꽃은 스윙 말고 피하기` · `다음: 일반 투구는 릴리즈에 맞춰 스윙` · `다음: Perfect 연타로 페이즈 밀기`). (2) **이번 판 치명 구종·Miss 원인·EARLY/LATE**를 쓰지 않음(페일 리뷰 HARD 유지). (3) 풀은 3–5문장, 세션당 동일 문장 연속 반복 최소화. (4) soft continue·유료 이어하기·연승/칭호 토스트 금지. sticky「다시 승부」만. |
| 판정/규칙 변경 | **없음** (결과 카피만. 점수식·판정창 불변). |

---

### ③ 불꽃 **회피 성공 확인 처프**(SFX, 비행 라이저·VO 텔 아님)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://www.gamedeveloper.com/design/what-goes-into-a-good-parry-system- (2025-12: 패리/회피 성공의 사운드·주스가 방어 툴킷 만족도를 좌우; 고위험 선택의 보상 신호) · https://www.gamesradar.com/games/rpg/parrying-was-not-easy-clair-obscur-expedition-33-devs-had-to-turn-to-sound-to-fix-an-integral-part-of-the-jrpgs-combat/ (2026-03/GDC 2026: 사운드로 타이밍 가독 — **본안은 성공 후 확인음만**, 공격음 속 ‘지금 패리’ 텔은 불꽃 오디오 텔 HARD로 제외) · https://duendesounds.com/creating-tension-with-sound-effects/ (riser/stinger/heartbeat와 **역할 분리** — 성공 확인은 짧은 릴리즈/처프 슬롯) |
| ② 한줄 요약 | 불꽃 투구 **회피 성공 확정 직후** 짧은 처프/에어 릴리즈 1샷으로 ‘피했다’를 귀에 남긴다 — 비행 중 라이저·BGM 스냅샷·스템·불꽃 VO 텔·피치 래더 아님. |
| ③ 왜 희동이 게임에 맞는지 | HARD **불꽃 비행 예감 라이저**(비행 중 긴장)·**페이즈 BGM 스냅샷+silence**·**뮤직 스템**·**크라우드 RTPC**·**불꽃 VO/오디오 텔**(구종 사전 고지)·피치 래더와 **다른 슬롯**(회피 성공 **후** 확인 SFX). Clair식 공격음 내 패리 텔은 재도입하지 않음. 판정창 불변. |
| ④ TOP 적용안 | (1) 불꽃 회피 성공 플래그→**80–150ms** 고음 처프 또는 짧은 에어 whoosh↓(키는 BGM과 충돌 적게, master 대비 −6~−10dB). (2) 일반 투구 스윙 Good/Perfect·Miss에는 재생하지 않음(타격 juice·피치 래더 슬롯과 분리). (3) 비행 중 라이저·릴리즈 전 VO/눈빛/글러브 텔·BGM gain/filter 스냅샷 재도입 금지. (4) 뮤트·reduce-audio 옵션 존중. |
| 판정/규칙 변경 | **없음** (회피 성공 후 SFX만). |
| **BGM 전제** | `music.js` 절차음 **2모드만**(opening/play), 외부 스템·파일 없음. Master gain ≈0.06–0.08. Mute 존중. 본안은 BGM 그래프를 건드리지 않는 **원샷 SFX**. |
| **구현 난이도** | **쉬움** — 회피 성공 콜백에 oscillator/noise 처프 1샷; BGM 모드·gain·filter·silence 로직 불필요. |

---

## 제외/확장만

| 아이디어 | 처리 | 이유 |
|---|---|---|
| 스코어보드·플로드라이트·PB 델타·불꽃 비행 라이저 | HARD(9/30 AM) | 재제안 금지. ①②③은 관중애니·미래전략·회피확인으로 슬롯 분리. |
| 월드 시프트·잔여 HP 히어로·BGM 스냅샷+silence | HARD(9/29 PM) | 재제안 금지. |
| 페이즈 진입 뮤지컬 스팅어 | AM 러너업 | 1차 TOP 금지 — ③은 회피 확인 처프 우선. |
| 저HP 심박 베드·접촉 머티리얼·FINAL 프라이드 배지·세션 스파크라인 | AM 러너업/스킵 | 1차 TOP 금지. |
| 치명 구종 귀인 칩 / 페일 리뷰 | HARD/스킵 | 페일라인·원인 칩 HARD — ②는 **다음** 전략만. |
| Clair식 공격음 내 패리 텔(Glissant Rush) | 스킵 | 불꽃 VO/오디오 텔 HARD와 경계. |
| 승리 절차 아르페지오 팡파르 | 러너업 | 결과 카드 HARD와 인접 — 회피 확인 우선. |
| 크라우드 치어 원샷 오디오 | 스킵 | 크라우드 RTPC·스팅어와 경계 — ①은 비주얼만. |

---

## Director용 한줄 요약

**PM TOP(판정불변·진행/리트라이/사운드):** ①관중 빌보드 치어 에너지 스파이크(월드 시프트·보드/라이트·크라우드 RTPC 금지) → ②재도전「바꿀 한 수」전략 프롬프트(잔여 HP·PB 델타·페일 리뷰·EARLY/LATE 금지) → ③불꽃 회피 성공 확인 처프 SFX(비행 라이저·스냅샷·스템·VO 텔·피치 래더 아님).

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-30 ~16:30 KST PM 루틴
