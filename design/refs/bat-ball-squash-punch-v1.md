# 접촉 스쿼시·스트레치 펀치 · v1 (bat-ball-squash-punch-v1)

파일: `design/assets/bat-ball-squash-punch-v1.png` (시안 보드 · 라벨 한글 · **1600×900** · `#FF3B3B` 0px 확인)

## 목표
Perfect/Good **확정 프레임**에 배트·공 스프라이트에만 **로컬 scale 스쿼시→스트레치→스프링 감쇠**를  squish/punch로 얹는다.  
카메라 transform·트라우마·히트스톱 창·판정 의미는 건드리지 않는 **오브젝트 축 juice**.  
**비주얼 전용 — 판정창·히트박스·점수·스침·투구 확률·engine 불변.**

근거: `design/research/ideas-batch-20260928-pm.md` 러너업(배트/공 스쿼시·스케일 스프링 펀치) · `design/research/refs-20260928-evening.md`  
외부: Josh Comeau squash-and-stretch(스프링·transform-origin) · Feel `MMF_SquashAndStretchSpring` Bump(frequency/damping).

---

## 트리거

| 항목 | 값 |
|---|---|
| ON | Perfect / Good **confirm 프레임만** (권장: `fireBeatWarpImpact`와 **같은 비트**) |
| OFF | Miss · 회피 성공 · 와인드업 · 접근 중 · settle/fidget |
| 강도 | Perfect = **1.0×** 풀 · Good ≈ **0.55×** (진폭만) · Miss = **완전 OFF** |
| `prefers-reduced-motion` | scale punch **OFF** 또는 **1프레임 플래시**(α만) — 스프링 모션 금지 |
| 저사양 | Good 생략·Perfect만 짧게, 또는 완전 OFF |

---

## 타깃 (카메라 아님)

| 타깃 | 채널 | 메모 |
|---|---|---|
| 공 스프라이트 | `scaleX` / `scaleY` (로컬, 충격 축 정렬) | 체적 보존: 압축축↓ ↔ 수직축↑ |
| 배트 / 스미어 | 배럴 두께 압축 + 팁 길이 미세 신장 | tip whip은 STRETCH 구간만 |
| 카메라 | **변경 금지** | Trauma / Miss 임펄스 / 방향 킥과 슬롯 분리 |
| HUD | 미적용 | combo chip 모션과 직교 |

`transform-origin` = **접촉면 가장자리**(공: 배트 쪽 접점 · 배트: 배럴 접촉점). 중심 origin이면 스쿼시가 ‘통통’ 튀어 읽힘 약해짐(Comeau).

---

## 파라미터 표

| 항목 | Perfect (1.0×) | Good (≈0.55×) | 비고 |
|---|---|---|---|
| SQUASH 구간 | **0–40ms** | 동일 타이밍 | 충격 직후 |
| 공 squash (충격축) | **0.55** | ≈0.75 | scale along hit normal |
| 공 expand (수직축) | **≈1.82** | ≈1.33 | 체적≈`sx×sy≈1.0` 유지 |
| 배트 배럴 compress | thickness **0.82** / length 1.05 | 0.90 / 1.03 | 약한 배럴만 |
| STRETCH 구간 | **40–120ms** | 동일 | 반발·귀환 방향 |
| 공 stretch (반발축) | **1.55** / perp **0.65** | 1.30 / 0.77 | exit/return 정렬 |
| 배트 tip whip | length +≈12% (짧게) | +≈6% | STRETCH만 |
| SETTLE 구간 | **120–280ms** | 동일 | 스프링 감쇠 |
| 오버슛 | scale **1.0 기준 1회** OK | 더 작게 | 이후 rest 1.0 |
| Spring frequency | **≈8–12 Hz** 상당 | 동일 또는 약간↑ | Feel MMF Bump 스타일 |
| Spring damping | **0.35–0.55** (underdamped) | 조금 더 댐핑 | 1–2 사이클 내 안착 |
| 합계 | **≈280ms** | ≈280ms | unscaled 권장(히트스톱과 독립) |
| 체적 보존 | **ON** (2D: `sx×sy≈const`) | ON | 납작만/가늘기만 금지 |

의사코드(시안용):

```
// hit axis = impact normal; origin = contact edge
onConfirm(tier):  // Perfect | Good
  amp = (tier==Perfect) ? 1.0 : 0.55
  bumpSquashStretchSpring(ball, bat, {
    mode: "Bump",
    frequency: 10,
    damping: 0.45,
    squashAxis: hitNormal,
    squashMin: lerp(1, 0.55, amp),
    stretchMax: lerp(1, 1.55, amp),
    durationMs: 280,
    volumePreserve: true,
    transformOrigin: contactEdge
  })
```

