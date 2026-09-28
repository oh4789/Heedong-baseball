# 디자인 레퍼런스 · 2026-09-24 저녁(17:08 루틴)

오전(시임·눈빛)·한낮(Doppler whizz)·오후(열왜곡·애프터이미지)와 **다른** 주제: **연타 배율 HUD 칩의 pop / settle / reset 모션**.

오늘 am/midday/pm refs 링크 재사용 없음.

## 1. SEELE — Clicker Game UI (scale pulse · number pop)
- 링크: https://www.seeles.ai/resources/blogs/scratch-clicker-game-ui
- 한 줄: 클릭/증가 피드백을 **100–150ms scale pulse** + 숫자 **1.3× pop** + 소량 파티클로 쌓되, GPU transform(scale/translate)만 쓰는 모바일 UI juice 가이드.
- 희동이 적용점: `combo-mult-chip` 증가 시 scale **0.92→1.22→1.0** (~200ms) + 숫자 교체 동시 프레임. 점수식·배율 공식은 문서(뷰) 쪽 — 애니만 코스메틱.

## 2. UI Juice (Unity) — Scale Punch · Reduce Motion
- 링크: https://marketplace.unity.com/packages/tools/gui/ui-juice-386770
- 한 줄: HUD에 Scale Punch / Color Flash를 스택하고, **Reduce Motion** 시 이동을 끄고 색·페이드만 남기는 모바일향 UI juice 컴포넌트.
- 희동이 적용점: 리셋은 pop 없이 **shake(±4~6px, ~180ms)** 만. reduce-motion이면 색/숫자 스냅만. 히트스톱 중에도 unscaled time으로 칩 애니 유지.

## 시안
- ✅ `design/assets/combo-mult-chip-motion-v1.png`
- ✅ `design/refs/combo-mult-chip-motion-v1.md`
- 정적 원본: `design/assets/combo-mult-chip-v1.png` · `design/refs/combo-mult-chip-v1.md`
