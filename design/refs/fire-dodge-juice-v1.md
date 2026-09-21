# 불꽃 회피 성공 juice · FIRE DODGE v1

파일: `design/assets/fire-dodge-juice-v1.png`

## 목표
불꽃 마구 회피 성공 시 가벼운 보상감. 히트스톱 무겁게 쓰지 말 것.

## 스펙
- **텍스트**: `회피!` italic, 필 `#FFAB88`, 글로우 `#FF5A2A`, 살짝 기울어 float-up 0.6–0.9s
- **파티클**: 코랄·골드 스파크 `#FF5A2A` `#FFD25B` radial burst
- **링(옵션)**: mint `#9BFFE6` 얇은 바닥 링 1회 확장
- **변형**:
  1. text-only pop
  2. sparks only
  3. `회피! +1` (콤보 가산 시)

## 타이밍
- spawn: 회피 판정 직후
- lifetime: ~0.7s
- hitstop: 없거나 1–2프레임 이하

## 팔레트
`#FFAB88` · `#FF5A2A` · `#FFD25B` · `#9BFFE6`
