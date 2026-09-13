# 플로우 이슈 + 풀스크린/반응형 개선 스펙 v1.1
> v1.1: 플레이테스트 확인 — 데스크톱 세로 480 프레임 레터박스를 P0·완료 기준으로 명시.
대상: 「희동이를 이겨라」 1차 플레이어블  
범위: UI/레이아웃·온보딩 카피 배치만. 핵심 규칙·아트 컨셉·캔버스 논리 해상도(480×850) 변경 없음.

---

## 1) 현재 플레이 흐름 점검

| 단계 | 현재 | 판정 |
|---|---|---|
| 오프닝 | 첫 방문 시 시네마틱 자동 재생, 건너뛰기 있음 | OK (스킵 명확) |
| 시작 | 도발 아트 + 3줄 룰 + CTA `플레이 볼` | OK |
| 플레이 | footer `드래그로 이동 · 손 떼면 스윙` + `#pitchcall` | OK~주의 |
| 결과(승) | 강화 선택 → 이어하기 | OK |
| 결과(패) | `다시 승부하기` | OK |
| 재시작 | 패=retry / 승=upgrade continue | OK |

### 플로우 이슈 리스트 (짧음)

1. **P0 · 데스크톱 레터박스 (플레이테스트 확인)**  
   QA에서 데스크톱이 **세로 480폭 프레임**처럼 양옆 거터(레터박스)로 보임. 원인: `#game { width:min(100%,480px); max-height:960px; box-shadow… }` + `body` flex 중앙 정렬.  
   결과: 풀스크린 구장이 아니라 페이지 가운데 폰 시연 창. **풀스크린 개선안의 최우선 수용 포인트.**

2. **P1 · 첫 판 초반 인지 부하**  
   시작 패널 룰 3줄은 충분. 다만 첫 투구 전 인게임 코칭이 footer 한 줄뿐. 초록 원=`PARRY` 라벨은 `game.state==='ready'`일 때만라 실제 플레이 중엔 안 보일 수 있음.

3. **P1 · 불꽃 마구**  
   룰 03 + pitchcall `⚠ 불꽃 마구 · 회피`로 가능. 첫 불꽃 직전 1회 강조 토스트가 있으면 더 안전(카피만, 규칙 변경 X).

4. **P2 · 시작 패널 세로 오버플로**  
   짧은 뷰포트에서 records·랭킹·인트로 다시보기까지 쌓이면 스크롤. CTA가 접힐 수 있음 → sticky CTA 권장.

5. **P2 · PC 조작 안내 위치**  
   `#loadnote.keyboard` 10~12px로 약함. 터치 우선 유저엔 OK, 데스크톱 첫 유저는 SPACE 스윙을 놓치기 쉬움.

6. **P3 · 오프닝 → 시작**  
   영상 후 바로 패널. 흐름은 자연스러움. 재방문은 `beat-heedong.video-v1-seen`으로 스킵되어 좋음.

### 초보 유저 판정 (설명 없이 가능한가?)

**조건부 Yes.**  
모바일 터치 기준: 시작 3룰 + footer + pitchcall이면 **첫 직구 패링까지는 가능**.  
실패 지점: (1) 데스크톱에서 작은 창 느낌으로 몰입 전 이탈, (2) “손 떼서 스윙”을 탭으로 오해, (3) 첫 불꽃 마구.  
핵심 규칙 변경 없이 **레이아웃 풀스크린 + CTA 고정 + 첫 불꽃 강조 카피**면 충분.

---

## 2) 풀스크린 / 반응형 개선 스펙 (선택자·수치)

### 목표
- **플레이테스트 확인 이슈:** 데스크톱 세로 480 프레임 레터박스 제거
- 뷰포트 전체를 구장으로 쓰기 (`#game` 100vw×100dvh, 거터·카드 섀도우 제거)
- 플레이 필드(캔버스 논리 480×850)는 **비율 유지 스케일** — 셸은 풀스크린, 플레이 버퍼만 비율 유지
- HUD·오버레이는 `#game` 전체 폭 사용 (모바일 풀블리드)
- 아트/판정 로직 좌표 변경 없음

