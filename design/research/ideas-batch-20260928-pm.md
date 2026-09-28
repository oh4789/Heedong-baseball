# 2026-09-28 PM 외부 아이디어

- **NO_NEW=false**
- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — Perfect 크로매틱 수차 펀치 · 마운드/플레이트 환경 먼지 · 접촉점 등급 플로팅 텍스트 3개.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, 글러브 티핑, Trauma 카메라, VFX 4레인, 공 캐스트 그림자, 피격플래시+리코일, 시임/스핀 텔, Doppler 니어미스 whizz, 불꽃 직전 눈빛 텔, 열왜곡, 회피 애프터이미지, Miss 방향 카메라 임펄스, 방향성 임팩트 카메라 킥, 크라우드 RTPC, 주변시 엣지 밝기 펄스, 스윙 스미어+팔로우스루, Miss/Good/Perfect juice 예산표, settle+idle fidget, WANDR 가림, Bullet Dance aim-lock, Flukz 패턴 리믹스, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 히트스톱, 모양언어, 색만 구종 ID, EARLY/LATE 라벨·타이밍 방향 힌트, 약점글로우, 뮤직 스템[제안], 이점/약점 모디[제안], 비가시 타이밍창 DDA[제안], Nine Sols 부정확패리, mushy contact, Takamido 전신 텔, Witch Time 회피, 배트 킥백+접촉 더스트/스파크, 공 비행 트레일 잔상, Perfect 임팩트 프레임, 불꽃 Hold/Charge, Hitting DoF/릴리즈 존 DoF.
- **코드·밸런스·스토리:** 미수정. 본 문서만.

---

## TOP

### ① Perfect 전용 **크로매틱 수차 펀치**(카메라 이동 없음)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://spanzeto.dev/en/docs/game-juice-pro/feedbacks/ (Game Juice Pro, 2026-02: Chromatic Aberration — heavy impact용 RGB 분리, Duration≈0.2s, Intensity curve) · https://feel-docs.moremountains.com/API/class_more_mountains_1_1_feedbacks_for_third_party_1_1_m_m_f___chromatic_aberration.html (Feel MMF_ChromaticAberration: Intensity 0→1→0, Duration 기본 0.2s) |
| ② 한줄 요약 | Perfect 확정 순간만 **화면 RGB를 짧게 갈라** ‘맞았다’를 전달 — 카메라 위치·킥·히트스톱 없이. |
| ③ 왜 희동이 게임에 맞는지 | Trauma/방향 킥/Miss 임펄스(카메라)·임팩트 프레임(흑백 1컷)·엣지 밝기 펄스(HUD)·히트스톱과 **다른 채널**(포스트 FX 렌즈 수차). 9/23 Trauma 패키지의 Miss용 색수차 언급과는 **슬롯 분리**(본안=Perfect만·transform 고정). 판정창 불변. |
| ④ TOP 적용안 | (1) Perfect만: 전면 CA intensity 0→peak→0, **80–150ms**, peak는 약하게(모바일 가독 유지). (2) Good=미적용 또는 intensity≈1/3; Miss=OFF. (3) 카메라 transform 변경 금지. reduce-motion/epilepsy=OFF. (4) 웹: CSS/캔버스 RGB 오프셋 또는 3레이어 미세 시프트로 대체 가능. |
| 판정/규칙 변경 | **없음** (포스트 FX만). |

---

