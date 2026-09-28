# refs — 2026-09-28 midday

릴리즈·존 집중 DoF(pitch-release-dof-focus-v1)용. AM 배치의 Showzone / Operation Sports와 **다른** 외부 링크 우선.  
※ 본 시안 = **AM 러너업**(ideas-batch Hitting DoF)을 한낮 모크업으로 실행. **③ 불꽃 Hold/Charge는 만들지 않음.**

## Used

1. https://www.u4n.com/news/mlb-the-show-26-depth-of-field-key-features-and-benefits.html  
   - 한줄: MLB The Show 26 Hitting DoF — 배경 블러로 시각 노이즈↓, 릴리즈·공 추적 가독↑, 옵션 토글·프레임 패치 맥락(2026-09).  
   - 희동이 적용: 접근 중만 소프트 배경 블러로 **투수 손·공·존**을 띄움. 풀타임 시네마 DoF 금지 · reduce-motion=OFF · 모바일 GPU는 다운샘플 블러.

2. https://findmysourcecode.com/blur-background-unity-2d-effect/  
   - 한줄: 2D/모바일에서 배경만 소프트 블러해 전경 초점·가독성을 올리는 레이어 분리 패턴(로직 불변, 성능·강도 조절 강조).  
   - 희동이 적용: 캔버스 게임이라 **배경 레이어만** 블러하고 HUD·판정 칩·공은 샤프 유지. 셰이더 없이도 저해상 캡처→블러→합성으로 동일 의도.

## Context (AM과 동일·재인용 OK)

- https://showzone.gg/news/mlb-the-show-26-gameplay-feature-premiere-breakdown — AM 러너업 원출처(Hitting DoF). 한낮에 시안화.
- https://www.operationsports.com/mlb-the-show-26-best-camera-and-control-options-for-hitting/ — 타격 카메라/DoF 옵션 맥락(AM 언급).

## 시안 링크 (Director · 한낮)

- 릴리즈·존 집중 DoF: [`design/refs/pitch-release-dof-focus-v1.md`](../refs/pitch-release-dof-focus-v1.md) · 보드 `design/assets/pitch-release-dof-focus-v1.png`
- 아이디어 배치: [`ideas-batch-20260928-am.md`](ideas-batch-20260928-am.md) 러너업(Hitting Depth of Field)
