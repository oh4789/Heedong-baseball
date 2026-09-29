# 페이즈 월드 시프트 · PHASE WORLD SHIFT v1

파일: `design/assets/phase-world-shift-v1.png` (시안 보드 · 라벨 한글 · **1600×900** · `#FF3B3B` 0px 확인)

## 목표
기존 **페이즈 HP 임계**를 넘을 때 **구장 팔레트·희동이 실루엣**이 한 단 바뀌고, 상단 **소형 칩**「2회」/「FINAL」만 짧게 팝한다.  
**페이즈 HP 청크·보스 페이즈 배너와 다른 채널**(다이에게틱 월드·실루엣·미니 칩). Perfect juice·등급 칩·칭호 토스트와도 직교.  
**비주얼 전용 — 판정창·히트박스·점수·스침·투구 확률·engine·HP 임계값 자체 불변.**

근거: `design/research/ideas-batch-20260929-pm.md` TOP① · Director 9/29 PM.  
외부: Choost boss-fight 페이즈 리듬 · Cuphead 세계 에스컬레이션 · Huygamer 세그먼트 내러티브 큐.

---

## 1. 트리거 (기존 페이즈 경계)

라이브 코드 `game.js` 확인:

```js
function phaseChunksFromRatio(r){
  if(r>2/3) return 3;   // 페이즈1 · 잔여 HP > 66.6%
  if(r>1/3) return 2;   // 페이즈2 · 잔여 HP > 33.3%
  if(r>0)   return 1;   // 페이즈3(FINAL) · 잔여 HP > 0
  return 0;
}
// chunk 3→2 시 showPhaseBanner(2)  ·  chunk 2→1 시 showPhaseBanner(3)
```

| 이벤트 | 잔여 HP 비율 | 월드 시프트 | 칩 카피 |
|---|---|---|---|
| 페이즈1 → 2 | **≤ 2/3** (≈66.7%) 통과 | step 1→2 | 「**2회**」 |
| 페이즈2 → 3 | **≤ 1/3** (≈33.3%) 통과 | step 2→3 | 「**FINAL**」 |

- 임계값·청크 로직 자체는 **변경하지 않음**(기존 페이즈 경계 재사용).
- 기존 `phase-banner` DOM / HP 청크 플래시는 **본안이 대체하지 않음** — HARD 시안(`phase-hp-chunks-v1` · `boss-phase-banner-v1`)과 **병행 금지·재도입 금지**. 월드 시프트만 신규 채널.
- 구현 시 배너·청크를 끄는 건 **별도 Director 결정**(§9). 본 시안은 월드+칩만 명세.

---

## 2. 파라미터 표

| 항목 | 페이즈1 (1회) | 페이즈2 (2회) | 페이즈3 (FINAL) |
|---|---|---|---|
| 하늘 틴트 | 석양 웜 `#FFB464` α≈0.11 | 쿨 네이비 `#141E46` α≈0.27 | 딥 네이비 `#080A1E` α≈0.43 + 보라 wash α≈0.14 |
| 채도 | **1.00–1.05×** | **≈0.72×** | **≈0.55×** |
| 밝기 | 1.00–1.02× | ≈0.82× | ≈0.68× |
| 대비(희동이) | 기준 | **≈1.35×** + 민트 림 α≈0.47 | **≈1.55×** + 보라 림 α≈0.70 · 실루엣 블렌드 0.35 |
| 포즈 힌트 | idle/친근 | windup·긴장 | release·결전 (기존 스프라이트 재사용, 신규 아트 불요) |
| 월드 ease | — | **300–600ms** ease-in-out | **300–600ms** (2→3) |
| 칩 | 없음 | 「2회」민트 | 「FINAL」골드 |

의사코드(시안용):

```
onPhaseCross(fromChunks, toChunks):  // 기존 updateBossPhaseHud 분기와 같은 비트
  step = (toChunks==2) ? 2 : 3
  tweenWorldPalette(step, {durationMs: 450, ease: 'inOut'})  // 300–600
  boostHeedongSilhouette(step, {durationMs: 450})
  if(step==2) popPhaseChip('2회', {tint:'mint', lifeMs:1000})
  if(step==3) popPhaseChip('FINAL', {tint:'gold', lifeMs:1000})
  // DO NOT: spawnPhaseBanner, flashHpChunk, perfectJuice, CA/FOV/vignette/flash
```