### ② **마운드/홈플레이트 환경 잔향 먼지**(릴리즈·도착 프레임 동기)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://gamedesign.gg/articles/game-feel/ (Swink polish: **environmental response** — 착지 먼지·세계가 플레이어를 인정) · https://mocaponline.com/blogs/mocap-news/animation-polish-game-feel-guide (2026-03: dust puff를 **발/접촉 키프레임 Notify**에 동기) · https://wizuslabs.com/blog/anatomy-of-game-juice/ (2026-07: particles = 상태변화의 **물리적 잔여물**) |
| ② 한줄 요약 | 투구 **릴리즈 순간 마운드 먼지** + 공이 존에 닿기 직전 **플레이트 미세 먼지**로 ‘세계가 반응’ — 배트 접촉 더스트와 슬롯 분리. |
| ③ 왜 희동이 게임에 맞는지 | HARD **배트 킥백+접촉 더스트/스파크**(임팩트 지점)와 **시점·위치가 다름**(마운드=릴리즈 / 플레이트=도착). 트레일·그림자·열왜곡·DoF와도 직교하는 **환경 레이어**. 판정 불변. |
| ④ TOP 적용안 | (1) 희동이 릴리즈 프레임: 발/마운드 쪽에 작은 흙먼지 버스트 8–16입자, life≈300–500ms, 중력↓. (2) 공이 홈플레이트 근접(판정 직전 1프레임 근처): 플레이트 가장자리 미세 먼지 4–8입자 — **Miss/회피/히트 공통**으로 ‘공이 존을 스쳤다’만 전달(점수 무관). (3) 불꽃구만 tint 약간 따뜻하게(색 구종 ID 아님 — 동일 실루엣). (4) 저사양: 릴리즈 먼지 1회만. 접촉 배트 더스트는 재도입하지 않음. |
| 판정/규칙 변경 | **없음** (환경 VFX만). |

---

### ③ 접촉점 **등급 플로팅 텍스트**(Perfect/Good 라벨 팝)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://eastondev.com/blog/en/posts/dev/20260521-game-feedback-feel/ (2026-05: floating text를 감각 스택 마지막 — flash→particles→**text ~100ms 후**, 1–2s fade) · https://wizuslabs.com/blog/anatomy-of-game-juice/ (score/number pop: 스케일 오버슛→상승→페이드 = 보상 레이어) · https://saltmire.github.io/godot-4-floating-damage-numbers.html (접촉점 spawn, scale pop→상승+페이드) |
| ② 한줄 요약 | 임팩트 **월드 좌표**에서 Perfect/Good 라벨이 짧게 팝·상승 — HUD 칩·「회피!」와 다른 레이어. |
| ③ 왜 희동이 게임에 맞는지 | 9/15 「회피!」민트 플로팅(회피 채널)·HUD 콤보칩·임팩트 프레임·히트스톱·카메라와 직교하는 **월드 스페이스 타격 등급 텍스트**. EARLY/LATE·타이밍 방향 힌트 **금지** — 등급 확정 라벨만. 판정 불변. |
| ④ TOP 적용안 | (1) Perfect: 접촉점 기준 “PERFECT” 또는 “★” 1.4×→1.0 팝, 위 30–50px, 400–700ms fade. (2) Good: 더 작고 약한 톤; Miss=OFF(또는 Director 선택으로 아주 짧은 회색 “—”만). (3) HUD 칩과 동시 가능하되 월드 텍스트는 1개만(연타 시 이전 즉시 kill). 「회피!」와 문구·색 톤 분리. (4) reduce-motion: 위치 고정+페이드만. |
| 판정/규칙 변경 | **없음** (보상 텍스트만. 라벨이 판정 의미를 바꾸지 않음). |

---

## 제외/확장만

| 아이디어 | 처리 | 이유 |
|---|---|---|
| Perfect **확장 충격파 링** | 러너업 | Zelda식 shockwave·Easton 입자와 직교하나 본 TOP과 채널 겹침 가능 — CA/먼지/텍스트 우선. |
| Soft→hard **릴리즈 포커스 앵커**(AVB) | 보류 | AM DoF HARD·한낮 DoF 시안과 근접. |
| 배트/공 **스쿼시·스케일 스프링 펀치** | 러너업 | Cable springs·SpanZeto Scale/Squash — 카메라가 아닌 오브젝트 축. settle HARD와 경계 주의. |
| 캐처 미트 스냅 | 스킵 | 야구감은 좋으나 공개 기법·에셋 부담. |
| 블룸 intensity 스파이크 | 스킵 | CA와 채널 겹침. |
| HUD 숫자 pop만 | 스킵 | 기존 combo-mult-chip과 중복 → ③은 **월드 접촉점**. |
| 시임/트레일/Hold/임팩트프레임/배트더스트/카메라킥 등 | HARD 제외 | 재제안 금지. |

---

## Director용 한줄 요약

**PM TOP(판정불변):** ①Perfect 크로매틱 수차 펀치(카메라 고정) → ②마운드/플레이트 환경 먼지(릴리즈·도착) → ③접촉점 등급 플로팅 텍스트(EARLY/LATE 금지).

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-28 16:15 KST PM 루틴
