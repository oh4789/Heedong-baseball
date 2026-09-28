# 퍼펙트 임팩트 프레임 1컷 · v1 (perfect-impact-frame-v1)

파일: `design/assets/perfect-impact-frame-v1.png` (시안 보드 · 라벨 한글 · **1600×900** · `#FF3B3B` 0px 확인)
보조: `design/assets/perfect-impact-ink-lines-v1.png` (잉크 속도선 텍스처 · 480×480 투명 · 게임 좌표 240×240 @2x)

## 목표
**퍼펙트 확정 프레임에만** 접촉점 주변 **원형 국소 영역**을 16–40ms 동안 흑백/잉크톤으로 바꿔 "맞았다"를 1컷으로 각인.
히트스톱(시간)·트라우마²(카메라)·희동이 피격 플래시(맞는 쪽)·juice 예산(세기)과 **직교인 "화면 스타일" 레이어**.
**시간 배속 변경 없음 · 판정창·히트박스·점수·스침·투구 확률·engine 불변 · 풀스크린 금지.**

근거: `design/research/ideas-batch-20260928-am.md` ② · Lush Easy Impact Frames(2026-01) · Easton 2026-05 · Director 9/28 AM TOP2.

## Director 결정 (2026-09-28)
1. 비트 프레임 기준 OK (골드 플래시·히트스톱과 동일 프레임 우선)
2. 전체 골드 플래시 첫 프레임 원 영역 제외 + 바깥 ×0.5 승인
3. 네이비/크림 투톤 채택
4. Good 기본 OFF (Perfect 전용)
5. 스윙 스미어 1–2프레임 잉크색 수용

---

## 1. 현재 game.js의 퍼펙트 렌더 (조사 결과)

| 시점 | 호출 | 내용 |
|---|---|---|
| 판정 프레임 (`e.type==='perfect'`) | `beginSwingSmear('perfect')`, `triggerCamPunch()`, `spawnFriendCheer`, `queueBeatWarpImpact('perfect')` | 카메라 펀치 2f(33ms) + 금 테두리 림, 스미어 1.5× |
| **박자 임팩트** (`fireBeatWarpImpact`, 판정 후 **0–240ms** 지연 가능) | `setFlash(2/60,'gold')` · `spawnBeatStinger` · `spawnPerfectHitJuice` · `spawnPerfectGradePop` · `applyFreeze(.1,.15)` | **전역 풀스크린 금 플래시 33ms**(불꽃 텔 시 국소화), 금 링 r10→68 + 보라 링 r40, 스파크, 등급 팝, **히트스톱 100ms** + 흔들림 |
| 판정 +75ms(게임 시간) | `game.returns` 금빛 리본 | 퍼펙트 금빛 트레일 |
| 귀환 도착 (`impact`, ≈+380ms 게임 시간 + 프리즈 100ms ≈ **+480ms**) | `beginHeedongHitJuice(true)` | 희동이 실루엣 플래시 65ms + 리코일 |

→ **잉크 컷의 앵커는 `fireBeatWarpImpact('perfect')`** (금 플래시·히트스톱과 같은 프레임). 판정 프레임이 아니라 박자 임팩트 프레임에 건다.
참고: 히트스톱은 `game.update`만 멈추고 `frame()`의 dt는 계속 흐르므로, 잉크 컷은 **실시간 dt**로 진행(프리즈 중에 재생·종료).

---

## 2. 국소 원 · 타이밍

| 파라미터 | 값 | 비고 |
|---|---|---|
| 중심 | 박자 임팩트 좌표 `(cx,cy)` = `fireBeatWarpImpact` 인자 (없으면 `game.zone`) | 게임 좌표 480×850 |
| 중심 비움 `INK_GAP` | **30px** | 접촉점·금 링·공은 컬러 유지 (흑백 속 금 1점) |
| 완전 잉크 반경 `INK_R_FULL` | **96px** | |
| 페더 `INK_FEATHER` | **24px** (96→120, smoothstep) | 경계 딱딱한 원 금지 |
| 최대 반경 | **120px** = 화면의 약 11% | 기존 `impactMaxRadius()`(15% = 140px) 이하 |
| 불꽃 텔 활성 (`isFireTelegraphActive()`) | r ≤ **84px** (`impactMaxRadius()*0.6`), 텔 실루엣과 겹치면 **끔** | 위협 가독 우선 (vfx-4lane Clash A) |
| 첫 불꽃 토스트 표시 중 | 강도 ×0.5 | Clash B |
| 프레임 1 (0–16.7ms) | 잉크 **100%** | |
| 프레임 2 (16.7–33ms) | 100% → 0 ease-out | |
| 하드 컷 | **40ms** (120Hz 등에서도 여기서 종료) | |
| 모션 | 원 크기·위치 **고정** (스케일 펄스 없음) | 부담 최소화 |
| 쿨다운 | **500ms** (초당 ≤2회) | 연속 직구 2연속 퍼펙트 → 두 번째는 잉크 생략(다른 juice는 유지) |

