# refs — 2026-10-02 AM 디자인 루틴 (11:11)

VFX 신규 시안 **일시 정지**(Director: Perfect impact 프로그래머 큐 ④ 선적 전까지 레퍼런스만). A~E 완료·중복 스킵. 어제 evening(KapowFX·Impact Juice Combat Polish) · 어제 design-am(Super Galactic Baseball·Sekiro/Sifu 패리 등급) · ideas `refs-20261002-am.md`(배터 박스 dig-in/초크·재도전 CTA·배트-흙 탭)과 **다른** 외부 링크 2개.

## Used

1. https://codingquests.io/godot-game-feel-lab  
   - 한줄: Coding Quests — Godot Game Feel Lab: 히트스톱은 **파이터만** 정지하고 스파크·카메라 쉐이크·플로팅 숫자는 계속; 전역 `time_scale=0`은 드롭드 프레임처럼 읽힘. 라이트~헤비에 `weight` 하나로 hitstop·shake·knockback을 스케일(헤비 프리즈 ≤~0.2s).  
   - 희동이 적용: 큐 ④ Perfect impact 스택 점검 — 승인된 네이비/크림 임팩트프레임 + 히트스톱·플래시·접촉점 파티클을 **접촉 1프레임 동기**하되, 공·배트 외 juice(버스트·쉐이크)는 프리즈에 묶지 않기; Good는 weight↓(프리즈·풀 버스트 OFF/½). 판정·코드 변경 없이(시안 추가 없음).

2. https://godboyhappy.itch.io/cleave-melee-impact-weapon-vfx  
   - 한줄: 2026 — CLEAVE(Melee Impact & Weapon VFX): 임팩트는 **프레임1 최밝·급감쇠**(≈80ms 시청); 방어/패리는 **색상(시안-그린)으로만** 구분(형태는 너무 느림); 크리티컬은 **색+형태 둘 다** 바꿔 일반 강타와 분리.  
   - 희동이 적용: Perfect vs Good 세로 모바일 가독 — Perfect=크림/골드 플래시+형태 강조(이중 링·강한 버스트), Good=약한 접촉 스파크·형태 동일·층↓; 방패/미스와 색 채널 분리 점검용(시안 추가 없음·큐 ④ 선적 후 juice 티어 리뷰).

## Mentioned / not TOP

- https://shane-sicienski.com/blog/blog-post-title-one-55pmn — Capcom 아케이드 비트엠업 hitstop(공격자·피격자만 정지·기타 오브젝트 계속; 공격별 4–11f). Used #1과 같은 ‘선택적 프리즈’ 축 → 맥락만.
- https://mtw1man2.itch.io/combat-feedback-timing-presets-hitstop-camera-shake-sfx-recipes — hitstop·shake·flash 타이밍 레시피(어제 evening Impact Juice Bundle과 인접 → 스킵).

## Context

- VFX 시안 정지 · Perfect FOV 줌 주차: 메모리 2026-09-29 · `perfect-fov-zoom-punch-v1` parked
- 어제 evening 레퍼: `refs-20261001-design-evening.md`
- 어제 AM 디자인 레퍼: `refs-20261001-design-am.md`
- 오늘 ideas AM 레퍼(별축): `refs-20261002-am.md`
- A~E 에셋 완료: `fire-pitch-telegraph-vfx-v1` · `perfect-gold-trail-vfx-v1` · `stadium-bg-v2*` · `heedong-boss-start-closeup-v1` · result/UI chips
- Director 락(최근): `defeat-pb-delta-line` — programmer queue still deferred until Perfect impact

## 시안

- 이번 슬롯 **신규 PNG 없음**(정지 준수). 레퍼런스만: 본 파일.
