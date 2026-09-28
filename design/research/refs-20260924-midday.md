# refs — 2026-09-24 midday

공기 휘즈 패스바이(visual sync · Doppler whizz)용. AM 배치의 CRI / cogconnected와 **다른** 외부 링크 우선.

## Used

1. https://epicstockmedia.com/product/dodge-this/  
   - 한줄: Dodge Pass By Movement·느린 시간 통과 사운드로 ‘총알이 옆을 스치는’ 감각을 설계하는 패스바이 SFX 팩.  
   - 희동이 적용: 불꽃 회피 성공=강한 짧은 whizz(~120ms), 일반 아슬아슬=약한 whoosh(~85ms). Matrix식 장시간 bullet-time이 아니라 **최근접 1샷**만 — Soft Heat·스침 점수와 무관.

2. https://www.audiokinetic.com/qa/1175/how-can-i-create-a-doppler-effects-with-wwise  
   - 한줄: Wwise에서 거리 변화율 RTPC로 피치↑(접근)·↓(이탈) Doppler를 만들고, 최근접에서 피치 급변을 거리로 스무딩하라는 가이드.  
   - 희동이 적용: WebAudio chirp도 동일 곡선 — approach↑ → closest peak → pass↓. 비주얼 스트릭 강도는 |피치 변화|에 동기. 다구·스플릿 리스너 이슈는 모바일 1리스너라 단순화 가능.

## Fallback (AM과 동일·재사용 허용)
- https://blog.criware.com/index.php/2020/11/24/creating-a-projectile-whizz-by-effect-in-atom-craft/ — projectile whizz-by + Doppler / distance AISAC (ideas TOP2 원출처)
- https://cogconnected.com/2026/06/making-gameplay-feel-more-responsive-using-sound/ — dodge/whoosh로 동작·결과 확인 (ideas TOP2)

## 시안 링크 (Director TOP2)
- 공기 휘즈 패스바이: [`design/refs/air-whizz-passby-v1.md`](../refs/air-whizz-passby-v1.md) · 보드 `design/assets/air-whizz-passby-v1.png`
- 아이디어 배치: [`ideas-batch-20260924-am.md`](ideas-batch-20260924-am.md) TOP2
