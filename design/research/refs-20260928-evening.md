# 디자인 레퍼런스 · 2026-09-28 저녁

AM(트레일·임팩트프레임) · 한낮(DoF) · PM(CA·먼지·플로팅텍스트)과 **다른** 주제:  
**배트·공 로컬 scale 스쿼시·스트레치 스프링 펀치**(카메라 아님).

오늘 am / midday / pm refs 링크 재사용 없음.

## 1. Josh Comeau — Squash and Stretch (spring physics)
- 링크: https://www.joshwcomeau.com/animation/squash-and-stretch/
- 한 줄: 스프링 물리로 squash/stretch를 구동하고, **transform-origin을 접촉 가장자리**에 두면 충격감이 산다.
- 희동이 적용점: 공·배트 로컬 scale만 Bump. origin=접촉면. Perfect 풀 / Good 0.55× / Miss OFF. 카메라 不动.

## 2. Feel — MMF_SquashAndStretchSpring (Bump · frequency/damping)
- 링크: https://feel-docs.moremountains.com/API/class_more_mountains_1_1_feedbacks_1_1_m_m_f___squash_and_stretch_spring.html
- 한 줄: SquashAndStretchSpring **Bump** 모드로 frequency·damping을 잡아 underdamped 1회 오버슛 후 안착.
- 희동이 적용점: 합계 ≈280ms(0–40 squash · 40–120 stretch · 120–280 settle). freq≈8–12Hz · damping≈0.35–0.55. reduce-motion=OFF.

## 시안
- ✅ `design/assets/bat-ball-squash-punch-v1.png`
- ✅ `design/refs/bat-ball-squash-punch-v1.md`
- 근거: `design/research/ideas-batch-20260928-pm.md` 러너업(배트/공 스쿼시·스케일 스프링 펀치)
