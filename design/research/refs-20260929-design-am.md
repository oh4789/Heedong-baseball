# refs — 2026-09-29 AM 디자인 시안 (Perfect FOV 줌 펀치)

AM TOP① **Perfect FOV 줌 펀치** 시안용. `refs-20260929-am.md`에 이미 있는 Feel MMF_CameraZoom / Game Juice Pro / Saltmire와 **다른** 외부 링크.

## Used (NEW)

1. https://vionixstudio.com/2023/07/03/zoom-camera-in-unity/  
   - 한줄: Unity 2D Orthographic — FOV 속성 없이 `orthographicSize`를 줄이면 줌인.  
   - 희동이 적용: 웹·2D는 ortho size(또는 뷰포트/캔버스 scale)만 6–12% 좁힘; 카메라 position/rotation 고정.

2. https://solana.garden/guides/game-camera-systems-explained/  
   - 한줄: FOV/ortho 줌을 game-feel 도구로 — 짧은 애니메이션(~150–250ms), 2D는 view-rect/ortho size.  
   - 희동이 적용: Perfect 확정만 100–180ms(in/hold/out) 엔벨로프; Good ½ 또는 OFF · Miss OFF.

## Optional pattern (개념)

- 줌 펀치는 **반드시 베이스라인으로 정확 복귀**(드리프트 0). 연속 Perfect 시 이전 트윈 kill 후 재시작. (외부 s&box 링크 불필요 — 구현 규칙으로 충분.)

## Context

- 아이디어 배치 TOP①: [`ideas-batch-20260929-am.md`](ideas-batch-20260929-am.md)
- AM 조사 레퍼(Feel/GJP 등): [`refs-20260929-am.md`](refs-20260929-am.md)

## 시안·스펙 경로

- 에셋: `/workspace/heedong-game/design/assets/perfect-fov-zoom-punch-v1.png`
- 프로그래머 md: `/workspace/heedong-game/design/refs/perfect-fov-zoom-punch-v1.md`
