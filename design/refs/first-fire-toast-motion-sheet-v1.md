# 첫 불꽃 토스트 모션 시트 · FIRST-FIRE TOAST MOTION v1

파일: `design/assets/first-fire-toast-motion-sheet-v1.png` (1280×720)

## 목표
`first-fire-intro-toast-v1` 카드의 **등장·유지·퇴장** 4프레임 가로 시트.  
카피·판정·회피 규칙 불변. 연출(스케일/투명도)만.

## 프레임 (좌→우)

| # | 상태 | 타이밍 | 비주얼 |
|---|---|---|---|
| 1 | IDLE | ~0ms | 고스트 아웃라인, opacity≈0, scale tiny |
| 2 | POP | ~150ms | scale 0.88→1.06 soft overshoot, 파이어코랄 림 글로우↑ |
| 3 | HOLD | ~1.4s | scale 1.0 settle, 풀 오파시티, 불꽃 아이콘 미세 펄스 |
| 4 | FADE | ~200ms | opacity→0 (~0.35 중간키), 살짝 위로 뜨며 페이드 |

합계 가시 구간 ≈ **1.75s** (pop+hold+fade). spawn은 **첫 불꽃 windup 1회만**.

## 프로그래머용 크롭·익스포트
- 시트 전체: `assets/first-fire-toast-motion-sheet-v1.png` (모션 레퍼런스)
- 런타임 카드: `first-fire-intro-toast-v1`과 동일 — **720×280** (@2x, 투명 BG). 아이콘 overhang 시 **720×340**
- 애니 채널: `scale` + `opacity`만 (GPU-safe). 위치는 mid-upper(Y 22~28%), 하단 CTA SAFE 미침범
- reduced-motion: pop/fade를 **1프레임 스냅** 또는 opacity만 120ms

## 팔레트 (v1 토스트와 동일)
- BG `#081329` · 크림 `#F5E6C8` · 파이어코랄 `#FF7A6E` · 딥파이어 `#FF5A2A` · 앰버 `#FFAB88`
- 골드/퍼플 축하 톤 금지 (`title-unlock-toast-v1`과 구분)

## 비고
- 판정/코드 규칙 변경 금지
- 근거 레퍼런스: `research/refs-20260923-am.md`
- 정적 시안: `assets/first-fire-intro-toast-v1.png` · 스펙 `refs/first-fire-intro-toast-v1.md`