---

## 3. 잉크톤 처리 (원 안)

| 단계 | 값 | 런타임 방법 |
|---|---|---|
| 채도 제거 | 100% (페더에서 0으로) | `ctx.filter='grayscale(1) …'` 또는 `'saturation'` 합성 |
| 대비 | ×**1.4** (상한 1.5), **국소 평균 밝기 기준** | `contrast(1.4)` |
| 2톤 | 잉크 `#0B1530` ↔ 종이 `#F7F3E8` (순흑 `#000`·순백 `#FFF` 금지) | `'screen'`로 `#0B1530`(검정 들어올림) + `'multiply'`로 `#F7F3E8`(흰색 누름) |
| 포스터 느낌 | **실제 포스터라이즈 안 함** (getImageData 필요) → 잉크 속도선 텍스처로 대체 | `perfect-impact-ink-lines-v1.png` 또는 1회 절차 생성 |
| 속도선 | 16개, 중심 30–56px에서 시작 → 120px, 잉크 `#0B1530` α≈0.5 | 텍스처 `drawImage` 1회 |
| 컬러 유지 (잉크 위) | 금·보라 링, 스파크, 등급 팝, 퍼펙트 금빛 트레일 | 레이어 순서로 해결 (§5) |

보드 시뮬레이션 측정: 원 안 평균 상대 휘도 0.36→0.39, 0.43→0.45 (**Δ ≈ +0.02–0.03**) — 아래 상한 이내.

---

## 4. 광과민성 (photosensitivity)

- **단일 플래시**: 퍼펙트 1회당 1컷, 반복·깜빡임 없음. 쿨다운 500ms → 초당 ≤2회 (WCAG 2.3.1의 초당 3회 기준 이하).
- **면적**: 원 최대 반경 120px ≈ 화면의 11% (풀스크린 금지). 불꽃 텔 시 84px.
- **휘도 변화 상한**: 원 안 평균 상대 휘도 변화 **|ΔL| ≤ 0.10** (목표 ≤0.05). 대비는 국소 평균 기준으로 올려 평균 밝기 유지. 순흑/순백 금지.
- **중첩 방지**: 같은 프레임의 전역 금 플래시(`setFlash` gold 33ms)는 **프레임 1 동안 원 안 제외 + 원 밖 α×0.5** → 원 안에서 "금 풀 플래시 + 잉크" 이중 변화 금지. 프레임 2부터는 원래 금 플래시.
- **반전(네거티브) 금지** — 휘도 변화가 최대가 되므로.
- 모션 줄이기 → 기본 끔 (§6).

---

## 5. 같은 프레임 우선순위 · 강도표

t=0 = 박자 임팩트 프레임(`fireBeatWarpImpact`). 번호가 작을수록 우선(수정하지 않음).

