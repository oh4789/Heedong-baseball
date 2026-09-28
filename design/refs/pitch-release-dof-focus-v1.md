# 릴리즈·존 집중 DoF · v1 (pitch-release-dof-focus-v1)

파일: `design/assets/pitch-release-dof-focus-v1.png` (시안 보드 · 라벨 한글 · **1600×900** · `#FF3B3B` 0px)

## 목표
투구 **접근 중**에만 배경(관중·스카이라인·스탠드)을 소프트 블러해 **투수 릴리즈 손 · 비행 공 · 스트라이크존/플레이트**에 시선을 모은다.  
MLB The Show식 Hitting Depth of Field를 모바일 캔버스에 축소 적용한 **비주얼 폴리시**.  
**판정·점수·engine 불변** (히트박스·창·투구 확률·스침·점수식 손대지 않음).

근거: `design/research/ideas-batch-20260928-am.md` 러너업(Hitting DoF) · `design/research/refs-20260928-midday.md` · Director 9/28 한낮.

---

## 언제 ON / OFF

| 상태 | 동작 |
|------|------|
| **ON** | 릴리즈 직전~접근 구간만. 권장: **릴리즈 −40ms ~ 접촉 −80ms** (또는 `b.t` 접근 밴드). ease-in ~60ms / ease-out ~80ms. |
| **OFF (필수)** | 와인드업·settle/fidget · 판정 확정 후 juice · 회피 성공 연출 · 결과/토스트 · 메뉴 |
| `prefers-reduced-motion` | **DoF OFF** (대체 틴트도 기본 OFF 권장) |
| 저사양 / `depthCueLite()` | 라이브 블러 대신 **약한 네이비 비네팅+채도↓**만, 또는 완전 OFF |
| 유저 옵션 | 카메라/그래픽에 **「릴리즈 집중 블러」** 토글 (기본값 A/B — 모바일 GPU면 기본 OFF도 OK) |

Hard 제외와 충돌 없음: Hold/Charge 텔 · Miss 방향 임펄스 · 열왜곡 · 애프터이미지 **미포함**.

---

## 블러 반경 제안

| 항목 | 값 |
|------|-----|
| 논리 폭 | 게임 좌표 **480** 기준 |
| 배경 Gaussian | **≈4–8px** (보드 시안 ≈7px @720폭 패널 ≈ 논리 4–6px) |
| 모바일 경로 | 배경을 **×0.5 다운샘플 → 블러 → 업스케일** (풀스크린 고반경 금지) |
| 포커스 샤프 | 투수 손/상체 릴리즈 · 공 · 존 박스 · 플레이트 · (옵션) 타자 실루엣 |
| 과블러 | 금지 — 멀미·구장 분위기 손실. 상한 **8px** @480 |

---

## 레이어 (아래 → 위)

```
1. 배경 스프라이트/스카이라인/관중     ← DoF 블러 대상
2. (옵션) 약한 네이비 틴트 0–18%       ← 블러와 함께만
3. 희동이(투수) 본체 · 릴리즈 손       ← 샤프
4. 비행 공 · 비행 트레일               ← 샤프 (트레일은 기존 ball-flight-trail-v1)
5. 존/플레이트 가이드                  ← 샤프
6. 타자 · 배트                         ← 샤프(권장) 또는 아주 약한 블러
7. HUD / 콤보칩 / 토스트               ← 항상 샤프 (블러 제외)
8. 임팩트·회피 juice                   ← DoF는 이미 OFF
```

캔버스 구현 힌트(시안용): 배경만 오프스크린에 그린 뒤 `filter: blur()` 또는 다운샘플 박스블러 → 샤프 레이어를 그 위에. **판정 함수에 블러 파라미터 넣지 말 것.**

---

## 권장 크롭 (구현자)

보드: `design/assets/pitch-release-dof-focus-v1.png` · **1600×900** (16:9)

| 용도 | 권장 크롭 | 메모 |
|------|-----------|------|
| OFF 레퍼런스 | 좌 패널 씬 ≈ **720×460** (@보드) | 평탄 대비 |
| ON 레퍼런스 | 우 패널 씬 ≈ **720×460** | 포커스 링·콜아웃 포함 |
| 포커스 타원 가이드 | ON 중앙 세로 타원 ≈ **280×420** | 릴리즈→존 코리도 |
| 스펙 스트립 | 하단 3열 ≈ **1550×240** | PR/갤러리 |
| 갤러리/문서 | 전체 **1600×900** | index / Director 핸드오프 |

런타임 스프라이트 베이크 불필요 — **절차적 블러 + 레이어 분리**로 충분.

---

## reduce-motion · GPU

- `prefers-reduced-motion: reduce` → DoF **강제 OFF**.
- GPU: 매 프레임 풀해상 가우시안 금지. 다운샘플·저빈도(블러 맵 2–3프레임 유지) 허용.
- 광과민: 블러 자체는 플래시 아님. 강도 펄스/깜빡임 **금지**.
- 멀미: 블러 반경·시프트가 카메라 킥과 동시에 크게 변하지 않게 — Trauma/Miss 임펄스와 **시간 분리**(본안은 접근 중만).

---

## 프로그래머 메모

```
DOF_ON_WINDOW_MS     = release-40 → contact-80   // approach only
DOF_EASE_IN_MS       = 60
DOF_EASE_OUT_MS      = 80
DOF_BLUR_PX_LOGICAL  = 4..8                      // @480 width
DOF_DOWNSAMPLE       = 0.5                       // mobile path
DOF_FOCUS_LAYERS     = pitcherRelease | ball | zone | plate
DOF_BLUR_LAYERS      = stadiumBg | crowd | skyline
REDUCE_MOTION        = OFF
JUDGMENT_UNCHANGED   = true
SCORE_UNCHANGED      = true
ENGINE_UNCHANGED     = true
HARD_EXCLUDED        = holdChargeTell | missDirectionalImpulse
```

---

## QA

- [ ] OFF/ON 대비에서 릴리즈·공·존만 선명, 배경만 소프트
- [ ] 와인드업·결과 구간 DoF OFF
- [ ] reduce-motion / 저사양 경로 OFF 또는 비네팅만
- [ ] HUD·토스트 블러되지 않음
- [ ] 판정·점수·engine **무변경**
- [ ] Hold/Charge·Miss 임펄스 미포함
- [ ] `#FF3B3B` 미사용

---

## Director 핸드오프

- 에셋: `/workspace/heedong-game/design/assets/pitch-release-dof-focus-v1.png`
- 스펙: `/workspace/heedong-game/design/refs/pitch-release-dof-focus-v1.md`
- 리서치: `/workspace/heedong-game/design/research/refs-20260928-midday.md`
- 시안만 · 구현 대기. AM TOP1/TOP2와 직교(비행 트레일·임팩트 프레임과 채널 분리).
