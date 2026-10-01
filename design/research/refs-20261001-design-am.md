# refs — 2026-10-01 AM 디자인 루틴 (11:08)

VFX 신규 시안 **일시 정지**(Director: Perfect impact 프로그래머 큐 ④ 선적 전까지 레퍼런스만). A~E 완료·중복 스킵. 9/30 evening(Bossgame hold·햅틱 / itch Neon Boss Fight UI) · 9/30 design-am(Bossgame 레이아웃·SimVX juice) · ideas `refs-20261001-am.md`(idle 강도·호흡·배트 후시)과 **다른** 외부 링크 2개.

## Used

1. https://rodrigogarciabenedictedev.com/super-galactic-baseball-defense/  
   - 한줄: 2025-06 — Super Galactic Baseball Defense: 메테오 파괴 시 **레이어드 포스트·임팩트 VFX·프레임 프리즈·배트 표정·점수 곡선 애니**를 한 순간에 동기; 배트 크기 변화도 SFX/VFX로 엄지 밖에서도 읽히게.  
   - 희동이 적용: 큐 ④ Perfect impact 스택 점검 — 승인된 네이비/크림 임팩트프레임 + 히트스톱·플래시·파티클을 **접촉 1프레임 동기**; Good는 층 수↓(프레임 프리즈·풀 레이어 OFF/½)로 Perfect와 구분(시안 추가 없음).

2. https://medium.com/@gatherer286/song-of-sword-and-fist-sifu-sekiro-and-the-anatomy-of-a-perfect-parry-2f9c4c26867a  
   - 한줄: 2024-04 — Sekiro deflect=큰 스파크+높은 clang, block=약한 스파크+낮은 clang; **화면을 안 봐도** 등급이 구분되고 Sifu의 약한 접촉 플래시만으로는 학습이 느림.  
   - 희동이 적용: Perfect vs Good(·Miss) 피드백을 **시각+짧은 처프/햅틱 티어**로 분리해 세로 모바일에서 중앙 타격 레인 밖을 봐도 등급이 읽히게 — 판정 윈도우·코드 변경 없이(시안 추가 없음·큐 ④ 선적 후 juice 점검용).

## Mentioned / not TOP

- https://www.theseus.fi/handle/10024/900621 — Hades 사례 가독성 휴리스틱(텔 ≥500ms·VFX 가림 ≤10%); Perfect juice 적층 시 존·공 가림 예산 맥락만.
- https://charios.com/blog/shmup-boss-pattern-tells-animation — 애니메이션 텔 300–500ms(이미 `refs-20260928-am.md`에 사용 → 이번 스킵).

## Context

- VFX 시안 정지 · Perfect FOV 줌 주차: 메모리 2026-09-29 · `perfect-fov-zoom-punch-v1` parked
- 어제 evening 레퍼: `refs-20260930-evening.md`
- 어제 AM 디자인 레퍼: `refs-20260930-design-am.md`
- 오늘 ideas AM 레퍼(별축): `refs-20261001-am.md`
- A~E 에셋 완료: `fire-pitch-telegraph-vfx-v1` · `perfect-gold-trail-vfx-v1` · `stadium-bg-v2*` · `heedong-boss-start-closeup-v1` · result/UI chips
- Director 락(최근): `defeat-pb-delta-line` — programmer queue still deferred until Perfect impact

## 시안

- 이번 슬롯 **신규 PNG 없음**(정지 준수). 레퍼런스만: 본 파일.
