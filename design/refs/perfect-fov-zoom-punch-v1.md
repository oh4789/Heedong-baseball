# Perfect FOV 줌 펀치 · v1 (perfect-fov-zoom-punch-v1)

파일: `design/assets/perfect-fov-zoom-punch-v1.png` (시안 보드 · 라벨 한글 · **1600×900** · `#FF3B3B` 0px 확인)

## 목표
Perfect **확정 순간**만 렌즈 **FOV**(또는 2D **orthographicSize** / 캔버스·뷰 scale)를 짧게 좁혔다 **정확 복귀**한다.  
카메라 **position / rotation 고정** — Trauma·Miss 임펄스·방향 킥과 **다른 채널**.  
**비주얼 전용 — 판정창·히트박스·점수·스침·투구 확률·engine 불변.**

근거: `design/research/ideas-batch-20260929-am.md` TOP① · `design/research/refs-20260929-design-am.md`  
외부: VionixStudio 2D Orthographic `orthographicSize` 줌 · Solana Garden camera systems(FOV/ortho ~150–250ms feel).

---

## 트리거

| 항목 | 값 |
|---|---|
| ON | Perfect **confirm 프레임** (권장: 접촉 확정과 같은 비트) |
| Good | **½ 진폭** 또는 **OFF** (팀 선택; 기본 권장=½) |
| OFF | Miss · 회피 성공 · 와인드업 · 접근 중 · settle/fidget |
| `prefers-reduced-motion` | 줌 펀치 **완전 OFF** |
| 저사양 | Good 생략·Perfect만 짧게, 또는 완전 OFF |

---

## 타깃 채널 (위치·회전 아님)

| 타깃 | 채널 | 메모 |
|---|---|---|
| 3D/투영 카메라 | `fieldOfView` only | transform x/y/z/rot **금지** |
| 2D Orthographic | `orthographicSize` ↓ = 줌인 | Unity 2D 패턴(Vionix) |
| 웹 캔버스 / CSS | view scale about **접촉점** | `orthoSize *= (1 - punch)` 동치 |
| 카메라 position/rotation | **변경 금지** | Trauma / Miss임펄스 / 방향킥과 슬롯 분리 |
| HUD | 미적용 | combo chip·플로팅텍스트와 직교 |

복귀: 트윈 종료 시 FOV/ortho/scale는 **시작 베이스라인과 비트 단위 동일**(드리프트 0).

---

## 파라미터 표

| 항목 | Perfect (1.0×) | Good (≈0.5×) | 비고 |
|---|---|---|---|
| 좁힘 비율 | **6–12%** (권장 피크 **≈9–12%**) | ≈3–6% 또는 OFF | FOV↓ 또는 orthoSize↓ |
| IN | **40–60ms** | 동일 타이밍 | ease-out 권장 |
| HOLD | **30–50ms** | 동일 또는 짧게 | 피크 유지 |
| OUT | **40–70ms** | 동일 | ease-in → baseline |
| 합계 | **100–180ms** | ≈100–180ms | Solana feel 창과 정렬 |
| 재트리거 | **이전 트윈 kill → 재시작** | 동일 | 연속 Perfect 드리프트 방지 |
| 복귀 | **정확 baseline** | 정확 baseline | 누적 줌 금지 |
| reduce-motion | **OFF** | OFF | 모션 스킵 |

의사코드(시안용):

```
// camera.pos / camera.rot NEVER touched
onConfirm(tier):  // Perfect | Good
  if reducedMotion: return
  amp = (tier==Perfect) ? 1.0 : 0.5   // or Good=OFF
  if amp <= 0: return
  killActiveZoomTween()
  peak = baseline * (1 - lerp(0.06, 0.12, amp))  // orthoSize or FOV
  // web alt: viewScale = 1 / (1 - punch) about contact
  tweenZoom(baseline → peak, inMs: 40..60)
  hold(peak, holdMs: 30..50)
  tweenZoom(peak → baseline, outMs: 40..70)  // exact restore
```

웹 힌트:
- CSS/canvas: `transform: scale(s)` with `transform-origin` = 접촉점(화면 좌표), `s = 1/(1-punch)`.
- 또는 렌더 타깃 crop + stretch(뷰포트 inset)로 ortho 축소 시뮬레이션.
- `orthoSize *= (1 - punch)` 후 트윈 종료 시 원값 대입(부동소수 누적 금지 — 매 프레임 baseline 기준 lerp).

