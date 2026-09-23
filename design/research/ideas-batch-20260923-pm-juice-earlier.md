# 「희동이를 이겨라」 외부 아이디어 배치 — 2026-09-23 16시(오후 TOP3)

- **목적:** Director 적용 검토용. **코어 판정·점수·유료 없이** 가능한 juice / 패턴 연출 / UI 폴리시 3개.
- **제외(이미 적용·검토·중복 축):** Soft Heat, BeatWarping, 페이크아웃, aimLockFire, 몸짓 티핑, Perfect Trauma² cam punch+FOV, 손가락가이드, 칭호·첫불꽃 토스트, 회피/아슬아슬 juice, 고스트배트, FTUE, 히트스톱, 불꽃 VO, Perfect 햅틱, soft continue, 모양언어, 약점글로우, Soft Heat·fakeout·aimBait 겹침 축 등.
- **보류([제안]만, TOP 미포함):** 미스율 스윙창 DDA, 빨간 dodge-only, 하드 엔레이지/데미지 배율, Early/Late 칩, 이점+약점 모디.
- **코드·밸런스·스토리:** 본 문서만. 판정창·점수식 불변.

---

## TOP1 — 스윙 스미어 트레일 + 팔로우스루 감쇠

| 항목 | 내용 |
|---|---|
| ① 원칙 | 공격은 예고(anticipation) → 스윙 전방만 스미어/트레일 → 끝에서 이징으로 멈추고 overshoot 후 settle. 히트스톱·카메라 펀치 없이도 ‘배트가 무게 있다’는 손맛. |
| ② 출처 | https://www.gdquest.com/library/juicy_attack/ (2025-10) · https://wizuslabs.com/blog/anatomy-of-game-juice/ (2026-07) · https://charios.com/blog/2d-attack-animation-anatomy |
| ③ 희동이 적용점 | 드래그→손 떼 스윙 핵심 동선에 직결. Trauma²(카메라)·히트스톱(시간)·고스트배트(도전 실루엣)와 **다른 레이어**(배트 비주얼만). |
| ④ 구체안 | (1) 릴리즈 직후 1프레임 살짝 끌어당김(anticipation) 후 전방 스윙. (2) **전방 가속 구간에만** 배트 스미어/아크 트레일 ON, 감속·settle 때 페이드. (3) 스윙 끝: ease-out + 2~4° overshoot 후 준비 자세로 스프링 복귀(~120–180ms). (4) Perfect만 트레일 길이·밝기↑(판정식 불변). |
| 판정/규칙 변경 | **없음** (연출만). |

---

## TOP2 — Miss / Good / Perfect juice 예산표(계층)

| 항목 | 내용 |
|---|---|
| ① 원칙 | juice는 스택이지만 **예산**. 모든 구에 최대치면 무감각. Light/Medium/Heavy 프로파일로 채널(플래시·파티클·SFX·짧은 UI 팝)을 등급별로만 켜 대비를 만든다. |
| ② 출처 | https://wizuslabs.com/blog/anatomy-of-game-juice/ (restraint·예산) · https://solana.garden/guides/game-juice-and-feel-explained/ (graded intensity table) · https://gamedesign.gg/articles/game-feel/ |
| ③ 희동이 적용점 | 이미 Perfect 플래시·카메라 등이 있어도 **통일 테이블**이 없으면 채널이 제각각. Early/Late 칩·점수 변경 없이 ‘등급이 읽히는’ 폴리시. |
| ④ 구체안 | (1) 표: Miss=미세 더스트+짧은 틱 / Good=1프레임 플래시+중간 버스트 / Perfect=강한 플래시+방향성 스파크+짧은 UI 팝(숫자 아닌 등급 이펙트만). (2) Trauma²·히트스톱은 별 행으로 두고, 본 TOP은 **배트/공 접촉 파티클·플래시·SFX pitch**만 정리. (3) 옵션: reduce-flash / reduce-shake와 동일하게 예산표 한 줄로 끄기. (4) 디자이너용 1페이지 레퍼런스 시트로 넘기기. |
| 판정/규칙 변경 | **없음** (피드백 계층·연출만. 판정창·점수식 불변). |

---

## TOP3 — 투구 사이 settle 이징 + 희동이 idle fidget

| 항목 | 내용 |
|---|---|
| ① 원칙 | 액션 사이 공간이 죽으면 랠리가 기계적. UI·자세는 선형 스냅 대신 ease/overshoot settle, 보스는 완전 정지 idle 대신 미세 fidget. Soft Heat(대기 시 투구 밀도↑)과 다른 **‘사이 숨’** 축. |
| ② 출처 | https://wizuslabs.com/blog/anatomy-of-game-juice/ (easing·anticipation/follow-through) · https://www.gameanalytics.com/blog/squeezing-more-juice-out-of-your-game-design (UI easing) · https://charios.com/blog/2d-attack-animation-anatomy (recovery) · https://gamedesign.gg/articles/game-feel/ |
| ③ 희동이 적용점 | 구와 구 사이·이닝 전환에서 모바일 캐주얼의 ‘살아 있음’. 티핑(구종 텔)·페이크아웃(패턴)·Soft Heat(밀도)와 직교. |
| ④ 구체안 | (1) 스윙/회피 후 배트·타자 실루엣: 목표 각도로 150ms spring settle(overshoot 소량). (2) 희동이 투구 대기: 숨·어깨 미세 흔들림(sin, 저진폭), 세트 진입 때만 포즈 고정. (3) HP바·이닝 라벨 등 HUD 수치 변화는 120–200ms ease-out(스냅 금지). (4) 불꽃 직전만 fidget 진폭↓로 ‘긴장’(구종 정보는 주지 않음 → 티핑과 분리). |
| 판정/규칙 변경 | **없음** (연출·UI 모션만. 투구 간격·판정 불변). |

---

## Director 체크

| # | 아이디어 | 적용 성격 | 판정/코어 규칙 | 비고 |
|---|---|---|---|---|
| 1 | 스윙 스미어+팔로우스루 | 배트 juice | 변경 없음 | 카메라·히트스톱과 직교 |
| 2 | Miss/Good/Perfect juice 예산표 | 피드백 계층 폴리시 | 변경 없음 | Early/Late 칩 아님 |
| 3 | 투구 사이 settle + idle fidget | 사이 숨·UI/보스 모션 | 변경 없음 | Soft Heat·티핑과 직교 |

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-23 오후 배치 (Director 요청)
