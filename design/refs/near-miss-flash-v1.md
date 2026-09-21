# Near-miss 아슬아슬 · NEAR MISS FLASH v1

파일: `design/assets/near-miss-flash-v1.png`

## 목표
패리 타이밍이 아슬아슬할 때(early/late 근처) 긴장감. 풀 회피·스침보다 짧게.

## vs 구분
| 이벤트 | 텍스트 | 길이 | 톤 |
|--------|--------|------|-----|
| 불꽃 회피 | `회피!` | ~0.7s | 보상 |
| 불꽃 스침 | `스침 +N` | ~0.5s | 가벼운 보상 |
| Near-miss | `아슬아슬!` | 0.18–0.22s | 긴장 |

## 레이어
1. edge vignette pulse (코랄/레드 스크린 가장자리)
2. motion blur slash + 작은 스파크
3. `아슬아슬!` pop & shake (코랄)
4. sweat drop (옵션)

## 구현
- hitstop 없음
- 사운드: 짧은 tick / whoosh
- portrait-safe, 중앙 텍스트만 크게
