# 인게임 HUD 폴리시 · PLAY HUD v1

파일: `design/screens/play-hud-polish-v1.png` (alias: `hud-polish-v1.png`)

## 목표
플레이 중 한눈 가독 — 보스바·콤보·하트만 크게, 나머지 메타는 작게.

## 스펙
- **보스바**: 높이 10–12px, 그라데이션 `#316DFF → #AB90FF`, 숫자 `120/120` tabular, 이름 `희동이 NO.5` + coral `BOSS` 태그
- **콤보**: italic 금 `#FFE597`, 숫자 강조 (`12 COMBO`)
- **하트**: 코랄 ♥ 3개, 터치 영역과 겹치지 않게 하단 좌측
- **상태**: `스윙 준비` mint + `PERFECT n` 작은 칩
- **쿨바**: mint 그라데이션 얇은 바
- **탭 타겟**: 사운드/일시정지 원형 ≥44px

## 팔레트
`#0B1320` · `#1A2340` · `#316DFF` · `#AB90FF` · `#FFE597` · `#7DFFC1` · `#FF986E`

## 구현 팁
- 숫자만 tabular nums / monospace에 가깝게
- 콤보는 중앙이 아니라 하트 옆·아래 한 덩어리로 묶어 시선 분산 줄이기
- 팁/코칭 문구는 최하단 muted, 플레이 방해 금지