| 우선 | 채널 | 시점 | 잉크 컷과 동시일 때 | 레이어 |
|---|---|---|---|---|
| 0 | **불꽃 위협 텔** (활성 시) | 투구 전 | 잉크가 텔 실루엣과 겹치면 **잉크 끔**, 아니면 r≤84px | 텔 우선 |
| 1 | 히트스톱 100ms (`applyFreeze(.1)`) | 0–100ms | **변경 없음**. 잉크는 실시간 dt로 프리즈 안에서 재생 | 시간 채널 |
| 2 | **잉크 컷 (본안)** | 0–33ms (≤40) | — | 월드 위 · 귀환공/juice 아래 |
| 3 | 금·보라 링 / 스파크 / 등급 팝 (`beatFlash`, `beatStinger`, `spawnPerfectHitJuice`, `spawnPerfectGradePop`) | 0–33ms~ | **변경 없음**, 잉크 **위**에 그림 → 흑백 속 금이 초점 | 잉크 위 |
| 4 | 전역 금 플래시 (`setFlash` gold 2/60) | 0–33ms | 프레임 1: 원 안 제외 + 원 밖 α×0.5 / 프레임 2: 원래대로 | 최상위 오버레이 |
| 5 | 트라우마² 카메라 펀치 + 금 테두리 | **판정 프레임** 0–33ms | 잉크를 월드 변환 안에서 그려 접촉점을 따라감. 박자 지연 시 펀치가 먼저 끝나 겹치지 않음. 테두리 림은 화면 가장자리라 원과 무관 | 카메라 |
| 6 | 퍼펙트 금빛 트레일 (`game.returns`) | 판정 +75ms~ | 박자 지연 시 이미 날고 있을 수 있음 → 잉크 **위**에 그려 금 유지 | 잉크 위 |
| 7 | 스윙 스미어 (퍼펙트 1.5×) | 판정~180ms | 타자 레이어라 잉크 **아래** → 1–2프레임 잉크 붓선처럼 보임(허용) | 잉크 아래 |
| 8 | 비행 트레일 소멸 (`ball-flight-trail-v1`) | 판정 0–60ms | 잉크 **아래**(원 안에선 회색). α 이미 낮음 | 잉크 아래 |
| 9 | 희동이 피격 플래시 + 리코일 | ≈+480ms | 시간 겹침 없음. 공간상 희동이(y≈280)와 원(y≈606, r120)은 떨어져 있음. 만약 겹치면 **피격 플래시 우선**, 원은 희동이 위 클립 | 맞는 쪽 |

강도 요약 (퍼펙트): 잉크 100% 1프레임 → 50% → 0 · 금 플래시 원 밖 ×0.5 1프레임 · 나머지 채널 강도 불변.

---

## 6. 등급별 · 모션 줄이기

| 상황 | 동작 |
|---|---|
| **퍼펙트** | 잉크 컷 (위 규칙) |
| **굿** | 기본: **OFF** (Perfect 전용). 옵션: 약한 **크림 림 1프레임** — `#F7F3E8` 2px 링 r64, α 0.30, 채도·대비 변화 없음. |
| **미스 / 헛스윙** | **끔** |
| 불꽃 회피 성공 · 피격 | **끔** |
| `prefers-reduced-motion` | **기본 끔**. 옵션 "채도만": 원 안 채도 60%↓ 1프레임, 대비·속도선·2톤 없음, 명도 유지(ΔL≈0) |
| 저사양 (`depthCueLite()`) | `ctx.filter` 미지원/느리면 `'saturation'` 합성 경로만(대비 생략) 또는 끔 |

---

## 7. 캔버스 구현 메모 (프레임마다 getImageData 없음)

```js
const INK_GAP=30, INK_R_FULL=96, INK_FEATHER=24, INK_MS_FULL=16.7, INK_MS_FADE=33, INK_MS_CAP=40;
const INK_COOLDOWN_MS=500, INK_FIRE_TEL_R=84;
let inkCut=null, inkLastMs=-1e9;   // {x,y,ageMs,peak}
const inkBuf=document.createElement('canvas'); // 240×240 × DPR, 1회 생성
```

1. **트리거**: `fireBeatWarpImpact('perfect')` 안에서 `beginInkCut(cx,cy)` — 쿨다운, RM, 불꽃 텔 겹침 검사 후 생성. 굿은 옵션 활성 시 `beginInkRim()`.
2. **업데이트**: `frame()`에서 `updateHeedongHitJuice(dt)`처럼 **프리즈와 무관한 실시간 dt**로 `ageMs` 증가 → 40ms에 null.
3. **그리기 경로 A (권장, `ctx.filter` 지원 시)**:
   - 월드(배경·투수·타자·공)를 그린 직후, 귀환공/juice 전에 호출.
   - `inkBuf`에 메인 캔버스의 원 영역을 `drawImage(canvas, sx,sy,sw,sh, 0,0,…)`로 복사 (GPU 복사, 픽셀 읽기 없음).
   - `ctx.save(); ctx.beginPath(); ctx.arc(x,y,R,0,7); ctx.arc(x,y,INK_GAP,0,7,true); ctx.clip('evenodd');`
   - `ctx.filter='grayscale(1) contrast(1.4)'; ctx.globalAlpha=peak; ctx.drawImage(inkBuf, …); ctx.filter='none';`
   - 2톤: `'screen'` + `#0B1530` 채우기(α.25), `'multiply'` + `#F7F3E8` 채우기 → 페더는 방사 그라데이션 마스크(아래 4).
   - 속도선 텍스처 `drawImage(inkLines, x-120, y-120, 240, 240)` 1회.
