# refs — 2026-10-02 evening 디자인 루틴 (17:08)

VFX 신규 시안 **일시 정지**(Director: Perfect impact 프로그래머 큐 ④ 선적 전까지 레퍼런스만). A~E 완료·중복 스킵. 오늘 design-am(Godot Game Feel Lab·CLEAVE) · 어제 evening(KapowFX·Impact Juice Combat Polish) · ideas PM(그립 웨어·제로세컨드 리셋·플레이트 탭)과 **다른** 외부 링크 2개.

## Used

1. https://dimensionalmios.itch.io/almios-game-feel-kit  
   - 한줄: 2026 — Game Feel Kit(Godot 4): `Juice.hit(..., "light"|"heavy"|"critical")` 한 줄로 hitstop·trauma shake·directional kick·flash·spark·squash·recoil·플로팅 숫자를 접촉 프레임에 동기; critical 이상은 shockwave·chromatic·radial zoom·manga impact frame. 글로벌 intensity 슬라이더 + shake/flash/hitstop OFF 스위치(접근성).  
   - 희동이 적용: 큐 ④ Perfect impact 스택 점검 — Perfect≈heavy/critical(네이비/크림 임팩트프레임 + 짧은 프리즈·접촉 버스트), Good≈light(프리즈·풀 버스트 OFF/½), Miss/RM=intensity 0 또는 해당 채널 OFF. 주차된 FOV 줌과 radial zoom은 **별축**(위치·회전 고정 유지). 판정·코드 변경 없이(시안 추가 없음).

2. https://gamineai.com/blog/enemy-telegraph-shape-language-top-down-boss-fights-fast-visual-consistency-audit-2026  
   - 한줄: 2026 — 보스 텔레그래프 **형태 언어** 감사: 공격당 primary shape 1개(lane/cone/circle/pulse/path); 처벌 등급별 windup 사다리(저 450–650ms · 중 650–900ms · 고 ≥900ms); 색 의미는 페이즈 간 고정; windup 중 2차 VFX·카메라 쉐이크는 경계선 가림 금지; 무음 리플레이로도 반응 의도 전달.  
   - 희동이 적용: 불꽃/일반/페이크아웃 투구 텔레그래프가 이미 `telegraph-shape-lang-v1`·`fire-pitch-telegraph-vfx-v1`과 형태·색 계약이 맞는지 ④ 선적 후 가독성 리뷰 체크리스트로 사용(시안 추가 없음·판정 창 불변).

## Mentioned / not TOP

- https://obssidian-art.itch.io/obssidian-combat-feel-kit-godot-4 — Light/Medium/Heavy/Boss 프리셋·RM·텔레그래프·페이즈 전환(KapowFX·Game Feel Kit과 인접 → 맥락만).
- https://solana.garden/guides/game-juice-and-feel-explained/ — 티어별 hitstop/shake 표(`refs-20260921-pm.md` → 스킵).
- https://www.gamedeveloper.com/design/what-goes-into-a-good-parry-system- — ULTRAKILL 전역 프리즈·머시 프레임(`refs-20260924-pm`·`refs-20260930-pm` → 스킵).

## Context

- VFX 시안 정지 · Perfect FOV 줌 주차: 메모리 2026-09-29 · `perfect-fov-zoom-punch-v1` parked
- 오늘 AM 디자인 레퍼: `refs-20261002-design-am.md`
- 오늘 PM ideas 레퍼: `refs-20261002-pm.md`
- 어제 evening 레퍼: `refs-20261001-design-evening.md`
- A~E 에셋 완료: `fire-pitch-telegraph-vfx-v1` · `perfect-gold-trail-vfx-v1` · `stadium-bg-v2*` · `heedong-boss-start-closeup-v1` · result/UI chips
- Director 락(최근): `defeat-pb-delta-line` — programmer queue still deferred until Perfect impact

## 시안

- 이번 슬롯 **신규 PNG 없음**(정지 준수). 레퍼런스만: 본 파일.