---

## 모션 시트 (보드 4프레임)

| # | 상태 | ms | 비주얼 |
|---|---|---|---|
| A | IDLE | 0 | 배트·공 scale 1.0 · 접촉존 |
| B | SQUASH | 0–40 | 공 충격축 납작 · 배럴 약간 압축 · 금 링 힌트 |
| C | STRETCH | 40–120 | 공 반발 방향 신장 · 배트 팁 휩 · 민트 모션라인 |
| D | SETTLE | 120–280 | 오버슛 후 보라 링 · 스프링 감쇠 → 1.0 |

---

## 권장 크롭 (구현자)

보드: `design/assets/bat-ball-squash-punch-v1.png` · **1600×900**

| 용도 | 권장 크롭 (보드 좌표) | 메모 |
|---|---|---|
| A IDLE | ≈ **20,138 – 394,508** (패널 씬) | 기준 스케일 |
| B SQUASH | ≈ **408,138 – 782,508** | 납작·배럴 압축 레퍼 |
| C STRETCH | ≈ **796,138 – 1170,508** | 신장·팁 휩 레퍼 |
| D SETTLE | ≈ **1184,138 – 1558,508** | 감쇠 안착 |
| 스펙 스트립 | 하단 ≈ **20,574 – 1580,886** | PR/갤러리 |
| 갤러리/문서 | 전체 **1600×900** | Director 핸드오프 |

런타임 베이크 불필요 — **절차적 scale + spring**으로 충분. 보드 패널은 타이밍·진폭 레퍼런스.

---

## 레이어 순서 (기존 juice와)

```
… 공 그림자 → 비행 트레일 → 열왜곡(불꽃) →
★ 공 본체(+본안 scale) · 배트/스미어(+본안 scale)  ← 로컬 transform만
→ 임팩트 프레임(스타일 레이어, 직교) → 스파크/파티클 → HUD
```

| 채널 | 관계 |
|---|---|
| `perfect-impact-frame-v1` | 흑백/투톤 **스타일 1컷** — 본안은 **지속 scale 스프링**. 동시 OK, 채널 다름 |
| `ball-flight-trail-v1` | 비행 중 잔상 — 접촉 확정 후 scale과 시간 분리 |
| `pitch-release-dof-focus-v1` | 접근 중만 ON → 접촉 −80ms 이전 OFF. 본안은 confirm 이후 |
| `mound-plate-dust-v1` | 환경 지면 먼지 — 오브젝트 scale과 직교 |
| Trauma / 카메라 킥 | **금지·미사용**. 본안은 오브젝트만 |
| combo-mult-chip-motion | HUD — 직교 |

---

## HARD (하지 말 것)

- EARLY / LATE 라벨 · 타이밍 방향 힌트
- 불꽃 Hold / Charge 텔
- 카메라 임펄스 · Trauma punch · 방향 킥
- 판정 윈도우·히트박스·점수식 변경
- Miss 스케일 펀치 (OFF 유지)
- 크로매틱 수차 · 접촉점 플로팅 텍스트 (Director 보류 슬롯 — 본 시안에 넣지 않음)

---

## 프로그래머 메모

```
SQUASH_MS            = 0..40
STRETCH_MS           = 40..120
SETTLE_MS            = 120..280
TOTAL_MS             = 280
PERFECT_AMP          = 1.0
GOOD_AMP             = 0.55
MISS                 = OFF
BALL_SQUASH_AXIS     = 0.55   // * amp lerp from 1
BALL_STRETCH_AXIS    = 1.55
VOLUME_PRESERVE      = true   // sx*sy ≈ const
SPRING_FREQ_HZ       = 8..12
SPRING_DAMPING       = 0.35..0.55
TRANSFORM_ORIGIN     = contactEdge
CAMERA_UNCHANGED     = true
JUDGMENT_UNCHANGED   = true
SCORE_UNCHANGED      = true
ENGINE_UNCHANGED     = true
REDUCE_MOTION        = OFF | oneFrameFlash
HARD_EXCLUDED        = earlyLateLabel | holdCharge | cameraImpulse | missScalePunch
```

---

## 팔레트
`#081329` · `#F7F3E8` · `#FF986E` · `#FFAB88` · `#C3A4FF` · `#FFD25B` · `#9BFFE6` · `#8C9BC2`

## 관련
- 시안: `design/assets/bat-ball-squash-punch-v1.png`
- 저녁 레퍼: `design/research/refs-20260928-evening.md`
- 근거 배치: `design/research/ideas-batch-20260928-pm.md` (러너업 행)
