# 패배 거의 이김 · 잔여 HP 히어로 · DEFEAT NEAR-WIN HP HERO v1

파일: `design/assets/defeat-near-win-hp-hero-v1.png` (시안 보드 · 라벨 한글 · **1600×900** · `#FF3B3B` 0px 확인)

## 목표
패배 결과 패널 **최상단 히어로 숫자 = 희동이 남은 HP%**로 ‘거의 이겼다’를 각인한다.  
≤15%면 「한 방이었다」, 도전 ≥3이면 프라이드 1줄. 기존 학습 요약(불꽃N·PERFECTN·MissN)은 **히어로 아래** 유지.  
CTA는 sticky 「**다시 승부**」만 — soft continue·EARLY/LATE·연승 배지 없음.  
**비주얼·카피·레이아웃만 — 판정·점수식·engine 불변.**

근거: `design/research/ideas-batch-20260929-pm.md` TOP② · Director 9/29 PM.  
외부: Choost “I almost had it” · Celeste death-count pride · Mkremins failure→retry 루프.

---

## 1. 트리거 · 노출 조건

| 항목 | 값 |
|---|---|
| 화면 | 패배 결과 패널만 (`game` lose / `resultBody` 패배 분기). 승리 패널 **미적용** |
| 히어로 숫자 | `round(100 * bossHpRemaining / bossHpMax)` % · 표기 `희동이 HP 남은 XX%` |
| 클러치 카피 | **XX ≤ 15** → 「한 방이었다」 · else 「거의 이겼다」(또는 타이틀 슬롯을 히어로가 대체) |
| 프라이드 | `challengeAttempts >= 3` → 「배울수록 강하다 · N회째」1줄. **수치 보상·연승 배지 없음** |
| CTA | 기존 sticky 「다시 승부」(`#retry` 등)만 유지 |
| OFF | 승리 · 일시정지 · 시작 메뉴 · soft continue 경로 |

`challengeAttempts`: 세션/기기 누적 도전 횟수(패배·재시작 카운트). 저장 키가 없으면 `records` 또는 localStorage에 **표시용 카운터만** 추가(점수식 무관) — §9 결정.

---

## 2. 레이아웃 계층 (위 → 아래)

```
1. (선택) result-art / story 슬롯 — 기존 높이 유지 or 축소(히어로 공간 확보)
2. ★ HERO
     - 라벨 12–14px: 「희동이 HP 남은」
     - 숫자 56–72px Bold tabular: 「XX%」
     - 잔량 바 1줄(높이 6px, 장식만 — 판정 무관)
3. ★ 카피 한줄 16–18px Bold
     - ≤15%: 「한 방이었다」 (코랄)
     - else: 「거의 이겼다」 (크림)  — 기존 h1「다시 도전할까?」를 이 슬롯이 흡수하거나 그 아래 보조로 강등
4. ★ 프라이드(조건부) 12–13px 민트 pill — 도전≥3만
5. 학습 요약 (기존 failLineCardHtml 통계줄) 「불꽃N · PERFECTN · MissN」
6. result-grid / detail / 기록 / 랭킹 (기존)
7. sticky panel-cta 「다시 승부」
```

기존 vs 신규 슬롯 분리: 학습 요약·페일 리뷰 칩은 **원인** 슬롯, 본안은 **거리-to-win 히어로** 슬롯.

---

## 3. 타입 · 컬러 규칙

| 요소 | 크기 (세로 기준 ~480논리폭) | 색 |
|---|---|---|
| 히어로 % | **56–72px** Bold | 일반 `#FFE09A` · **≤15% `#FF986E`** |
| 히어로 라벨 | 12–14px Medium | `#A4BEDC` |
| 잔량 바 fill | 높이 6px | 히어로와 동일 톤 |
| 카피 「한 방이었다」 | 16–18px Bold | `#FF986E` |
| 카피 「거의 이겼다」 | 16–18px Bold | `#F7F3E8` |
| 프라이드 pill | 12–13px SemiBold | text `#9BFFE6` · fill `#0C3030dc` · border mint α≈0.5 |
| 학습 요약 | 12–13px (기존) | 기존 fail-chip 톤 유지 |
| CTA | 16px Bold sticky | 기존 `#416EFF→#775CFF` |

**금지색:** `#FF3B3B` (0px). 경고·클러치는 `#FF986E` / `#FFAB88`만.

---

## 4. 카피 변형

| 조건 | 히어로 아래 카피 | 프라이드 | 비고 |
|---|---|---|---|
| HP% > 15 · attempts < 3 | 「거의 이겼다」 | 없음 | 패널 A |
| HP% ≤ 15 · attempts < 3 | 「**한 방이었다**」 | 없음 | 패널 B |
| HP% 임의 · attempts ≥ 3 | 위 규칙 유지 | 「배울수록 강하다 · N회째」 | 패널 C |
| HP% = 0 (전멸 직전 표기) | 히어로 0%는 패배 확정 후라 **노출 없음** 권장 — 패배 시점의 **마지막 잔여%**(피격 직전)를 스냅샷 | | §9 |

eyebrow `STRIKE BACK NEXT TIME`은 유지 가능(영문 메타). 본문 히어로·카피는 **한글**.

---

## 5. 파라미터 표

