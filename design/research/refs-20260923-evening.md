# 디자인 레퍼런스 · 2026-09-23 저녁(17:08 루틴)

오전(토스트 모션)·오후(피격 플래시·VFX 4레인·공 그림자)와 **다른** 주제: **고정점 스냅샷 베이트 텔** (hold-aim → 투구 순간 lock · mid-flight 호밍 없음).

## 1. Targeted strike lock-at-cast — Godot 4 Boss Attack System (Template Foundry)
- 링크: https://mtw1man2.itch.io/godot-4-boss-attack-system
- 한 줄: 6종 보스 텔 중 **Targeted strike**는 경고가 뜨는 순간 타겟 좌표를 잠그고, 캐릭터가 움직여도 경고 영역을 재추적하지 않는다.
- 희동이 적용점: `aimLockFire`도 windup/투구 직전 **lockX 스냅샷**만 — 비행 중 레인·공 재조준 금지. 민트 펄스(0.15s)가 ‘여기가 잠긴 점’ 신호.

## 2. Fixed-direction bullet vs real-time track — Cerberus Skill AI Design (Huijie Bao)
- 링크: https://www.zzhxbhj.com/cerberus-skill-ai-design
- 한 줄: Fire Ball은 시전 프레임의 어그로 좌표로 **고정 방향 불릿**, Ice Cone만 실시간 추적 — 두 계열을 명시적으로 분리한다.
- 희동이 적용점: Soft Heat tracker(시간/스톨 추적)와 aim-bait(공간 고정)를 **직교**로 유지. 보드 라벨 「호밍 없음」·패널 B(옆으로 피하면 빗나감)가 그 차이의 가시화.

## 시안
- ✅ `design/assets/aim-lock-bait-fire-v1.png`
- ✅ `design/refs/aim-lock-bait-fire-v1.md` (비주얼/크롭 섹션 추가)
