# 불꽃 마구 텔레그래프 · 레퍼런스 노트 v1

## 외부 레퍼런스 (짧게)
1. [ZZZ orange/red flashes](https://www.oneesports.gg/zenless-zone-zero/orange-flashes-red-flashes/) — 주황=회피 가능 Perfect Dodge, 빨강=더 강한 위협. **적용:** 불꽃은 직구와 다른 «회피 전용» 색 문법 유지.
2. [Enemy telegraph shape language](https://gamineai.com/blog/enemy-telegraph-shape-language-top-down-boss-fights-fast-visual-consistency-audit-2026) — 색만 말고 형태·펄스·타이밍 사다리. **적용:** 1얇은원 → 2두꺼운원+! → 3불꽃꼬리+점선존.
3. Arknights Endfield dodge (red flash on hit timing) — 와인드업 전체가 아니라 임팩트 직전 강조. **적용:** 단계2~3에서 채도·크기 급상승.

## 시안
- 파일: `design/assets/fire-pitch-telegraph-vfx-v1.png`
- 권장 크롭: 패널별 정사각 또는 링만 추출 (투명 PNG로 쪼개 쓰기)
- 매핑: windup early / late / flight y>420
- 헥스: `#FFC9A8` → `#FF7A45` → `#FF5A2A` (+코어 `#FFD25B`)
