# 공기 휘즈 패스바이 · AIR WHIZZ PASS-BY v1

파일: `design/assets/air-whizz-passby-v1.png` (시안 보드 라벨 한글 · **1600×900**)

## 목표
니어미스·불꽃 회피 성공 시 **Doppler whizz 오디오**와 맞추는 **pass-by 공기 왜곡(스트릭) 모션 시트**.  
프로그래머가 오디오 + (옵션) 비주얼을 같이 붙일 수 있게 타이밍·강도·분리를 고정한다.  
**판정 박스·창·engine·점수·스침 규칙 불변**.

근거: `design/research/ideas-batch-20260924-am.md` **TOP2** · `design/research/refs-20260924-midday.md`

---

## 타이밍 표 (ms · 최근접=0 권장, 또는 접근 시작=0)

| 프레임 | 상태 | ms (접근=0) | 비주얼 | 오디오 |
|--------|------|-------------|--------|--------|
| 1 | approach | **0–40** | 민트/크림 스트릭 약함 | pitch **↑** 시작 |
| 2 | closest | **40–70** | 스트릭·공기 오벌 **피크** | vol **최대** · whizz 트리거 |
| 3 | pass | **70–110** | 스트릭이 공보다 앞서며 밀림 | pitch **↓** Doppler |
| 4 | settle | **110–150** | 잔광 페이드 | 종료 |

합계 체감 **80–150ms**.

| 티어 | 권장 길이 | 볼륨/스트릭 |
|------|-----------|-------------|
| **불꽃 회피 성공** | **≈120ms** | 강 · 민트 굵은 스트릭 + (옵션) 약한 코랄 림 |
| **일반구 아슬아슬(Miss근접)** | **≈85ms** | 약 · 크림/민트 얇은 선만 · 코랄 림 없음 |

- 트리거: 비행 중 **최근접 후 거리 증가** 프레임 (투구 전 windup VO와 분리).
- 다구: 최근접 **1발만** · 볼륨 캡 · 짧은 게이트(~90ms)로 중복 방지.
- mute / `prefers-reduced-motion` → 무음 + 스트릭 OFF. mood(응원 레인) OFF여도 whizz 유지 가능.

---

## 권장 크롭 / 스프라이트

보드: `design/assets/air-whizz-passby-v1.png` · **1600×900** (16:9)

| 용도 | 권장 크롭 / 사이즈 | 메모 |
|------|-------------------|------|
| 타임라인 4프레임 스트립 | 상단 패널 · **1480×300** (@1x 보드 기준) / 런타임 레퍼 **960×200** (@2x) | approach→settle 모션 레퍼런스 |
| 공기 스트릭 스프라이트 (약) | 프레임1 옆선 · **128×64** (@2x) | 크림/민트 얇은 선 |
| 공기 스트릭 스프라이트 (강) | 프레임2 피크 · **160×80** (@2x) | 민트 + 약한 왜곡 오벌 베이크 |
| 통과 잔광 | 프레임3–4 · **128×48** (@2x) | 알파 페이드용 |
| A/B 강도 비교 컷 | 패널 A · 각 **280×200** | Director 리뷰 |
| Doppler 곡선 컷 | 패널 B · **440×280** | 오디오 동기 문서용 |
| 갤러리/문서 | 보드 전체 **1600×900** | index / PR |

런타임은 셰이더 없이 **스트릭 스프라이트 1–2장 + 알파/스케일**로 충분. 위협 빨강 `#FF3B3B` **금지**.

---

## vs 기존 에셋 (중복 금지)

| 에셋 | 역할 | 본 시트 |
|------|------|---------|
| `near-miss-flash-v1` | 비네트·「아슬아슬!」칩·긴장 플래시 | **공기 통과 왜곡만** — 칩/비네트 없음 |
| `fire-graze-vfx-v1` | 스침 스파크·점수 칩 | **점수/스침 미연결** — pass-by만 |
| `fire-dodge-juice-v1` | 회피 성공 보상 플래시/juice | **보상 UI 아님** — whizz 동기 레이어 |

본 시트 = **PASS-BY air distortion timing synced to whizz**. 스코어 칩·비네트 플래시와 분리.

---

## 팔레트
- BG `#081329` · 크림 `#F7F3E8` · 민트 `#9BFFE6` · 코랄 `#FFAB88` / `#FF986E` · 퍼플 보조  
- **`#FF3B3B` 사용 금지** (회피 위협 텔과 혼동)

---

## 프로그래머 메모

```
WHIZZ_TOTAL_MS_FIRE   = 120   // 80–150 밴드
WHIZZ_TOTAL_MS_NEAR   = 85
WHIZZ_APPROACH_MS     = 40
WHIZZ_CLOSEST_MS      = 30    // peak window
WHIZZ_PASS_MS         = 40
WHIZZ_SETTLE_MS       = 30–40
STREAK_COLOR_FIRE     = mint + optional soft coral rim
STREAK_COLOR_NEAR     = cream/mint only
JUDGMENT_UNCHANGED    = true
SCORE_UNCHANGED       = true
SEPARATE_FROM         = near-miss-flash | fire-graze | fire-dodge-juice
```

- 오디오: approach pitch↑ / pass pitch↓ (간단 Doppler chirp).  
- 비주얼 옵션: 스트릭 강도 ≈ |피치 변화|; AV 오프셋 **< ~45ms** 권장.  
- 판정 함수·히트박스·스침·점수식에 whizz/스트릭 파라미터 **넣지 말 것**.

---

## QA
- [ ] 4프레임 타이밍이 80–150ms 밴드 안
- [ ] 불꽃≈강/120ms · 일반≈약/85ms 대비 명확
- [ ] 민트·크림 스트릭만 (#FF3B3B 없음)
- [ ] near-miss-flash / graze / dodge-juice와 UI·점수 미겹침
- [ ] mute·RM에서 무음·스트릭 OFF
- [ ] 판정·점수·스침 **무변경**

---

## 판정 / 규칙
**변경 없음** (오디오 + 옵션 비주얼 juice만).

## 근거
`design/research/ideas-batch-20260924-am.md` TOP2 · `design/research/refs-20260924-midday.md`  
관련(직교·중복 금지): `near-miss-flash-v1.md`, `fire-graze-vfx-v1.md`, `fire-dodge-juice-v1.md`
