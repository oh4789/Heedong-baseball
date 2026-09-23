# 고정형 유도 불꽃구 · AIM-LOCK BAIT FIRE v1 (P2)

패턴 id: `aimLockFire`  
축: **공간** (홀드 조준점 고정) — Soft Heat(시간/스톨)·페이크아웃(예열 전환)과 직교  
판정·히트박스·점수: **변경 없음**  
텔레그래프: 기존 불꽃 3단 코랄/앰버만. **빨간 dodge-only 금지**

---

## 상태 (Director 2026-09-23)

코어 패턴은 **이미 라이브** (`aimLockFire`, commit `2281081` + balance `a606bea`).  
본 PNG·크롭 표는 **구현 대기가 아니라 비주얼 폴리시 팩**(갤러리·스프라이트 교체 가이드).  
스프라이트/레인 강화는 VFX 4레인 충돌 A/B 폴리시 이후 **선택 배정**. 추가 시안 불필요.

---

## 비주얼 시안 · 익스포트 (2026-09-23 저녁)

파일: `design/assets/aim-lock-bait-fire-v1.png` (1600×900, 16:9 보드 · 라벨 한글)

| 용도 | 권장 크롭 / 사이즈 | 메모 |
|---|---|---|
| 민트 펄스 스프라이트 | 보드 A패널 lock점 원형 링 · **128×128** (@2x) / 64×64 (@1x) | `#9BFFE6` 1회 · duration **0.15s** · scale 0.6→1.2 fade |
| 코랄 텔레그래프 레인 | 세로 레인 스트립 · **96×480** (또는 타일 96×96×5) | early `#FFAB88` → late `#FF986E` · lockX 중심 |
| 비행 불꽃 오브 | **96×96** (트레일 포함 시 96×160) | flight `#FF5A2A` |
| 콜아웃 배너 | 가로 칩 · **640×72** (@2x) | `⚠ 고정 조준 · 피하세요` · 코랄 보더 · **#FF3B3B 금지** |
| 대비 컷 (문서/갤러리) | 보드 전체 1600×900 또는 A/B 각 **720×430** | A=고정위험 / B=옆이동안전 |

런타임: mid-flight 호밍 0 · 판정·히트박스 불변. 레퍼런스 `design/research/refs-20260923-evening.md`.

---

## 목표
홀드(특히 hold-lock)로 한 점에 머물면, 그 **고정점에 맞춰 오는 불꽃**으로 이동을 유도한다.  
비행 중 재추적(강한 호밍) 없음 — 투구 순간 스냅샷만.

---

## 1) 스폰 조건

| 항목 | 값 |
|---|---|
| 최소 pitch | **≥5** (pitch≤4 튜토 **OFF**) |
| Hold-lock ON | 동일 lock점 유지 **≥1.2s** |
| Hold-lock OFF (raw) | 조준/타자 이동 **≤18px** 유지 **≥1.8s** + 포인터 홀드 중 |
| 비행 중 공 | 있으면 **스폰 불가** (다음 prepare로) |
| 스테이지당 캡 | **2** |
| 구 간격 | 최소 **3구** |
| 시간 쿨 | 마지막 스폰 후 **6.0s** |
| 롤 (eligible 시) | 아래 HP 표 확률 |

Hold-lock 전제: **강화 트리거일 뿐, 필수 아님.** OFF여도 raw 홀드로 발동.

---

## 2) 궤적

| 항목 | 값 |
|---|---|
| 타겟 | 투구 직전 lockX (없으면 player.x) **스냅샷** |
| tx | `clamp(85, 395, lockX)` — aimSpan/jitter **0** |
| 비행 | 직선 보간 (기존 fire duration). **mid-flight 호밍 0** |
| curve | 0 |
| type | `fire` (회피·vulnerable 2.0 정상) |
| Soft Heat fire% 캡 | fire로 **카운트** |

약한 호밍(제안·비채택): 비행 중 tx를 lock에 10%/프레임 혼합 — **v1 금지** (가독성·직교성).

---

## 3) HP / 페이즈 밀도 (eligible 롤)

| boss HP% | 스폰 확률 | 비고 |
|---|---|---|
| 100~70 | **28%** | 학습 구간 낮음 |
| 70~50 | **38%** | |
| 50~25 (fury) | **48%** | windup 단축과 병행 |
| 25~0 | **55%** | 캡 2로 상한 |

---

## 4) 텔레그래프 · 읽기 윈도우

| 항목 | 값 |
|---|---|
| windup | 정상 **0.95s** / fury **0.75s** (일반 fire 0.8/0.65보다 +0.15 가독) |
| 3단 색 | early `#FFAB88` → late `#FF986E` → flight `#FF5A2A` (기존) |
| 공간 큐 | lock점 **민트 펄스** `#9BFFE6` 1회(0.15s) → 코랄 레인이 **그 점**으로 |
| 콜 문 | `⚠ 고정 조준 · 피하세요` (빨강 문구/큐 금지) |
| 읽기 윈도우 | windup 전체 + 비행 전반 ~**0.55s** (y≈420 전) |

---

## 5) 상수 표 (Programmer)

```
AIM_BAIT_MIN_PITCH        = 5
AIM_BAIT_HOLD_LOCK_SEC    = 1.2
AIM_BAIT_HOLD_RAW_SEC     = 1.8
AIM_BAIT_STILL_PX         = 18
AIM_BAIT_MAX_PER_STAGE    = 2
AIM_BAIT_MIN_GAP_PITCHES  = 3
AIM_BAIT_COOLDOWN_SEC     = 6.0
AIM_BAIT_WINDUP           = 0.95
AIM_BAIT_WINDUP_FURY      = 0.75
AIM_BAIT_JITTER           = 0
AIM_BAIT_HOMING           = 0
AIM_BAIT_CHANCE_HP100_70  = 0.28
AIM_BAIT_CHANCE_HP70_50   = 0.38
AIM_BAIT_CHANCE_HP50_25   = 0.48
AIM_BAIT_CHANCE_HP25_0    = 0.55
```

---

## 6) prepare 우선순위 (충돌)

1. pitch≤4 튜토  
2. **Soft Heat tracker** (stall≥3.5 → 추적 fast) — 동시 eligible 시 **tracker 승**, aim-bait **이연**  
3. 꺾기 페어 2구째 강제  
4. A-B-A→A-A 강제  
5. **`aimLockFire`** (본 패턴)  
6. fakeFire 승격  
7. Soft Heat weighted pool  

같은 구에 tracker와 aim-bait 동시 금지. fakeFire는 aimLockFire를 덮어쓰지 않음.

---

## 체감 한 줄
한 점에 락 잡고 있으면 불꽃이 그 점으로 와서, 옆으로 몸을 비키게 만든다.

## QA
- 튜토 4구 0건  
- 스테이지 ≤2, 간격 ≥3구·≥6s  
- mid-flight 호밍 0  
- `#FF3B3B` 미사용  
- tracker와 동시 prepare 0건  
- reach/perfect/점수 무변경  
