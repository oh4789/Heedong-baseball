# 히트 Juice 예산표 · HIT JUICE BUDGET v1

파일: `design/assets/hit-juice-budget-v1.png` (한글 라벨 보드)

1페이지 레퍼런스. **배트·공 접촉** flash · particle · SFX pitch · short UI grade pop **만** 소유. 판정·점수 공식 불변.

## 예산표 (등급별)
| Grade | Flash | Particles | SFX feel | Short UI pop |
|-------|-------|-----------|----------|--------------|
| **Miss** | none / tiny (≤1f, 불투명도 ≤20%) | micro dust (크림 `#F5E6C8`, 3–6 particles, ≤80ms) | short tick (낮 pitch, 짧게) | **none** |
| **Good** | **1f** cream/mint flash (`#F7F3E8`/`#A8E8FF`) | medium burst (8–14, radial, ~120–160ms) | mid thud | none / weak (선택: 약한 링 1회, 텍스트 없음) |
| **Perfect** | **strong** 1–2f gold (`#FFE09A`/`#FFD25B`) + purple accent `#C3A4FF` | **directional sparks** (스윙 방향, 16–24, ~180–220ms) | bright hit (높은 pitch + 짧은 shimmer) | **short grade effect** — 「PERFECT」스타일 글로우/스케일 pop **만** (점수 숫자 금지 · Early/Late 칩 금지) |

## 타 채널 (이 시트 밖 — 건드리지 않음)
| 채널 | 문서 | 비고 |
|------|------|------|
| Trauma² cam | `perfect-trauma-cam-punch-v1.md` | cam punch / FOV |
| Hitstop | `hitstop-tier-juice-v1.md` | 시간 프리즈·무게 |
| Swing smear | `swing-smear-followthrough-v1.md` | 배트 아크 트레일 |
| Ghost bat | `ghost-bat-silhouette-v1.md` | hold 가이드 |

이 시트 = **contact flash · particle · SFX pitch · grade pop** 만.

## 접근성
**reduce-flash / reduce-shake (또는 reduced-motion)** 켜면 해당 등급 예산 행을 **off 또는 weak**(flash 0–1f · particles ≤4 · UI pop 없음).

## 금지
- **Early / Late 칩** 표시 금지
- 점수·콤보 **숫자**를 grade pop에 넣지 말 것 (숫자는 HUD/스코어 채널)
- 판정 윈도우·히트박스·점수 공식 변경 금지

## 팔레트
`#081329` `#F7F3E8` `#F5E6C8` `#FFE09A` `#FFD25B` `#A8E8FF` `#C3A4FF` `#FF986E`/`#FF7A6E`(Miss dust만 약하게 허용, 회피 텔레그래프 빨강과 혼동 주의)
