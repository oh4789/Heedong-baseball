# 패배 개인 베스트 델타 · DEFEAT PB DELTA LINE v1 (APPENDIX)

파일: `design/assets/defeat-pb-delta-line-v1.png` (시안 보드 · 라벨 한글 · **1600×900** · `#FF3B3B` 0px 확인)

**부모:** [`defeat-near-win-hp-hero-v1.md`](defeat-near-win-hp-hero-v1.md) — Director 9/29 PM 확정(히어로·클러치·프라이드·CTA)은 **불변**. 본안은 그 **아래** 보조 1줄만 추가.

## 목표
패배 결과 패널에서 **이번 런 잔여 HP% vs 개인 최고(최저 잔여 HP%)** 한 줄 델타로 ‘기록에 가까워졌다 / 신기록’을 각인한다.  
히어로(절대 XX%)를 **대체하지 않음**. soft continue·EARLY/LATE·연승 배지 없음. sticky「**다시 승부**」유지.  
**비주얼·카피·레이아웃만 — 판정·점수식·engine 불변.**

근거: `design/research/ideas-batch-20260930-am.md` TOP② · Director 9/30 AM appendix.  
외부: Phillips/MGS “came close to your record” · Bloodmoon Motivation Response · Joyplayx failure→retry.

---

## 1. 슬롯 · 계층 (부모 대비)

부모 히어로 계층에 **★ PB 델타**만 끼움. 히어로·카피·프라이드·학습 요약·CTA는 부모 그대로.

```
1. (선택) result-art / story
2. ★ HERO — 희동이 HP 남은 XX% (+ 잔량 바)     ← 부모 유지 · 본안이 대체 금지
3. ★ 카피 한줄 — 「한 방이었다」/「거의 이겼다」   ← 부모 유지
4. ★ 프라이드(조건부) — 「배울수록 강하다 · N회째」 ← 부모 유지
5. ★★ PB 델타 1줄 (본안 · 조건부)                  ← NEW · 히어로 아래 · 학습 요약 위/옆
6. 학습 요약 「불꽃N · PERFECTN · MissN」           ← 부모 유지
7. result-grid / detail / 기록 / 랭킹
8. sticky panel-cta 「다시 승부」
```

| 슬롯 | 역할 | 본안 |
|---|---|---|
| 히어로 XX% | 이번 판 절대 거리-to-win | **건드리지 않음** |
| PB 델타 | 역대/기기 최고와의 비교 | **1줄만** · 히어로 아래 |
| 학습 요약 | 원인 통계 | 히어로·델타 **아래** 유지 |
| sticky CTA | 재도전 | 「다시 승부」만 |

모바일 폭이 좁으면 델타를 학습 요약 **바로 위 전폭 1줄**. 여유가 있으면 학습 요약과 **같은 행 옆**(좌 델타 / 우 요약)도 OK — 히어로 숫자 크기·위치는 변경 금지.

---

## 2. 정의 · 공식

| 기호 | 의미 |
|---|---|
| `this%` | 이번 패배 잔여 HP% = 부모와 동일 스냅샷 `round(100 * bossHpRemaining / bossHpMax)` (치명타 직전) |
| `PB%` | **개인 최고** = 패배/거의이김에서 달성한 **최저 잔여 HP%**(낮을수록 승리에 가까움) |
| `N` | `this% − PB%` (percentage points, 정수 반올림) |

**개인 최고 = 최저 잔여 HP%.** (데미지 누적 최고가 아님 — 히어로 축과 동일 단위로 비교.)

| 조건 | 표시 | 예 |
|---|---|---|
| PB 데이터 있음 · `this% > PB%` (기록보다 멀리) | `개인 최고까지 ΔN%p` · N = this% − PB% | this 28 · PB 12 → `개인 최고까지 Δ16%p` |
| PB 데이터 있음 · `this% < PB%` (신기록 · 더 가까움) | `신기록! 희동이 HP XX%(이전 YY%)` · XX=this% · YY=이전 PB% | this 8 · 이전 PB 12 → `신기록! 희동이 HP 8%(이전 12%)` |
| PB 데이터 있음 · `this% == PB%` (동률) | `개인 최고까지 Δ0%p` 또는 `개인 최고 타이` — **§9 결정** | |
| PB 없음(첫 패배·비교 불가) | **줄 숨김**(레이아웃 붕괴 없이 슬롯 높이 0) | 패널 C |

