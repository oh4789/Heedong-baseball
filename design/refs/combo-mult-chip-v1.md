# 연타 ×N HUD · COMBO MULT v1

파일: `design/assets/combo-mult-chip-v1.png`

## 목표
콤보 배율을 작은 칩으로. 리셋 시만 흔들림.

## 상태
- idle: `×N` 금 `#FFE09A` 글로우
- hot (고콤보): 코랄 림 `#FF986E`
- reset: `×1` 뮤트 + 좌우 흔들림 1회

## 구현
- 위치: 콤보 숫자 옆 또는 바로 아래, 터치 영역 비침범
- 애니메이션: scale pop on increase / shake on reset only
