# refs — 2026-09-30 AM 디자인 루틴 (11:08)

VFX 신규 시안 **일시 정지**(Director: Perfect impact 프로그래머 큐 ④ 선적 전까지 레퍼런스만). A~E 완료·중복 스킵. 9/29 evening(GoW·Halo 패리 VFX / itch Boss Fight UI Pack) · ideas `refs-20260930-am.md`(스코어보드·PB 델타·라이저)과 **다른** 외부 링크 2개.

## Used

1. https://www.gamedeveloper.com/design/bossgame-the-final-boss-is-my-heart  
   - 한줄: 2022-11 — Bossgame(모바일): 이동 없이 보스 중앙·캐릭터별 UI 사이드; 배경·공격 궤적·파티클은 **남은 공간**에만 배치. 보스당 normal/power/flashy 3패턴 템포.  
   - 희동이 적용: 세로 모바일에서 희동이·존·HUD가 차지한 뒤 **Perfect impact·트레일·더스트는 중앙 타격 레인만** 쓰고 엄지 존·칩과 겹치지 않게(시안 추가 없음·큐 ④ 선적 후 레이아웃 점검용).

2. https://simvx.com/docs/examples/features_2d_juice.html  
   - 한줄: SimVX juice 데모 — shake / hitstop(~0.12s wall-clock) / target punch / flash / particles 5층을 ON/OFF로 분리; punch는 **이전 코루틴 kill 후 재시작**으로 드리프트 0.  
   - 희동이 적용: Perfect impact(큐 ④) 스택 점검 — 승인된 네이비/크림 임팩트프레임 + 히트스톱·플래시·파티클·(주차) FOV 줌을 **접촉 프레임 동기**; 연속 Perfect 시 줌/펀치 kill-restart 규칙 유지.

## Mentioned / not TOP

- https://estebandiazf.artstation.com/store/W3l9J/free-2d-impact-fx — 무료 2D impact 스프라이트시트(8×8·~1s); 웹 파티클 예산 비교용만.
- https://www.artstation.com/artwork/QXo1P8 — MLB clutch hit baseball UI(프리미엄 스포츠 HUD 톤); 결과/클utch 슬롯 맥락만.

## Context

- VFX 시안 정지 · Perfect FOV 줌 주차: 메모리 2026-09-29 · `perfect-fov-zoom-punch-v1` parked
- 9/29 evening 레퍼만: `refs-20260929-evening.md`
- ideas AM(스코어보드·PB 델타): `refs-20260930-am.md` · `defeat-pb-delta-line-v1` (이미 시안 있음)
- A~E 에셋 완료: `fire-pitch-telegraph-vfx-v1` · `perfect-gold-trail-vfx-v1` · `stadium-bg-v2*` · characters/screens UI chips

## 시안

- 이번 슬롯 **신규 PNG 없음**(정지 준수). 레퍼런스만: 본 파일.
