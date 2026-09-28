# 2026-09-28 AM 외부 아이디어

- **NO_NEW=false**
- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — 공 트레일 잔상 · Perfect 임팩트 프레임 · 불꽃 Hold/Charge 정지 텔 3개.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, 글러브 티핑, Trauma 카메라, VFX 4레인, 공 캐스트 그림자, 피격플래시+리코일, 시임/스핀 텔, Doppler 니어미스 whizz, 불꽃 직전 눈빛 텔, 열왜곡, 회피 애프터이미지, Miss 방향 카메라 임펄스, 방향성 임팩트 카메라 킥, 크라우드 RTPC, 주변시 엣지 밝기 펄스, 스윙 스미어+팔로우스루, Miss/Good/Perfect juice 예산표, settle+idle fidget, WANDR 가림, Bullet Dance aim-lock, Flukz 패턴 리믹스, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 히트스톱, 모양언어, 색만 구종 ID, EARLY/LATE 라벨, 약점글로우, 뮤직 스템[제안], 이점/약점 모디[제안], 비가시 타이밍창 DDA[제안], Nine Sols 부정확패리, mushy contact, Takamido 전신 텔, Witch Time 회피, 배트 킥백+접촉 더스트/스파크.
- **코드·밸런스·스토리:** 미수정. 본 문서만.

---

## TOP

### ① 공 비행 **트레일 잔상**(pitch trail persistence)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://flukz.org/devlog/particle-effects-shmup/ (Flukz, 2026-06: Bullet trail — 속도·궤적 가독성) · https://gdkeys.com/keys-to-combat-design-1-anatomy-of-an-attack/ (GDKeys Key #5: weapon/projectile trail persistence로 방향·위험 구간 강조) |
| ② 한줄 요약 | 작은 고속 투사체는 **짧은 페이드 트레일**이 있으면 공 본체보다 먼저 방향·속도를 읽힌다. |
| ③ 왜 희동이 게임에 맞는지 | 시임(텍스처)·열왜곡(공기 굴절)·캐스트 그림자(지면 깊이)·Doppler(통과음)와 **다른 채널**(과거 위치 잔광). 드래그 중에도 ‘어디로 오는가’를 주변시에 남긴다. 판정창·히트박스 불변. |
| ④ TOP 적용안 | (1) 일반구: 흰/연한 잔광 6–12px, 샘플 4–6개, life≈80–120ms. (2) 불꽃구: 같은 길이지만 오렌지 tint + 약간 두껍게(열왜곡과 중복 금지 — 트레일은 **뒤쪽 잔광만**, 왜곡은 공 주변). (3) 임팩트/회피 성공 시 트레일 즉시 페이드(≤60ms). 저사양·reduce-motion: 트레일 OFF 또는 점 2개만. (4) additive 블렌딩으로 배트/타자 가림 최소화(Flukz z-order 원칙). |
| 판정/규칙 변경 | **없음** (비행 VFX만). |

---

### ② Perfect 전용 **임팩트 프레임**(흑백/스케치 1–2프레임, 히트스톱 없음)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://realtimevfx.com/t/easy-impact-frames-for-unreal-engine-and-unity/30252 (Lush, 2026-01: anime-style impact frames — 흑백·콘트라스트·래디얼, **시간정지 없이** 1프레임 스타일 전환) · https://eastondev.com/blog/en/posts/dev/20260521-game-feedback-feel/ (Easton 2026-05: flash 50–100ms를 감각 스택의 ‘즉시 확인’ 레이어로) |
| ② 한줄 요약 | Perfect만 **1–2프레임 흑백/하이콘트라스트 임팩트 컷**으로 ‘맞았다’를 각인 — 히트스톱·카메라 킥과 분리. |
| ③ 왜 희동이 게임에 맞는지 | 히트스톱(시간동결)·Trauma/방향 킥(카메라)·희동이 피격플래시+리코일(수신측)·juice 예산표(강도 등급)와 직교하는 **화면 스타일 1컷**. 캐주얼 보스 히트감·공유 클립 친화. 판정·창 수치 불변. |
| ④ TOP 적용안 | (1) Perfect 확정 프레임에만: 전면 또는 임팩트 주변 원형에 흑백/잉크톤 오버레이 1–2프레임(≈16–40ms @60fps), ease-out. (2) Good=미적용 또는 매우 약한 림만; Miss=OFF. (3) 기존 히트스톱·카메라 킥이 켜져 있어도 **본안은 스타일 레이어만** — 시간스케일 변경 금지. (4) reduce-motion/epilepsy: OFF 또는 채도↓만. |
| 판정/규칙 변경 | **없음** (연출만. 히트스톱 재도입 아님). |