---

## 3. 소형 칩 스펙

| 항목 | 값 |
|---|---|
| 형태 | **필(pill)** · 높이 **28–34px** · 폭 = 텍스트 + 좌우 14px + 다이아 여유 |
| 위치 | 화면 **상단 중앙** · `safe-area-top + 56–72px` (보스바·메타 아래, 플레이 중심과 분리) |
| 「2회」 | fill `#12284Eb8` · border/text `#9BFFE6` · 좌측 민트 다이아 1 |
| 「FINAL」 | fill `#241640eb` · border/text `#FFE09A` · 좌측 골드 다이아 1 |
| 타이밍 | in **120ms** → hold **0.6–0.8s** → out **200ms** = 합 **0.8–1.2s** |
| 모션 | scale 0.86→1.0 + α 0→1 (overshoot 1회 ≤1.06 OK) |
| 동시성 | 월드 ease와 **병렬 OK** (칩이 월드를 기다리지 않음) |
| `prefers-reduced-motion` | 모션 없이 **1프레임 페이드**(α만) 또는 정적 0.9s |
| 저사양 | 칩만 유지 · 림/실루엣 강화 생략 가능 |

### 다른 UI와 색·카피 분리

| 채널 | 카피/색 | 본안과 |
|---|---|---|
| Perfect/Good 등급 칩 | PERFECT·GOOD · 큰 골드/민트 플로팅 | **문구·크기·앵커(접촉점) 다름** |
| 칭호 언락 토스트 | 칭호명 · 크림/퍼플 | 하단·다른 슬롯 |
| 기존 boss-phase-banner | `PHASE 2` + 대사 풀폭 글래스 | **HARD — 복제·재제안 금지** |
| combo-mult 칩 | ×N 콤보 | HUD 하단 근처 · 직교 |

---

## 4. 타이밍 표

| 구간 | ms | 비주얼 |
|---|---|---|
| 임계 통과 프레임 | 0 | 기존 chunk 감소 이벤트와 동일 비트 |
| 월드 팔레트·실루엣 ease | **0–300…600** | sky/dirt tint · sat↓ · contrast↑ |
| 칩 페이드인 | 0–120 | pill scale+α |
| 칩 홀드 | 120–≈800 | 가독 유지 |
| 칩 페이드아웃 | ≈800–1000…1200 | α→0 |
| Perfect juice 창 | — | **본안 구간과 무관·끼워넣기 금지** |

---

## 5. 레이어 노트

```
1. 경기장 배경 (+본안 팔레트 틴트/채도)     ★ 월드 시프트
2. 희동이 스프라이트 (+대비·림·포즈)         ★ 실루엣 채널
3. 공·타자·VFX·기존 juice
4. HUD (보스바·메타) — 청크 UI는 기존 유지하되 본안이 청크를 "연출"하지 않음
5. ★ 소형 페이즈 칩 (최상위 HUD 근처, 풀폭 아님)
6. Perfect 등급칩 / 칭호 토스트 — 다른 슬롯·다른 카피
```

| 채널 | 관계 |
|---|---|
| `phase-hp-chunks-v1` | **HARD** — 재도입·본안 연출 금지. 경계값만 공유 |
| `boss-phase-banner-v1` | **HARD** — 풀폭·대사 배너 금지 |
| Perfect FOV/비네트/CA/플래시 | 히트 확정 juice — **페이즈 전환에 금지** |
| `mound-plate-dust-v1` | 투구 환경 먼지 — 페이즈 틴트와 직교(먼지는 투구마다) |
| grade chip / title toast | 카피·색·앵커 분리 |

---

## 6. HARD (하지 말 것)

- `phase-hp-chunks` / `boss-phase-banner` **재제작·복제·강화**
- 풀폭 배너 · 대사 줄 · HP바 세그먼트 파괴 플래시를 본안 연출로 사용
- Perfect juice(CA·FOV·비네트·머티리얼 플래시·임팩트 프레임)를 **페이즈 전환에 삽입**
- EARLY / LATE · soft continue · `#FF3B3B`
- 판정창·점수식·engine·**HP 임계값 자체** 변경
- 칩을 등급 칩 크기(≥48px)로 키우거나 화면 중앙에 고정

---

## 7. 권장 크롭 (구현자)

