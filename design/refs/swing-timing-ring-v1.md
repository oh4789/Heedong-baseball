# 스윙 타이밍 존 링 v1

## 시안
- `design/assets/swing-timing-ring-v1.png`
- 크롭: (1) EARLY 링 (2) PERFECT 링+플래시 (3) LATE 점선 링 (4) 칩 3종
- 헥스: `#8AFDCB` `#CAFFAC` `#FFE09A` `#FF7A45`
- 규칙: Perfect 타원만 강한 플래시. Early/Late는 링·칩만.
- 매핑: zone proximity / perfect ellipse (기존 getPerfectZone)

## 칩
- EARLY mint · PERFECT gold · LATE coral — 화면 가장자리 0.5s