---

## 모션 시트 (보드 4프레임)

| # | 상태 | ms | 비주얼 |
|---|---|---|---|
| A | IDLE | 0 | 정상 FOV 100% · 크림 뷰포트 프레임 |
| B | ZOOM-IN | 40–60 | 6–12% 좁힘 · 접촉 확대 · 민트 frustum 힌트 |
| C | HOLD | +30–50 | 피크(≈FOV 88%) · 위치·회전 고정 |
| D | RETURN | +40–70 | 베이스라인 복귀 · 드리프트 0 |

---

## 권장 크롭 (구현자)

보드: `design/assets/perfect-fov-zoom-punch-v1.png` · **1600×900**

| 용도 | 권장 크롭 (보드 좌표) | 메모 |
|---|---|---|
| A IDLE | ≈ **32,138 – 390,508** (패널 씬) | 기준 FOV |
| B ZOOM-IN | ≈ **420,138 – 778,508** | 줌인·frustum |
| C HOLD | ≈ **808,138 – 1166,508** | 피크 |
| D RETURN | ≈ **1196,138 – 1554,508** | 복귀 |
| 스펙 스트립 | 하단 ≈ **20,574 – 1580,886** | PR/갤러리 |
| 갤러리/문서 | 전체 **1600×900** | Director 핸드오프 |

런타임 베이크 불필요 — **절차적 FOV/ortho/view-scale 트윈**으로 충분.

---

## 레이어 순서 (기존 juice와)

```
… DoF(접근 중만) → 공/배트(스쿼시 등 오브젝트) → 임팩트 프레임 →
★ 렌즈 FOV / ortho / view-scale 펀치  ← 카메라 투영만
→ 비네트(별도 슬롯) → HUD
```

| 채널 | 관계 |
|---|---|
| Trauma / Miss 임펄스 / 방향 킥 | **금지·미사용**. 본안은 FOV/scale만 |
| `pitch-release-dof-focus-v1` | 접근 중 배경 블러 — 초점면 채널. 본안은 confirm 이후 시야각 |
| `bat-ball-squash-punch-v1` | 오브젝트 local scale — 직교, 동시 OK |
| `perfect-impact-frame-v1` | 스타일 1컷 — 직교 |
| CA / 플로팅 Perfect·Good 텍스트 | HARD·미제작 — 본 시안에 넣지 않음 |
| combo-mult-chip-motion | HUD — 직교 |

---

## HARD (하지 말 것)

- 카메라 **x/y/rotation** 변경 · Trauma punch · Miss 방향 임펄스 · 방향성 킥
- 크로매틱 수차 · 접촉점 플로팅 텍스트 · 불꽃 Hold/Charge
- EARLY / LATE 라벨 · 타이밍 방향 힌트
- 판정 윈도우·히트박스·점수식 변경
- Miss 줌 펀치 (OFF 유지)
- 줌 후 베이스라인 미복귀(드리프트)

---

## 프로그래머 메모

```
CHANNEL              = FOV | orthographicSize | canvasViewScale
PUNCH_NARROW         = 0.06..0.12   // Perfect peak
GOOD_AMP             = 0.5 | OFF
MISS                 = OFF
IN_MS                = 40..60
HOLD_MS              = 30..50
OUT_MS               = 40..70
TOTAL_MS             = 100..180
KILL_ON_RETRIGGER    = true
RESTORE_EXACT        = true         // no drift
CAMERA_POS_ROT       = UNCHANGED
JUDGMENT_UNCHANGED   = true
SCORE_UNCHANGED      = true
ENGINE_UNCHANGED     = true
REDUCE_MOTION        = OFF
HARD_EXCLUDED        = trauma | missImpulse | dirKick | CA | floatingText | holdCharge | squashChannel
WEB_HINT             = scaleAboutContact | orthoSize *= (1 - punch)
```

---

## 팔레트
`#081329` · `#F7F3E8` · `#FF986E` · `#FFAB88` · `#C3A4FF` · `#FFD25B` · `#9BFFE6` · `#8C9BC2`

## 관련
- 시안: `design/assets/perfect-fov-zoom-punch-v1.png`
- 디자인 레퍼: `design/research/refs-20260929-design-am.md`
- AM 조사 레퍼: `design/research/refs-20260929-am.md`
- 근거 배치 TOP①: `design/research/ideas-batch-20260929-am.md`