보드: `design/assets/phase-world-shift-v1.png` · **1600×900**

| 용도 | 권장 크롭 (x0,y0,x1,y1) | 메모 |
|---|---|---|
| A 페이즈1 룩 | **12,64 – 529,520** | 석양·채도 100% · idle |
| B 페이즈2 시프트 중 | **541,64 – 1058,520** | 민트「2회」칩 · sat↓ |
| C FINAL 룩 | **1070,64 – 1587,520** | 골드「FINAL」· 긴장 실루엣 |
| D 칩 해부 | **12,532 – 632,886** | 크기·위치·수명·색 분리 |
| E 타임라인+하지말것 | **644,532 – 1588,886** | 66%/33% · ease · HARD |
| 갤러리/문서 | 전체 **1600×900** | Director 핸드오프 |

---

## 8. 체크리스트

- [ ] 트리거 = 기존 `phaseChunksFromRatio` 경계(2/3 · 1/3)만 — 임계값 변경 없음
- [ ] 월드 ease 300–600ms · 칩 수명 0.8–1.2s · 병렬 OK
- [ ] 칩 = 소형 pill 「2회」(민트) / 「FINAL」(골드) — 풀폭·대사 없음
- [ ] Perfect juice · grade chip · title toast와 카피·색·슬롯 분리
- [ ] phase-hp-chunks / boss-phase-banner **미사용·미복제**
- [ ] 판정·점수·engine 불변 · `#FF3B3B` 0px · 한글 라벨(두부 없음)
- [ ] RM: 칩 α만 / 저사양: 림 생략 가능

---

## 9. Director 결정 (2026-09-29 17:17 KST) — 확정

1. 기존 DOM `#phase-banner`와 HP 청크 flash **끄기** → **월드 팔레트 + 소형 칩으로 교체**(병존 아님)
2. 월드 ease 기본값 **450ms** 픽스 (허용 범위 300–600ms 내)
3. 칩 문구 「2회」/「FINAL」— **영문 FINAL 유지**
4. 트리거 = 기존 `phaseChunksFromRatio` 그대로 (임계값 변경 없음)
5. 프로그래머 큐에는 **아직 넣지 않음** (Perfect 임팩트 후 배분)

미결(구현 시 선택): 페이즈2 포즈 windup vs idle+림 · BGM 스냅샷과 월드 ease 동기화(오디오 별 시안)

## 프로그래머 메모

```
PHASE_RATIO_P2          = 2/3          // 기존 경계 — 변경 금지
PHASE_RATIO_P3          = 1/3          // 기존 경계 — 변경 금지
WORLD_EASE_MS           = 450          // Director 확정 (허용 300..600)
CHIP_LIFE_MS            = 800..1200    // in120 + hold + out200
CHIP_H_PX               = 28..34
CHIP_Y                  = safeTop + 56..72
CHIP_P2_COPY            = "2회"
CHIP_P3_COPY            = "FINAL"      // 영문 유지
CHIP_P2_COLOR           = #9BFFE6
CHIP_P3_COLOR           = #FFE09A
SAT_MULT                = [1.05, 0.72, 0.55]
BRIGHT_MULT             = [1.02, 0.82, 0.68]
SIL_CONTRAST            = [1.0, 1.35, 1.55]
KILL_PHASE_BANNER       = true         // #phase-banner OFF
KILL_HP_CHUNK_FLASH     = true         // 청크 flash OFF
REPLACE_WITH_WORLD_CHIP = true         // 월드+칩으로 교체
NO_PERFECT_JUICE_ON_PHASE = true
JUDGMENT_UNCHANGED      = true
SCORE_UNCHANGED         = true
ENGINE_UNCHANGED        = true
PROGRAMMER_QUEUE        = deferred     // Perfect impact 후
FORBIDDEN_HEX           = #FF3B3B
```

## 팔레트
`#081329` · `#F7F3E8` · `#FF986E` · `#FFAB88` · `#FFE09A` · `#FFD25B` · `#9BFFE6` · `#C3A4FF` · `#8C9BC2`

## 관련
- 시안: `design/assets/phase-world-shift-v1.png`
- 근거: `design/research/ideas-batch-20260929-pm.md` TOP①
- 링크집: `design/research/refs-20260929-pm.md`
- 대조(복제 금지): `phase-hp-chunks-v1` · `boss-phase-banner-v1`