### QA 재현 (레터박스)
1. 데스크톱(예: 1280×800)에서 로컬/라이브 오픈
2. `#game`이 가로 ≈480px 기둥으로 중앙 정렬되고 좌우에 `#030913` 거터 → **Fail**
3. Pass: `#game`이 뷰포트 전체. 캔버스만 비율 스케일되며, 양옆은 “빈 웹페이지”가 아니라 `#game` 배경(구장 라디얼)으로 연속


### 시각 증거 (1280×800 로컬)
- 시작 화면: 좁은 ~480px 중앙 기둥 + 좌우 다크 페이지 거터. 시작 패널 세로 스크롤 있음.
- 인게임 HUD: 동일하게 폰 폭 프레임 안에 가둠.
- 캡처: `design/evidence/desktop-letterbox-start.webp`, `design/evidence/desktop-letterbox-hud.webp`

### A. 셸 — 거터 제거

```css
html, body {
  margin: 0;
  height: 100%;
  width: 100%;
  background: #030913; /* 기존 유지, 거터 색=게임 배경과 동일하게 느껴지게 */
  overflow: hidden;    /* 페이지 스크롤 방지. 스크롤은 #overlay 내부만 */
}

body {
  display: block;      /* flex 중앙정렬 제거 */
}

#game {
  position: relative;
  width: 100%;
  height: 100dvh;
  max-width: none;     /* ← min(100%,480px) 제거 */
  max-height: none;    /* ← 960px 제거 */
  overflow: hidden;
  background: #0a182d;
  box-shadow: none;    /* ← 카드형 창 느낌 제거 */
  border-radius: 0;
}
```

### B. 캔버스 — 비율 유지 + 화면 채움

논리 해상도 480×850 유지. CSS만으로 스케일.

**권장: height cover + 가로 중앙 (양옆 레터박스는 구장 그라데이션으로 채움)**

```css
#game {
  /* 측면 필 느낌: 캔버스 뒤에도 같은 네이비 */
  background:
    radial-gradient(ellipse at 50% 30%, #1a3a5c 0%, #0a182d 55%, #030913 100%);
}

#field {
  position: absolute;
  inset: 0;
  margin: auto;
  display: block;
  /* 세로를 우선 채우고, 가로는 비율대로 */
  height: 100%;
  width: auto;
  max-width: none;
  aspect-ratio: 480 / 850;
  object-fit: contain; /* canvas는 replaced element처럼 동작; 안 되면 아래 JS 스케일 대안 */
  touch-action: none;
}

/* 좁은 폰: 가로도 꽉 채움 */
@media (max-aspect-ratio: 480/850) {
  #field {
    width: 100%;
    height: auto;
    max-height: 100%;
  }
}
```

**프로그래머 노트 (최소 JS, 규칙 변경 X)**  
pointer 스케일은 이미 `W/canvas.clientWidth`, `H/canvas.clientHeight` 사용 중 → CSS 크기만 바꿔도 입력 정렬 유지.  
`canvas`에 `aspect-ratio`가 환경마다 무시되면:

```js
// resize observer 한 줄급: #game 크기에 맞춰 client 스타일만 조정
// 내부 buffer는 480×850 유지 (drawImage/판정 불변)
```

대안(더 공격적 cover): `#field { width:100%; height:100%; object-fit:cover }` — 상하 또는 좌우 크롭. 타격 존이 잘릴 수 있어 **1차는 contain+필 배경 권장**.

### C. HUD — 풀폭 유지, 가독 폭만 제한

header/footer는 이미 `position:absolute; width:100%`. 와이드에서 텍스트가 양 끝까지 늘어지지 않게:

