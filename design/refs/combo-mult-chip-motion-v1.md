# 연타 배율 칩 모션 · COMBO MULT CHIP MOTION v1

## 목적
정적 HUD 칩 `combo-mult-chip-v1`에 **증가 pop · hot settle · 리셋 shake** 모션만 추가한다.  
배율 값·점수식·판정창·불꽃 규칙 불변. 연출(scale / opacity / 위치 흔들림 / 림 색)만.

## 시안
- 보드: `design/assets/combo-mult-chip-motion-v1.png` (1600×900)
- 정적 원본: `design/assets/combo-mult-chip-v1.png`
- 관련: `design/refs/combo-mult-chip-v1.md`

## 프레임 (좌→우)

| # | 상태 | 타이밍 | 비주얼 |
|---|---|---|---|
| A | IDLE | 0ms | ×N 크림 림 `#FFE09A`, scale 1.0, 정적 시안과 동일 |
| B | POP | ~0–120ms | scale **0.92→1.22** overshoot, 이전 × 고스트 1장, 금 스파크 소수 |
| C | SETTLE | ~120–200ms | scale **1.0** easeOutBack, 고콤보(≥4~5)면 림만 코랄 `#FF986E` |
| D | RESET | ~180ms | ×1 뮤트 그레이, **좌우 ±4~6px 1회** shake, pop 금지 |

증가 경로 합계 ≈ **200ms**(pop+settle). 리셋은 별 트리거 ≈ **180ms**.

## 프로그래머용 크롭·익스포트
- 시트 전체: 모션 레퍼런스 (본 PNG)
- 런타임 칩: 정적 v1과 동일 권장 **280×128** (@2x) 또는 **140×64** (@1x), 투명 BG
- POP 순간용 옵션 크롭: 보드 패널 B 중앙 칩+스파크 **360×280** (고스트 포함 가이드)
- 애니 채널: `scale` + `opacity`(고스트) + `translationX`(리셋만). 림 색은 tint/outline
- 위치: 기존 콤보 숫자 옆/아래 — 터치 SAFE 미침범
- 시간: **unscaled** 권장(히트스톱과 독립)
- reduced-motion: pop/shake OFF → 숫자·림 색 1프레임 스냅

## 기존 에셋과 차이
| 에셋 | 역할 | 본 시트 |
|---|---|---|
| `combo-mult-chip-v1` | 정적 idle/hot/reset 비주얼 | **모션 타이밍·overshoot** 추가 |
| `hitstop-tier-juice-v1` | 히트 지점 플래시·히트스톱 무게 | HUD 칩 채널 — 직교 |
| `perfect-gold-trail-vfx-v1` | Perfect 궤적 트레일 | 배율 칩과 무관 |
| 오늘 AM/PM 불꽃·시임·휘즈 | 구종/회피 텔 | HUD 폴리시 — 직교 |

## 바꾸지 말 것
- 판정 윈도우 · 점수식 · 콤보 배율 **수치 공식**
- EARLY/LATE 라벨 · Miss 방향 임펄스 · Soft Heat / BeatWarp / 페이크아웃
- 불꽃 회피 juice / near-miss 비네트 (별 채널 유지)

## 팔레트
`#081329` · `#FFE09A` · `#FFD25B` · `#FF986E` · `#C3A4FF` · `#F7F3E8`

## 근거 레퍼런스
- `design/research/refs-20260924-evening.md`