신기록 확정 후: `PB% ← this%`로 갱신(표시는 이번 런 XX + 이전 YY).

승리 패널·일시정지·시작 메뉴: **OFF**(부모와 동일 — 패배만).

---

## 3. 카피 변형 표

| 패널 | 조건 | 카피 | 색 톤 |
|---|---|---|---|
| A | this% > PB% | `개인 최고까지 ΔN%p` | 크림 `#F7F3E8` / 라벨 `#A4BEDC` · ΔN은 골드 `#FFE09A` 강조 OK |
| B | this% < PB% (신기록) | `신기록! 희동이 HP XX%(이전 YY%)` | 민트 `#9BFFE6` Bold · 「신기록!」강조 |
| C | PB 없음 | *(숨김)* | — |
| — | this% == PB% | §9 | 크림 권장 |

타이포(세로 ~480논리폭 기준): **12–14px** Medium/SemiBold — 히어로(56–72px)·카피(16–18px)보다 **작게**. 히어로와 경합 금지.

---

## 4. 노출 · 숨김 규칙

| 항목 | 값 |
|---|---|
| ON | 패배 결과 패널 · PB 비교 가능(이전 패배 잔여% ≥1회 저장) |
| HIDE | 첫 패배 · PB 키 없음 · 저장 실패 · 승리 패널 |
| 히어로 | 항상 부모 규칙대로 표시(델타 숨김이어도 히어로 유지) |
| 프라이드 | 부모 조건 독립(도전≥3). 델타와 **배지/연승으로 합치지 않음** |
| CTA | sticky「다시 승부」만 · soft continue 금지 |

---

## 5. 저장 (storage note)

| 항목 | 제안 | 상태 |
|---|---|---|
| 키 | `localStorage` `heedong.pbRemainHpPct` (정수 0–100, 최저 잔여 %) | **Director 확정** |
| 갱신 시점 | 패배 확정 후 · `this% < PB%`(또는 PB 없음이면 첫 값 기록)일 때 갱신 | |
| 세션 vs 영속 | 부모 `challengeAttempts`는 **세션만**. PB는 **기기 영속(localStorage)** | **확정** |
| 점수식 | 무관 · 표시용 정수만 | |
| 클리어 | 설정에 ‘기록 초기화’가 있으면 함께 삭제(없으면 v1 미구현 OK) | |

---

## 6. HARD (하지 말 것)

- soft continue · 유료 이어하기
- EARLY / LATE 타이밍 방향 라벨
- 연승·스트릭 배지 · 수치 보상 배지 · 칭호 토스트를 델타 슬롯에 섞기
- 히어로 XX%를 델타로 **대체**하거나 히어로 숫자 축소
- 학습 요약(불꽃·PERFECT·Miss) 제거/대체
- sticky「다시 승부」문구 변경
- `#FF3B3B` · 판정/점수식/engine 변경
- 프로그래머 큐에 **넣었다고 주장 금지** — 부모와 같이 **deferred**

---

## 7. 권장 크롭

보드: `design/assets/defeat-pb-delta-line-v1.png` · **1600×900**

| 용도 | 권장 크롭 (x0,y0,x1,y1) | 메모 |
|---|---|---|
| A 가까움·비기록 | **12,56 – 529,470** | `개인 최고까지 Δ16%p` |
| B 신기록 | **541,56 – 1058,470** | `신기록! 희동이 HP 8%(이전 12%)` |
| C 데이터 없음·숨김 | **1070,56 – 1587,470** | 델타 슬롯 공란 · 히어로만 |
| D 배치 와이어 | **12,488 – 792,882** | 히어로 아래 · 요약 위 |
| E 하지말것 | **804,488 – 1588,882** | soft continue·EARLY/LATE·streak·#FF3B3B |
| 갤러리/문서 | 전체 **1600×900** | Director 핸드오프 |

---

## 8. 체크리스트