```css
header .top,
header .boss-label,
header .bar,
header .meta,
footer .scoreline,
footer .readiness,
footer .coolbar,
footer > p {
  max-width: 520px;   /* 기존 480 카드감의 가독 폭만 유지 */
  margin-left: auto;
  margin-right: auto;
}

header, footer {
  padding-left: max(18px, env(safe-area-inset-left));
  padding-right: max(18px, env(safe-area-inset-right));
}

#pitchcall, #feedback {
  max-width: 520px;
  left: 50%;
  transform: translateX(-50%); /* feedback의 rotate와 충돌 시 wrapper 권장 */
}
```

`#feedback`은 기존 `rotate(-5deg)` 있음 → wrapper `#feedback-wrap`에 중앙 정렬, 내부 rotate 유지가 안전.

### D. 오버레이/시작 패널

```css
#overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: safe center; /* 또는 flex-end 모바일 유지 시 safe flex-end */
  justify-content: center;
  padding:
    max(12px, env(safe-area-inset-top))
    max(16px, env(safe-area-inset-right))
    max(16px, env(safe-area-inset-bottom))
    max(16px, env(safe-area-inset-left));
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background: #030b19c9; /* 풀스크린 딤 — 양옆도 같은 딤 */
}

.panel {
  width: min(100%, 420px); /* 와이드에서도 패널만 폰 폭 */
  max-height: min(92dvh, 820px);
  /* 기존 radius/gradient/border 유지 */
}

/* P2: CTA 접힘 방지 */
.start-panel {
  display: flex;
  flex-direction: column;
}
.start-panel .primary {
  position: sticky;
  bottom: 0;
  z-index: 2;
  /* 스크롤 시에도 보이도록 하단 페이드 배경 선택 */
  box-shadow: 0 -12px 24px #080f25ee;
}
```

### E. 시네마틱

이미 `position:absolute; inset:0` → `#game` 풀스크린화와 자연 연동. 추가:

```css
.cinematic {
  inset: 0; /* 유지 */
}
#opening-video {
  object-fit: cover; /* 유지 */
}
```

### F. 브레이크포인트 요약

| 뷰 | `#game` | `#field` | `.panel` |
|---|---|---|---|
| 폰 ≤480 CSS px | 100×100dvh | width 100%, height auto(비율) | 100% |
| 태블릿/데스크톱 | 100×100dvh | height 100%, width auto, 중앙 | ≤420px |
| 초광폭 | 동일 | 동일 + 측면 라디얼 필 | ≤420px |

### G. 하지 말 것 (범위 가드)

- `engine` 판정 좌표·보스 HP·투구 패턴 변경 금지
- 스토리보드/오프닝 아트 교체 금지
- `#game`을 다시 `max-width:480`으로 묶지 말 것
- body에 밝은 거터/별도 페이지 크롬 추가 금지

---

## 3) 온보딩 마이크로 (레이아웃만, 카피 최소)

규칙 변경 없이 배치만:

1. 첫 플레이 10초 또는 첫 windup 전: `#pitchcall`에 기존 톤으로  
   `드래그로 자리 → 손 떼면 스윙` 1회 (이미 footer와 중복이면 windup 시작 시 생략)
2. 첫 `fire` windup: 기존 `⚠ 불꽃 마구 · 회피` 유지 + 글자색 `#ffab88` (이미 있음) — **추가 카피 불필요, 표시 시간만 4s→5s 검토**
3. PC: `#loadnote`를 CTA 바로 아래로 올리고 14px (`#AABED8`)

---

## 4) 구현 우선순위 (프로그래머)

1. **A+B**: `#game` 풀뷰포트 + box-shadow/max-width 제거 + 캔버스 비율 스케일  
2. **D**: 오버레이 풀딤 + panel max-width + sticky CTA  
3. **C**: HUD max-width 520 중앙  
4. **온보딩 마이크로** (선택)

완료 기준:
- 1280×800에서 **세로 480 프레임 레터박스 없음** (`#game` 가로 = 뷰포트)
- 양옆이 페이지 거터가 아니라 `#game` 구장 배경으로 연속
- 오버레이 딤도 뷰포트 전체
- ≤480폭 모바일 회귀 없음
