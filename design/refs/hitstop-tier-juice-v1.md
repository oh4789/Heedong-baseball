# 히트스톱 3단 juice · HITSTOP TIER v1

파일: `design/assets/hitstop-tier-juice-v1.png`

## 목표
타이밍 등급(PERFECT / GOOD / MISS)별 **히트스톱·플래시 강도만** 구분. **판정 윈도우·히트박스 변경 없음**.

## 티어
| 등급 | 히트스톱 | 비주얼 채널 | 느낌 |
|------|----------|-------------|------|
| MISS | 0ms | 코랄 `#FF7A6E` 연기 + 약한 비네트 | 무게 없음 |
| GOOD | ~30ms | 민트 `#A8E8FF` 링 + 크림 스파크 | 가벼운 thud |
| PERFECT | ~100ms | 금 `#FFE09A`/`#FFD25B` 선버스트 + 퍼플 액센트 `#C3A4FF` | 묵직한 임팩트 |

## 프로그래머용
- 권장 크롭: 각 티어 패널 중앙 이펙트만 256–512px 투명 PNG (보드 전체 말고 플로팅 버스트)
- 앵커: 히트 지점(공·배트 접촉) 월드/스크린 좌표
- Perfect 금빛 트레일·near-miss 코랄과 채널 유지 — 히트스톱은 「무게」, 트레일/near-miss는 「궤적/아슬」
- reduced-motion: 프리즈 생략, 플래시 1프레임만

## 팔레트
`#081329` `#F5E6C8` `#FFE09A` `#FFD25B` `#A8E8FF` `#C3A4FF` `#FF7A6E`
