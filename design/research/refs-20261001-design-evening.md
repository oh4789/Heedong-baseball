# refs — 2026-10-01 evening 디자인 루틴 (17:08)

VFX 신규 시안 **일시 정지**(Director: Perfect impact 프로그래머 큐 ④ 선적 전까지 레퍼런스만). A~E 완료·중복 스킵. 오늘 design-am(Super Galactic Baseball·Sekiro/Sifu 패리 등급) · ideas PM(웨어·패배 래더·글러브 크릭) · 9/30 evening(Bossgame hold·Neon Boss Fight UI)과 **다른** 외부 링크 2개.

## Used

1. https://tavryx.itch.io/kapowfx  
   - 한줄: 2026 — KapowFX(Godot 4, 웹/모바일 호환): `hitstop(0.06)`·`shake`·`flash`·`impact_spark`/`shockwave`/`hit_burst`를 한 줄 API로 접촉점에 동기; 임팩트는 짧고 재색칠 가능·스프라이트시트 없음.  
   - 희동이 적용: 큐 ④ Perfect impact 스택 점검 — 승인된 네이비/크림 임팩트프레임 + 히트스톱(~60ms)·짧은 플래시·접촉점 버스트를 **한 프레임 동기**; Good는 층↓(프리즈·풀 버스트 OFF/½). 판정·코드 변경 없이(시안 추가 없음).

2. https://mtw1man2.itch.io/impact-juice-combat-polish-bundle-hit-vfx-combat-ui-sfx-game-feel-assets  
   - 한줄: Impact Juice Combat Polish Bundle — hitstop·shake·flash·VFX·popup·SFX **타이밍 레시피** + parry/crit 임팩트·보스 텔레그래프·콤보/히트스톱 칩이 한 묶음(Neon/Boss Fight UI Pack과 별축).  
   - 희동이 적용: Perfect vs Good 피드백을 **시각+짧은 처프/햅틱 티어**로 맞출 때 타이밍 페어링 체크리스트로 사용; 세로 모바일에서 중앙 타격 레인 밖에서도 등급이 읽히게(시안 추가 없음·큐 ④ 선적 후 juice 점검용).

## Mentioned / not TOP

- https://gamineai.com/blog/top-down-combat-vfx-readability-2026-color-timing-system-busy-screens — 4-lane VFX 가독성(이미 `refs-20260923-pm.md` → 스킵).
- https://mtw1man2.itch.io/godot-4-boss-fight-readability-system-boss-hud-telegraphs-phase-indicators — 보스 HUD·페이즈(Neon/Boss Fight UI와 인접 → 맥락만).

## Context

- VFX 시안 정지 · Perfect FOV 줌 주차: 메모리 2026-09-29 · `perfect-fov-zoom-punch-v1` parked
- 오늘 AM 디자인 레퍼: `refs-20261001-design-am.md`
- 오늘 PM ideas 레퍼: `refs-20261001-pm.md`
- 어제 evening 레퍼: `refs-20260930-evening.md`
- A~E 에셋 완료: `fire-pitch-telegraph-vfx-v1` · `perfect-gold-trail-vfx-v1` · `stadium-bg-v2*` · `heedong-boss-start-closeup-v1` · result/UI chips
- Director 락(최근): `defeat-pb-delta-line` — programmer queue still deferred until Perfect impact

## 시안

- 이번 슬롯 **신규 PNG 없음**(정지 준수). 레퍼런스만: 본 파일.
