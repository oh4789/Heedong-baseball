# 불꽃 열왜곡 후광 · v1

파일: `design/assets/fire-heat-haze-halo-v1.png` (시안 보드 라벨 한글 · 1600×900)

## 목표
불꽃구 **비행 중**에만 공 뒤 40–80px 저강도 **열왜곡(heat haze) 후광**으로 ‘뜨겁다’를 공기 굴절 레이어로 읽히게 한다.  
**일반구 OFF** · **판정 박스·창·engine·점수·스침 불변**.  
시임 텔 · 공 그림자 잔불 · 불꽃 눈빛 · 불꽃 텔레그래프와 **직교인 공기 굴절 채널**.

근거: `design/research/ideas-batch-20260924-pm.md` TOP1 · Studio Fishbones Fire Ball · Procedural Heat Distortion URP (2026-04).

---

## 타이밍 표

| 구간 | 조건 | 열왜곡 | 비고 |
|------|------|--------|------|
| 투구 전 · 릴리즈 직전 | — | **OFF** | 눈빛·텔레그래프 구간과 겹치지 않음 |
| 비행 원거리 | approach≈0.0–0.35 | ON · **0.25 × cap** | 후광 40–80px 존, 공 **뒤** z |
| 비행 중거리 | approach≈0.35–0.70 | ON · **0.55 × cap** | 접근 곡선 보간 |
| 비행 근거리 | approach≈0.70–1.0 | ON · **0.85 × cap** | 캡의 85%에서 클램프 (풀캡 금지) |
| 임팩트 **또는** 회피 성공 | 판정 확정 프레임 | **80ms 페이드아웃** | 선형 또는 ease-out |
| 일반구 전 구간 | pitch≠fire | **항상 OFF** | 예외 없음 |

- `approach01` = 투수→타자 진행도(0=릴리즈, 1=플레이트). 절대 ms가 아닌 **접근 비율**.
- 페이드는 임팩트·회피 성공 중 **먼저 온 이벤트**에서만 1회. 중첩 금지.

---

## 강도 캡 (낮게 유지)

| 파라미터 | 캡 | 권장 기본 |
|----------|-----|-----------|
| `HAZE_DISPLACE_PX_MAX` | **2.0px** (@1x 논리) | 1.2–1.6px |
| `HAZE_ALPHA_MAX` | **0.22** | 0.14–0.18 |
| 후광 존 반경 | **40–80px** (공 중심 기준, 공 스프라이트 **뒤**) | 60px 기본 |
| 노이즈 스크롤 속도 | ≤ **24px/s** | 16px/s |
| 시임 피크 중 디밍 | 시임 대비 피크(80–200ms) 동안 haze × **0.55** | 가독 가드레일 |

캡을 넘기면 시임·그림자·레인과 충돌한다. **풀스크린 왜곡·강한 크로마 금지**.

---

## 접근 강도 곡선

```
intensity = clamp(sample(approach01), 0, 0.85) * HAZE_*_MAX

approach01 | 배수 (of cap)
-----------+----------------
  0.00     | 0.25   ← far
  0.50     | 0.55   ← mid
  1.00     | 0.85   ← near (하드 캡; 1.0 금지)
```

보간: piecewise linear 또는 smoothstep(far→mid→near).  
실구현 키: `HAZE_APPROACH_FAR=0.25`, `HAZE_APPROACH_MID=0.55`, `HAZE_APPROACH_NEAR=0.85`.

---

## 페이드 (80ms)

| 단계 | t (ms, 이벤트=0) | 배수 |
|------|------------------|------|
| 이벤트 직전 | <0 | 당시 비행 강도 유지 |
| 페이드 | 0 → 80 | 1.0 → 0.0 (ease-out 권장) |
| 이후 | >80 | OFF |

- 트리거: **임팩트** OR **회피 성공** (불꽃만). Miss·스침만으로는 페이드 시작하지 않음(비행 지속 시 곡선 유지).
- reduced-motion / 저사양: 페이드 스킵 → 즉시 OFF + 림만(해당 모드).

---

## 저사양 · reduced-motion

| 모드 | 왜곡 쿼드 | 대체 |
|------|-----------|------|
| 풀퀄리티 | ON (노이즈 스크롤) | — |
| **저사양** | **OFF** | 공 외곽 **1px** 오렌지/앰버 림 (`#FF986E` / `#FFAB88`) |
| **prefers-reduced-motion** | **OFF** | 동일 1px 림만 |

림은 시임 텍스처 **위가 아닌 외곽 링** — 시임 밴드와 겹치지 않게 inset 0, stroke outside.

---

## Canvas 구현 노트 (셰이더·WebGL 불필요)

목표: **2D canvas noise quad**. WebGL/커스텀 셰이더 없이 동작.

### 권장 A — 프리베이크 노이즈 스프라이트 2–4프레임
1. `haze_noise_f0…f3` (각 **256×256 @2x**, 그레이·저대비, 코랄/앰버 tint 베이크 가능).
2. 공 월드좌표 뒤에 쿼드 배치 (z < ball, 오프셋 0; 크기 ≈ 공경 + 40–80px).
3. 매 프레임: `frameIndex = (t * fps) % N` 또는 UV `offsetX/Y += scroll * dt`.
4. `globalAlpha = intensity * HAZE_ALPHA_MAX` · (선택) `drawImage` 소스 사각을 1–2px 시프트해 의사 굴절.
5. 공 스프라이트를 **그 위에** 그림 → 후광이 시임을 덮지 않음.

### 권장 B — 단일 노이즈 + 퍼프레임 오프셋 샘플
1. 노이즈 텍스처 1장.
2. 매 프레임 `sx, sy`를 저속 스크롤.
3. destination에 soft radial mask(공 뒤 링)로 clip 후 낮은 알파로 합성.
4. displacement는 **샘플 오프셋 1–2px**로 근사 (진짜 굴절 맵 불필요).