| 항목 | 값 |
|---|---|
| 클러치 임계 | **≤ 15%** (표시용 · 판정 무관) |
| 프라이드 임계 | **attempts ≥ 3** |
| 히어로 숫자 소스 | 패배 확정 프레임의 `bossHp / bossMax` 스냅샷 |
| 학습 요약 | 기존 `failLineCardHtml(false)` 통계 · **히어로 아래** |
| soft continue | **금지** |
| EARLY/LATE | **금지** |
| 연승/보상 배지 | **금지** (streak HARD) |
| CTA | sticky 「다시 승부」만 |
| RM | 숫자·카피 정적 OK · 불필요 펄스 금지 |

---

## 6. HARD (하지 말 것)

- soft continue · 유료 이어하기 · 이닝스톱 CTA 재도입
- EARLY / LATE 타이밍 방향 라벨
- 연승 배지 · 수치 보상 배지 · 칭호 강제 팝을 히어로 슬롯에 섞기
- 페일 리뷰 칩을 히어로로 대체(원인 칩 HARD/기존 — 슬롯 분리 유지)
- `#FF3B3B` · 판정/점수식/engine 변경
- sticky CTA 문구를 「다시 승부」 외로 교체
- 승리 결과 카드 골격 재설계(본안은 **패배만**)

---

## 7. 권장 크롭

보드: `design/assets/defeat-near-win-hp-hero-v1.png` · **1600×900**

| 용도 | 권장 크롭 (x0,y0,x1,y1) | 메모 |
|---|---|---|
| A 일반 28% | **12,64 – 529,560** | 골드 히어로 · 「거의 이겼다」 |
| B 클러치 12% | **541,64 – 1058,560** | 코랄 · 「한 방이었다」 |
| C 도전≥3 | **1070,64 – 1587,560** | 민트 프라이드 pill |
| D 와이어 비교 | **12,572 – 792,886** | 기존 요약만 vs 히어로 우선 |
| E 타입·하지말것 | **804,572 – 1588,886** | 스케일 · HARD |
| 갤러리/문서 | 전체 **1600×900** | Director 핸드오프 |

---

## 8. 체크리스트

- [ ] 패배 패널 최상단 = 희동이 잔여 HP% 히어로 (승리 미적용)
- [ ] ≤15% → 「한 방이었다」+ 코랄 · else 「거의 이겼다」+ 골드
- [ ] 도전≥3 → 민트 프라이드 1줄 · 배지/보상 없음
- [ ] 학습 요약(불꽃·PERFECT·Miss)은 히어로 **아래** 유지
- [ ] sticky 「다시 승부」만 · soft continue·EARLY/LATE 없음
- [ ] 판정·점수·engine 불변 · `#FF3B3B` 0px · 한글 두부 없음

---

## 9. Director 결정 (2026-09-29 17:17 KST) — 확정

1. 패배 h1「다시 도전할까?」**강등**(히어로 아래 작은 sub 또는 제거 OK) — **최상단은 잔여 HP% 히어로**
2. HP 스냅샷 = **치명타 직전 잔여 %**
3. `challengeAttempts` = **세션만**(새로고침 시 0). localStorage 누적 없음
4. 프라이드 카피 「배울수록 강하다 · N회째」**확정**
5. 클러치 임계 **15% 유지**
6. sticky「다시 승부」유지 · soft continue·EARLY/LATE 없음
7. 프로그래머 큐에는 **아직 넣지 않음** (Perfect 임팩트 후 배분)

미결(구현 시 선택): result-art 높이 축소 허용 여부

## 프로그래머 메모

```
HERO_SOURCE            = bossHpRemaining / bossHpMax   // 치명타 직전 스냅샷
HERO_PCT               = round(100 * HERO_SOURCE)
CLUTCH_LTE_PCT         = 15            // Director 확정
PRIDE_MIN_ATTEMPTS     = 3
CHALLENGE_ATTEMPTS     = sessionOnly   // refresh → 0
COPY_CLUTCH            = "한 방이었다"
COPY_NEAR              = "거의 이겼다"
COPY_PRIDE             = "배울수록 강하다 · {N}회째"  // 확정
H1_AGAIN_DEMOTE        = true          // 「다시 도전할까?」강등/제거
HERO_TOP               = true          // 최상단 = 잔여 HP%
HERO_PX                = 56..72
HERO_COLOR_NORMAL      = #FFE09A
HERO_COLOR_CLUTCH      = #FF986E
PRIDE_COLOR            = #9BFFE6
SUMMARY_BELOW_HERO     = true
CTA_COPY               = "다시 승부"   // sticky only
SOFT_CONTINUE          = false
EARLY_LATE_LABEL       = false
STREAK_BADGE           = false
VICTORY_PANEL          = unchanged
PROGRAMMER_QUEUE       = deferred      // Perfect impact 후
JUDGMENT_UNCHANGED     = true
SCORE_UNCHANGED        = true
ENGINE_UNCHANGED       = true
FORBIDDEN_HEX          = #FF3B3B
```

## 팔레트
`#081329` · `#F7F3E8` · `#FFE09A` · `#FFD25B` · `#FF986E` · `#FFAB88` · `#9BFFE6` · `#C3A4FF` · `#416EFF` · `#775CFF` · `#A4BEDC`

## 관련
- 시안: `design/assets/defeat-near-win-hp-hero-v1.png`
- 근거: `design/research/ideas-batch-20260929-pm.md` TOP②
- 링크집: `design/research/refs-20260929-pm.md`
- 대조(골격 유지·히어로만 추가): `result-panel-polish-v1` · 패배 `failLineCardHtml` · sticky CTA
- 승리 카드와 혼동 금지: `result-victory-v1`
