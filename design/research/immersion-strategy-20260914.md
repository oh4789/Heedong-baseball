# 「희동이를 이겨라」 몰입·플로우·리텐션 & 인디/모바일 전략 리서치

- **날짜:** 2026-09-14
- **목적:** 디렉터 판단용. 캐주얼 웹/모바일 야구 패링 보스전(드래그 이동·릴리즈 스윙, 불꽃 마구 회피)의 몰입·리텐션·개발 우선순위를 **실무 원칙 + 출처 + 적용 태그**로 정리.
- **전제:** 게임은 이미 라이브(https://oh4789.github.io/Heedong-baseball/). 신규 기획이 아님. **확장 후보(이미 존재·강화):** 칭호, 오늘의 승부, 투수/타자 모션, BGM, 랭킹. **코드 변경 없음(본 문서만).** 유료·코어 규칙 변경 = **[제안]** 만.
- **원칙 수:** 12개 (섹션 합산). 학술 에세이 아님 — 적용 가능 여부 중심.

---

## Section 1 — Immersion / Flow / Retention (캐주얼·모바일)

### 1.1 도전–숙련 균형 (Flow / challenge–skill balance)

| 항목 | 내용 |
|---|---|
| ① 원칙 | 도전과 숙련이 맞을 때 몰입(플로우)이 생김. 너무 쉬우면 지루, 너무 어려우면 불안. 명확한 목표·즉각 피드백이 전제. |
| ② 출처 | https://en.wikipedia.org/wiki/Flow_(psychology) (Csíkszentmihályi flow / optimal experience) |
| ③ 희동이 적용 후보 | **가능** — 스테이지/투구 난이도 곡선은 “규칙 변경”이 아니라 **페이스·빈도·텔레그래프**로 조율 가능. 코어 판정 윈도우를 바꾸면 **[제안]**. |
| ④ 구체 아이디어 | (1) 초반 몇 구는 직구 위주 → 불꽃 등장 전 1회 강조 카피(기존 플로우 문서와 정합). (2) PERFECT / GOOD / MISS 체감 난이도 격차를 juice로 더 뚜렷이(숙련 성장 체감). |

### 1.2 명확한 목표 + 즉각 피드백 (GameFlow)

| 항목 | 내용 |
|---|---|
| ① 원칙 | GameFlow: concentration, challenge, skills, control, clear goals, feedback, immersion, social. 목표는 한눈에, 피드백은 행동 직후. |
| ② 출처 | https://dl.acm.org/doi/10.1145/1077246.1077253 (Sweetser & Wyeth, GameFlow, ACM 2005); QUT: https://eprints.qut.edu.au/44776/ |
| ③ 희동이 적용 후보 | **가능** — “희동이를 이겨라 / PERFECT / 불꽃 회피”는 이미 명확. 피드백 층(사운드·히트스톱·칭호 토스트)을 강화하는 쪽이 안전. |
| ④ 구체 아이디어 | (1) 스윙 결과별 1프레임 동기 피드백 세트(플래시·SFX·짧은 멈춤). (2) 오늘의 승부 목표를 인게임 HUD에 한 줄로 상시 노출(**확장: 오늘의 승부**). |

### 1.3 D1 / D7 / D30 구간별 진단 (리텐션 루프)

| 항목 | 내용 |
|---|---|
| ① 원칙 | D1=온보딩·기대 일치, D7=습관, D30=콘텐츠·라이브옵스 깊이. 구간마다 처방이 다름. |
| ② 출처 | https://appagent.com/blog/mobile-game-retention-benchmarks/ (2026 working ranges / interval diagnosis) |
| ③ 희동이 적용 후보 | **가능** — 무료 웹 게임이므로 UA 벤치마크는 참고만. “첫 세션 재미 / 다음날 이유 / 한 달 깊이” 프레임으로 확장을 배치. |
| ④ 구체 아이디어 | (1) D1: 첫 불꽃·드래그-릴리즈 성공까지 마찰 최소화(카피·풀스크린 UX). (2) D7: 오늘의 승부 + 칭호 잠금해제 알림으로 재방문 이유 고정. |

### 1.4 라이트 데일리 / 스트릭형 습관 루프

| 항목 | 내용 |
|---|---|
| ① 원칙 | 하이브리드·캐주얼은 짧은 코어 + 데일리·미션·가벼운 이벤트로 D7~D30을 올림. 이벤트는 코어에 묶고 과밀은 피함. |
| ② 출처 | https://www.gamigion.com/2025-hybridcasual-market-overview-with-real-data/ (2025 hybridcasual / LiveOps·daily calendar) |
| ③ 희동이 적용 후보 | **가능 · 확장: 오늘의 승부** — 이미 일일 시드 목표가 있음. 스트릭·캘린더 UI는 무료 범위에서 강화. 출석 보상 유료화는 **[제안]**. |
| ④ 구체 아이디어 | (1) 연속 일수(KST) 배지 + “어제도 이겼다” 한 줄. (2) 클리어 시 칭호 `일일 타자`와 연동 연출 강화(**확장: 칭호**). |

### 1.5 공정한 실패 → “한 판 더” (fair fail / retry loop)

| 항목 | 내용 |
|---|---|
| ① 원칙 | 실패가 “속임수”가 아니라 “읽기 실패”로 느껴질 때 재시도가 늘어남. 결정적·학습 가능한 패턴이 핵심. |
| ② 출처 | https://www.gamigion.com/2025-hybridcasual-market-overview-with-real-data/ (Color Block Jam: deterministic fairness → retry) |
| ③ 희동이 적용 후보 | **가능** — 불꽃 마구·보스 패턴의 **텔레그래프 명료화**가 공정성 지름길. 판정 완화는 **[제안]**. |
| ④ 구체 아이디어 | (1) 패배 화면: “불꽃 N회 / PERFECT N” 학습 요약. (2) 같은 시드 재도전 시 패턴 기억 보상 카피(스코어 규칙 변경 없음). |

---

## Section 2 — Indie / Mobile 개발 전략

### 2.1 코어 루프 우선 + 스코프 통제 (MoSCoW)

| 항목 | 내용 |
|---|---|
| ① 원칙 | 피처 리스트가 아니라 코어 루프부터. MVP → 버티컬 슬라이스 → 확장. Must를 극소로, Won't를 문서화. |
| ② 출처 | https://generalistprogrammer.com/tutorials/how-to-scope-an-indie-game (2026 scoping / MoSCoW / cut order) |
| ③ 희동이 적용 후보 | **가능** — 코어(드래그·릴리즈·패링·불꽃 회피·보스)는 이미 존재. **확장 5종만 Should/Could로 등급**. 새 모드·유료·규칙 = Won't 또는 **[제안]**. |
| ④ 구체 아이디어 | (1) Must=코어 판정·가독성·피드백. Should=칭호·오늘의 승부·랭킹 juice. Could=추가 모션 프레임·BGM 레이어. (2) 컷 오더 사전 고정: “새 투수 풀”보다 “한 스윙의 손맛”. |

### 2.2 Juice / Polish — 루프가 재미난 뒤의 감각 정보

| 항목 | 내용 |
|---|---|
| ① 원칙 | Juice = 행동 순간의 AV 응답(플래시·쉐이크·파티클·히트스톱·SFX). 동기화가 핵심. 과다 사용은 가독성·멀미를 해침. |
| ② 출처 | https://www.gamedeveloper.com/design/video-is-your-game-juicy-enough- (Juice it or lose it, GDC Europe); https://www.youtube.com/watch?v=Fy0aCDmgnxg ; https://uhiyama-lab.com/en/notes/unity/unity-game-feel-hit-feedback/ (2026 game-feel intensity presets) |
| ③ 희동이 적용 후보 | **가능** — 코어 규칙 불변. PERFECT/일반/헛스윙/불꽃 회피 강도 프리셋. |
| ④ 구체 아이디어 | (1) Weak/Strong/Critical 대응: 일반 히트 / PERFECT / 스테이지 클리어. (2) 쉐이크는 피니시·불꽃 회피 성공에만 — 매 타구 쉐이크 금지. |

### 2.3 깊이 > 넓이 (버티컬 슬라이스 폴리시)

| 항목 | 내용 |
|---|---|
| ① 원칙 | 반쯤 된 시스템 10개보다 한 루프를 ship 품질로. 폴리시한 한 조각이 전체 원가·감성 기준이 됨. |
| ② 출처 | https://generalistprogrammer.com/tutorials/how-to-scope-an-indie-game ; https://gtstu.com/scope-your-first-indie-game-so-you-actually-ship-it/ |
| ③ 희동이 적용 후보 | **가능 · 확장: 투수/타자 모션, BGM** — “한 구 풀사이클”(와인드업→릴리즈→스윙→결과→리셋)을 최종 품질 기준 슬라이스로. |
| ④ 구체 아이디어 | (1) 모션·SFX·pitchcall이 같은 프레임에 맞는지 체크리스트. (2) 새 스테이지/모드보다 이 슬라이스 반복 품질. |

### 2.4 측정·피드백 루프 (라이브 후 튜닝)

| 항목 | 내용 |
|---|---|
| ① 원칙 | 리텐션·세션·난이도 체감은 출시 후 반복 튜닝. 커뮤니티·플레이 관찰로 작은 감각 수정이 수명을 가름. |
| ② 출처 | https://www.gamigion.com/2025-hybridcasual-market-overview-with-real-data/ (Measure & Iterate); https://appagent.com/blog/mobile-game-retention-benchmarks/ |
| ③ 희동이 적용 후보 | **가능** — 웹이면 가벼운 이벤트(클리어율, 불꽃 피격률, 일일 재방문)만으로도 충분. 과한 애널리틱스 SDK는 **보류**. |
| ④ 구체 아이디어 | (1) 로컬 로그/간단 카운터: 첫 불꽃 피격률, 오늘의 승부 클리어율. (2) 플레이어 한 줄 피드백 → 주간 1개 juice/카피 패치. |

---

## Section 3 — 장르 특화 몰입 (야구 · 패링 · 보스러시 · 원터치)

### 3.1 보스 텔레그래프 = 공정한 대화

| 항목 | 내용 |
|---|---|
| ① 원칙 | 불공정은 난이도가 아니라 **의도 전달 실패**. Anticipation → Wind-up → Hold → Release → Recovery. 유의미 공격은 약 300–500ms 경고. |
| ② 출처 | https://charios.com/blog/shmup-boss-pattern-tells-animation (2026-05 boss-pattern tells) |
| ③ 희동이 적용 후보 | **가능 · 확장: 투수 모션** — 희동이 와인드업·불꽃 전용 포즈를 공격 타입별로 구분. |
| ④ 구체 아이디어 | (1) 직구 vs 불꽃: 팔/색/오라를 서로 다른 실루엣으로. (2) 불꽃 직전 pitchcall + 모션 Hold 한 박자(규칙 변경 없이 리드타임만). |

### 3.2 패링·스윙의 등급형 히트 피드백

| 항목 | 내용 |
|---|---|
| ① 원칙 | 히트 이펙트는 장식이 아니라 정보: 맞았나 / 어디 / 얼마나 / 중요한 순간인가. Weak·Strong·Critical 대비가 손맛. |
| ② 출처 | https://uhiyama-lab.com/en/notes/unity/unity-game-feel-hit-feedback/ ; https://medium.com/@menardisaac/making-a-sekiro-like-combat-design-boss-3f2909c6487d (패링 피드백·패턴 학습) |
| ③ 희동이 적용 후보 | **가능** — PERFECT vs 일반 vs 헛스윙 vs 불꽃 회피 성공을 각각 다른 정보 채널로. |
| ④ 구체 아이디어 | (1) PERFECT: 짧은 히트스톱 + 크래시 SFX + 배트 플래시. (2) 불꽃 회피: 화면 가장 쉐이크·“회피!” 플로팅 텍스트(매 일반 스윙에는 미적용). |

### 3.3 야구형 타이밍·릴리즈 인식 (pitch read)

| 항목 | 내용 |
|---|---|
| ① 원칙 | 야구 게임 몰입은 “언제 스윙할지”를 릴리즈·궤적으로 읽게 하는 것. 타이밍 창·입력 지연·시각 단서가 손맛의 본체. |
| ② 출처 | https://artisan.accel.com/mlb-the-show-decoding-the-pci-explained-unlocking-the-secret-sauce-behind-hit-feel (PCI / hit feel); https://www.cronus2k.com/blog/mlb-the-show-pitch-recognition-timing (pitch recognition · timing) |
| ③ 희동이 적용 후보 | **가능** — 심플 PCI 없이도 **릴리즈 순간 강조 + 공 실루엣 대비**로 읽기 가능. 판정 창 수치 변경은 **[제안]**. |
| ④ 구체 아이디어 | (1) 릴리즈 프레임에 투수 손/공 하이라이트 1틱. (2) 불꽃은 색·파티클·궤적 곡률을 직구와 즉시 구분. |

### 3.4 원터치·드래그-릴리즈 FTUE (조작 몰입)

| 항목 | 내용 |
|---|---|
| ① 원칙 | 캐주얼은 첫 세션에서 핵심 조작을 “설명 없이 성공”시켜야 D1이 산다. 원터치/드래그 계열은 마찰이 곧 이탈. |
| ② 출처 | https://www.devtodev.com/resources/articles/main-metrics-ftue (FTUE); 기존 내부 스펙 `design/flow-and-fullscreen-v1.md` (첫 판 인지 부하·불꽃 강조) |
| ③ 희동이 적용 후보 | **가능** — 규칙 유지. 카피·고스트 가이드·첫 성공 연출만. 탭=스윙 오해 해소. |
| ④ 구체 아이디어 | (1) ready 상태 손가락 궤적 고스트 1회. (2) 첫 PERFECT 시 칭호 `첫 퍼펙트` 팝업으로 성공 각인(**확장: 칭호**). |

---

## 우선순위 TOP5 (지금 할 것)

| 순위 | 항목 | 태그 | 왜 지금 | Effort |
|---|---|---|---|---|
| **1** | 스윙/패링/회피 **등급형 Juice** (PERFECT·일반·헛스윙·불꽃 회피) | **가능** | 코어 루프 손맛이 몰입·재시도의 엔진. 규칙 불변. | **M** |
| **2** | **불꽃 마구 텔레그래프** (모션·색·pitchcall·Hold) | **가능 · 확장: 투수 모션** | 공정 실패 → 학습 → 한 판 더. 보스 아이덴티티. | **S–M** |
| **3** | **오늘의 승부** 습관 루프 강화 (HUD 목표·연속일·클리어 연출) | **가능 · 확장: 오늘의 승부** | D7 이유. 이미 구현 골격 있음 → 폴리시만. | **S** |
| **4** | **칭호 + 랭킹** 피드백 루프 (해금 토스트·장착 가시성·결과 화면 노출) | **가능 · 확장: 칭호, 랭킹** | 사회·수집 동기. 무료 메타. | **S–M** |
| **5** | **한 구 버티컬 슬라이스** (모션+BGM/SFX 동기화 마스터) | **가능 · 확장: 모션, BGM** | 이후 모든 확장의 품질 기준. 넓이보다 깊이. | **M** |

### TOP5 밖의 메모
- **보류:** 무거운 LiveOps 캘린더, 배틀패스, 복잡한 애널리틱스.
- **비추천(현재):** 코어 판정 윈도우·아웃 규칙 대수술, 멀티플레이 경쟁 매치.
- **[제안]만:** 유료 스킨/광고 제거, 판정 완화 부스터, 에너지 게이트.

---

## 디렉터 체크리스트 (한눈에)

| # | 원칙 | 적용 | 비고 |
|---|---|---|---|
| 1.1 | Flow 도전–숙련 | 가능 | 페이스·텔레그래프 우선 / 판정 변경=[제안] |
| 1.2 | GameFlow 목표·피드백 | 가능 | juice·HUD |
| 1.3 | D1/D7/D30 진단 | 가능 | 확장 배치 프레임 |
| 1.4 | 데일리·라이트 라이브옵스 | 가능 | 오늘의 승부 |
| 1.5 | Fair fail → retry | 가능 | 불꽃 가독성 |
| 2.1 | MoSCoW 스코프 | 가능 | 확장 5종만 |
| 2.2 | Juice | 가능 | TOP1 |
| 2.3 | 버티컬 슬라이스 | 가능 | TOP5 |
| 2.4 | 측정·피드백 | 가능 | 라이트만 |
| 3.1 | 보스 텔레그래프 | 가능 | TOP2 |
| 3.2 | 패링 등급 피드백 | 가능 | TOP1과 결합 |
| 3.3 | Pitch read | 가능 | 시각 단서 |
| 3.4 | 드래그-릴리즈 FTUE | 가능 | D1 |

**코드:** 본 문서는 `design/research/`에만 작성. 게임 소스 미수정.  
**라이브:** https://oh4789.github.io/Heedong-baseball/