```
HAZE_ZONE_PX           = 60      // 40–80 클램프
HAZE_DISPLACE_PX_MAX   = 1.5
HAZE_ALPHA_MAX         = 0.16
HAZE_APPROACH_FAR/MID/NEAR = 0.25 / 0.55 / 0.85
HAZE_FADE_MS           = 80
HAZE_SEAM_PEAK_DIM     = 0.55    // 시임 80–200ms 중
USE_WEBGL              = false
```

---

## 크롭 / 익스포트 표

보드: `design/assets/fire-heat-haze-halo-v1.png` · **1600×900** (16:9)

| 용도 | 권장 크롭 / 사이즈 | 메모 |
|------|-------------------|------|
| 헤이즈 노이즈 스프라이트 | 패널 B 후광 존 · **256×256 @2x** × 2–4프레임 | 저대비 그레인, 코랄/앰버 tint |
| 1px 림 레퍼런스 | 패널 D 공 · **128×128 @2x** | 외곽 stroke only |
| 타임라인/곡선 스트립 | 패널 C 가로 · **960×120 @2x** / 480×60 | far/mid/near + 80ms 페이드 |
| 채널 분리 아이콘 | 패널 E · 각 **96×96** | 시임·그림자·눈빛·텔레그래프·헤이즈 |
| 갤러리/문서 컷 | 보드 전체 1600×900 또는 A/B 각 **720×400** | Director 리뷰용 |

---

## 직교성 (채널 분리) · 충돌 가드레일

| 채널 | 소유 / 위치 | 시점 | 본 시트 |
|------|-------------|------|---------|
| 시임·스핀 텔 | 공 **텍스처** | 릴리즈 후 80–200ms 피크 | **직교** — 헤이즈는 공 **뒤**; 피크 중 ×0.55 디밍 |
| 공 그림자 잔불 | **지면** 그림자 가장자리 | 비행 중 | **직교** — 평면 지면 vs 공 주변 공기 |
| 불꽃 눈빛 텔 | **얼굴** | 릴리즈 전 −250–0ms | **직교** — 투구 전 vs 비행 중 |
| 불꽃 텔레그래프 | 코랄/앰버 **레인** UI | 투구 전 | **직교** — 레인 vs 공기 굴절 |
| **본 시트** | 공 **뒤** 공기 굴절 쿼드 | 비행 중 only | 불꽃 전용 |

### 가드레일 (필수)
1. **헤이즈는 항상 공 스프라이트 뒤(z < ball).** 시임 밴드·닷 위를 덮지 않음. 합성 순서: haze → ball(+seam) → UI.
2. **시임 대비 피크(80–200ms) 동안** `hazeIntensity *= HAZE_SEAM_PEAK_DIM(0.55)`. 필요 시 피크 창에서 후광 반경을 40px 하한으로 축소.
3. 그림자 잔불·텔레그래프 레인과 **동일 색 블룸 금지** — 헤이즈는 저알파 그레인/굴절만, 강한 코랄 플레어 없음.
4. `#FF3B3B` **금지** (회피 전용 빨강과 충돌).

---

## QA 체크리스트

- [ ] 일반구: 열왜곡·림 **완전 OFF**
- [ ] 불꽃구: 후광 존 40–80px, 공 **뒤**만
- [ ] 접근 곡선 far 0.25 / mid 0.55 / near 0.85 of cap (near에서 풀캡 미도달)
- [ ] 임팩트 또는 회피 성공 시 **80ms** 페이드아웃
- [ ] 강도 캡: displace ≤2px, alpha ≤0.22 (권장 더 낮음)
- [ ] 저사양·RM: 왜곡 OFF, **1px** 오렌지/앰버 림만
- [ ] canvas 노이즈 쿼드만으로 동작 (WebGL 0)
- [ ] 시임 피크 중 헤이즈 디밍 확인
- [ ] 그림자·눈빛·텔레그래프와 화면 겹침 시 가독 유지
- [ ] `#FF3B3B` 픽셀 **0**
- [ ] 판정창·점수·스침·히트박스·물리 **무변경**

---

## 판정 / 규칙

**변경 없음** (비행 VFX만). Judgment / score / graze 불변.

## 프로그래머용 메모

```
HAZE_ENABLED_IF_FIRE   = true
HAZE_ZONE_PX_MIN/MAX   = 40 / 80
HAZE_DISPLACE_PX_MAX   = 1.5
HAZE_ALPHA_MAX         = 0.16
HAZE_APPROACH_FAR      = 0.25
HAZE_APPROACH_MID      = 0.55
HAZE_APPROACH_NEAR     = 0.85   // of cap; hard ceiling
HAZE_FADE_MS           = 80
HAZE_SEAM_PEAK_DIM     = 0.55
HAZE_LOW_END_RIM_PX    = 1
FORBIDDEN_HEX          = #FF3B3B
USE_WEBGL              = false
```

- 판정 함수·히트박스·점수식에 haze 파라미터 **넣지 말 것**.
- 팔레트: BG `#081329` · 크림 `#F7F3E8` · 코랄 `#FFAB88` `#FF986E` `#FF5A2A` · 앰버/골드 · 민트 `#9BFFE6` · 퍼플 보조.

## 근거
`design/research/ideas-batch-20260924-pm.md` TOP1 · `design/research/refs-20260924-pm.md`  
관련(직교): `ball-seam-spin-tell-v1.md`, `ball-shadow-depth-cue-v1.md`, `heedong-fire-eye-tell-v1.md`, `fire-telegraph-refs-v1.md`