---

### ③ 불꽃 릴리즈 직전 **Hold/Charge 정지 포즈**(시각 charge-up, VO 없음)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://charios.com/blog/shmup-boss-pattern-tells-animation (Charios, 2026-05: tell 해부 — Anticipation→**Hold/Charge 정지·강도↑**→Release→Recovery) · https://www.chaoticstupid.com/enemy-attacks-and-telegraphing/ (Mike Stout: projectile charge-up — 입자 축적→밝은 플래시→발사) · https://scottfinegamedesign.com/sfgd-notes/2026/8/10/sf-game-design-notes-16-a-look-at-telegraphs (Scott Fine 2026-08: 강공격은 애니메이션+VFX 등 **다중 텔**로 공정성) |
| ② 한줄 요약 | 불꽃만 릴리즈 직전 **짧은 정지(Hold)+입자 축적**으로 ‘지금 특별구’를 읽게 한다 — 창·타이밍 수치 불변. |
| ③ 왜 희동이 게임에 맞는지 | 글러브 티핑(손)·눈빛(얼굴)·시임(공)·불꽃 VO(오디오)·Takamido 전신 키네마틱과 **다른 타이밍 슬롯**(릴리즈 직전 80–180ms 정지/충전). 페이크아웃 금지 — 일반구에는 Hold 없음. Silksong급 ‘강공격=다중 텔’을 모바일 보스에 축소 적용. |
| ④ TOP 적용안 | (1) 불꽃 투구만: 와인드업 끝→릴리즈 전 **80–150ms 포즈 홀드**(희동이 상체/팔 1키프레임 고정) + 글러브·공 주변에 작은 입자 축적(알파 캡). (2) Hold 끝 1프레임 밝은 림 플래시 후 발사. 일반구=기존 플로우 유지. (3) **페이크·캔슬 금지**(제외 목록과 충돌). 눈빛 텔이 이미 켜져 있으면 Hold는 그 **직후 슬롯**에만(중복 과장 방지). (4) 저사양: 입자 OFF, 홀드 포즈+림만. |
| 판정/규칙 변경 | **없음** (텔 연출만. 스윙/회피 판정창·불꽃 속도 수치 불변 권장). 홀드가 체감 반응을 줄이면 [제안]으로만 홀드 길이 A/B — **창 확대는 금지**. |

---

## 제외/확장만

| 아이디어 | 처리 | 이유 |
|---|---|---|
| MLB The Show Hitting **Depth of Field**(배경 블러로 릴리즈·존 집중) | 러너업 / 확장 후보 | https://showzone.gg/news/mlb-the-show-26-gameplay-feature-premiere-breakdown — 가독성↑이나 모바일 GPU·멀미 리스크. TOP3와 직교하나 우선순위↓. |
| Graze **마이크로 플린치**/링 스파크 | 확장만 | Charios graze(2026-05). Doppler whizz·니어미스 비네트·회피 애프터이미지와 채널 겹침 — 타자 미세 플린치만 확장 시 검토. |
| Silksong Widow식 **착지 레인 실크/경로 VFX** | 보류 | 불꽃 착지 레인 예고는 강력하나 aim-lock 미끼·페이크아웃·색 구종과 혼동 가능. 필요 시 [제안]. |
| 배트 **웨폰 트레일**(GDKeys) | 확장만 | 스윙 스미어 HARD와 근접 — 스미어 적용 후 잔광 길이만 다듬는 확장. |
| 드래그 손가락 **스와이프 블레이드 트레일** | 스킵 | 조작 juice는 가능하나 본 배치 핵심(텔/판정가독)과 거리 있음. |
| Flukz **패턴 리믹스** / 히트스톱 / Trauma / 열왜곡 등 | HARD 제외 | 재제안 금지. |

---

## Director용 한줄 요약

**AM TOP(판정불변):** ①공 트레일 잔상(속도·궤적) → ②Perfect 임팩트 프레임(히트스톱 없는 1컷) → ③불꽃 Hold/Charge 정지+시각 charge(VO·티핑·눈빛과 슬롯 분리).

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-28 10:16 KST AM 루틴