4. **페더**: `inkBuf`에서 `destination-in` + `createRadialGradient(r96→r120)`로 가장자리 알파를 만든 뒤 붙임(원 클립 대신).
5. **경로 B (폴백)**: `ctx.filter` 없음 → 원 클립 안에서 `globalCompositeOperation='saturation'`로 `#808080` 채우기(채도 제거) + 2톤 채우기 + 속도선. 대비 생략.
6. **전역 금 플래시 연동**: 프레임 1 동안 `setFlash` 그리기 경로에서 원 영역을 `evenodd`로 빼고 α×0.5.
7. **비용**: 퍼펙트 1회당 1–2프레임 × (복사 1 + 필터 그리기 1 + 채우기 2 + 텍스처 1). 상시 비용 0.
8. **금지**: 시간 배속·프리즈 길이 변경, 판정·점수·히트박스 연결, 풀스크린 필터, `#FF3B3B`.

---

## 8. 크롭 · 익스포트

| 용도 | 보드 좌표 (x0,y0,x1,y1) | 익스포트 | 비고 |
|---|---|---|---|
| Director 리뷰 | 전체 | **1600×900** | `perfect-impact-frame-v1.png` |
| A 4프레임 스트립 | (24,92,1000,528) | 976×436 · 프레임 1장 222×222 (게임 300×300 크롭) | 직전 −16 / 0–16 / 16–33 / ≥33ms |
| B 원 해부도 | (1024,92,1576,528) | 552×436 | 반경 링 30/96/120/140 |
| C 등급 비교 | (24,548,540,880) | 516×332 · 썸네일 150×150 | 굿/퍼펙트/미스 |
| D 우선순위 타임라인 | (564,548,1296,880) | 732×332 | 0–170ms, 40ms 하드 컷 |
| E 모션 줄이기 | (1320,548,1576,880) | 256×332 · 썸네일 104×104 | 끔 / 채도만 |
| 런타임 텍스처 | — | **480×480 투명** (게임 240×240 @2x) | `perfect-impact-ink-lines-v1.png` — 절차 생성으로 대체 가능 |

보드 제작: Python PIL + numpy · Pretendard · 배경 `#050C1D` / 패널 `#081329` · 장면은 실제 `stadium-friend.png` + `batter-10.png` 합성.

---

## 9. 제약 재확인 · 체크리스트
- [ ] 퍼펙트 박자 임팩트 프레임에만, 원형 국소(≤120px), 16–40ms, 1회
- [ ] 시간 배속·히트스톱 길이 **불변**, 실시간 dt로 재생
- [ ] 굿: 기본 OFF · 옵션으로 약한 크림 림 1f · 미스/회피/피격: 끔 · RM: 끔(옵션 채도만)
- [ ] 원 안 |ΔL| ≤ 0.10, 순흑/순백·반전 금지, 쿨다운 500ms
- [ ] 금 링·스파크·등급 팝·금빛 트레일은 잉크 **위**(컬러 유지)
- [ ] 전역 금 플래시: 프레임 1 원 안 제외 + 원 밖 ×0.5
- [ ] 불꽃 텔 활성 시 r≤84px, 겹치면 끔
- [ ] 판정창·히트박스·점수·스침·투구 확률·engine 불변 · `#FF3B3B` 0px

관련: `hitstop-tier-juice-v1.md` · `perfect-trauma-cam-punch-v1.md` · `heedong-hit-flash-recoil-v1.md` · `hit-juice-budget-v1.md` · `swing-smear-followthrough-v1.md` · `perfect-trail-and-juice-v1.md` · `vfx-4lane-readability-v1.md` · `beatwarp-impact-v1.md` · `ball-flight-trail-v1.md`