- [ ] 슬롯 = 히어로 **아래** · 학습 요약 **위/옆** · 히어로 미대체
- [ ] this% > PB% → `개인 최고까지 ΔN%p` (N = this − PB)
- [ ] this% < PB% → `신기록! 희동이 HP XX%(이전 YY%)` + PB 갱신
- [ ] this% == PB% → `개인 최고 타이` (Δ0%p 금지)
- [ ] PB 없음 → 줄 숨김
- [ ] sticky「다시 승부」유지 · soft continue·EARLY/LATE·streak 배지 없음
- [ ] 한글 · 두부 없음 · `#FF3B3B` 0px · 팔레트 navy/cream/coral/mint/gold
- [ ] 판정·점수·engine 불변 · 프로그래머 큐 **deferred**(미등록 주장 금지)
- [ ] 부모 `defeat-near-win-hp-hero-v1` Director 확정 문구 **미개서**

---

## 9. Director 결정 (2026-09-30 ~11:12 KST) — 확정

1. PB 저장 = **localStorage 영속**, 키 예: `heedong.pbRemainHpPct`(최저 잔여 %). `challengeAttempts`는 **세션 유지**
2. 타이(`this% == PB%`) 카피 = 「개인 최고 타이」— **`Δ0%p` 금지**
3. 신기록 민트 + 프라이드 민트 **동시 OK**(슬롯 분리 · 배지 합침 금지)
4. 프로그래머 큐에는 **아직 넣지 않음**(deferred)

**기존 확정(유지):** 슬롯=히어로 아래 1줄 · 카피 A/B · 숨김 C · PB=최저 잔여% · soft continue·EARLY/LATE·streak·#FF3B3B 금지 · sticky「다시 승부」

## 프로그래머 메모

```
PB_LINE_SLOT           = below_hero_above_or_beside_summary
PB_REPLACE_HERO        = false
THIS_PCT               = same as HERO_PCT (fatal-hit-prior snapshot)
PB_PCT                 = min remaining HP% on defeat  // personal best
DELTA_N                = thisPct - pbPct              // when thisPct > pbPct
COPY_CLOSER            = "개인 최고까지 Δ{N}%p"
COPY_RECORD            = "신기록! 희동이 HP {XX}%(이전 {YY}%)"
COPY_TIE               = "개인 최고 타이"   // Director 확정 · Δ0%p 금지
HIDE_IF_NO_PB          = true
STORAGE_KEY            = localStorage "heedong.pbRemainHpPct"
STORAGE_SCOPE          = persistent
CHALLENGE_ATTEMPTS     = sessionOnly   // parent — unchanged
UPDATE_ON_BETTER       = thisPct < pbPct || pbMissing
RECORD_MINT_PLUS_PRIDE = true          // simultaneous OK, separate slots
CTA_COPY               = "다시 승부"   // sticky only
SOFT_CONTINUE          = false
EARLY_LATE_LABEL       = false
STREAK_BADGE           = false
PROGRAMMER_QUEUE       = deferred      // do NOT claim queued
JUDGMENT_UNCHANGED     = true
SCORE_UNCHANGED        = true
ENGINE_UNCHANGED       = true
FORBIDDEN_HEX          = #FF3B3B
PARENT_REF             = defeat-near-win-hp-hero-v1
```

## 팔레트
`#081329` · `#F7F3E8` · `#FFE09A` · `#FFD25B` · `#FF986E` · `#FFAB88` · `#9BFFE6` · `#C3A4FF` · `#416EFF` · `#775CFF` · `#A4BEDC`

## 참고 · 「바꿀 한 수」카피 풀 (Director 2026-09-30 · 스토리 카피 확정)

패배 결과 보조 슬롯용. **잔여 HP% 히어로 · PB 델타와 자리 분리**. 코드·프로그래머 큐 없음(참고만).

| # | 카피 |
|---|---|
| 1 | 다음: 불꽃은 스윙 말고 피하기 |
| 2 | 다음: 칠 공만 골라. |
| 3 | 다음: 타이밍 안 오면 그냥 피해. |
| 4 | 다음: 한 방만 제대로. |
| 5 | 다음: 욕심내지 말고 골라 쳐. |

규칙: 세션당 연속 동일 문장 최소화. soft continue · EARLY/LATE · 연승 배지와 무관.

## 관련
- 시안: `design/assets/defeat-pb-delta-line-v1.png`
- 부모: `design/refs/defeat-near-win-hp-hero-v1.md` · `design/assets/defeat-near-win-hp-hero-v1.png`
- 근거: `design/research/ideas-batch-20260930-am.md` TOP②
- 링크집: `design/research/refs-20260930-am.md`
