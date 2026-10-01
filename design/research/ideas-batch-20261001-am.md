# 2026-10-01 AM 외부 아이디어

- **NO_NEW=false**
- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — 희동이 마운드 idle 강도 에스컬레이트 · 패배「한 호흡」인비트윈 브레스 · 릴리즈 스윙 시작 배트 후시(SFX) 3개. **축:** 진행감 / 리트라이 동기 / 사운드. Perfect 히트 스크린 juice·타이밍 방향 힌트 **전면 금지**.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, 글러브 티핑, Trauma 카메라, VFX 4레인, 공 캐스트 그림자, 피격플래시+리코일, 시임/스핀 텔, Doppler 니어미스 whizz, 불꽃 직전 눈빛 텔, 열왜곡, 회피 애프터이미지, Miss 방향 카메라 임펄스, 방향성 임팩트 카메라 킥, 크라우드 RTPC, 주변시 엣지 밝기 펄스, 스윙 스미어+팔로우스루, Miss/Good/Perfect juice 예산표, settle+idle fidget, WANDR 가림, Bullet Dance aim-lock, Flukz 패턴 리믹스, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 히트스톱, 모양언어, 색만 구종 ID, EARLY/LATE 라벨·타이밍 방향 힌트, 약점글로우, 뮤직 스템[제안], 이점/약점 모디[제안], 비가시 타이밍창 DDA[제안], Nine Sols 부정확패리, mushy contact, Takamido 전신 텔, Witch Time 회피, 배트 킥백+접촉 더스트/스파크, 공 비행 트레일 잔상, Perfect 임팩트 프레임(1–2컷), 불꽃 Hold/Charge, Hitting DoF/릴리즈 존 DoF, Perfect 크로매틱 수차 펀치, 마운드/플레이트 환경 먼지, 접촉점 등급 플로팅 텍스트(Perfect/Good), 배트/공 스쿼시·스트레치 스프링 펀치, Perfect FOV 줌 펀치, Perfect 비네트 펄스, 배트/공 머티리얼 화이트 플래시, 확장 충격파 링(A), soft→hard 릴리즈 포커스 앵커(B), 스쿼시 쇼트리스트(C), Color Grade 골든 틴트, bloom 스파이크, 캐처 미트 스냅, 만화 방사 스피드라인. **추가 재제안 금지(기존 시안·HARD):** 페이즈 HP 청크·보스 페이즈 배너, 이닝스톱 CTA, 페일라인/페일 리뷰 칩, 피치 래더 SFX, 승리 결과 카드 골격, 패배「불꽃N·PERFECTN·MissN」한줄 요약 그 자체, 1탭 재도전·희동이 도발(이미 적용), 칭호·연승·스탬프·친구응원·고스트배트·FTUE, 구수 X/Y 카운터, 베스트 런 데미지 커브 고스트(러너업). **9/29 PM TOP→HARD:** 보스 페이즈 월드 시프트(구장 팔레트·희동이 실루엣·소형 페이즈 칩), 패배 거의 이김 잔여 HP 히어로(+도전 프라이드), 페이즈 BGM 인텐시티 스냅샷+실패 earned silence. **9/30 AM TOP→HARD:** 구장 스코어보드·플로드라이트 마이크로 비트, 패배 개인 베스트 델타, 불꽃 비행 예감 라이저 SFX. **9/30 PM TOP→HARD:** 관중 빌보드 치어 에너지 스파이크(비주얼만), 재도전「바꿀 한 수」전략 프롬프트, 불꽃 회피 성공 확인 처프 SFX. **AM/PM 러너업 1차 TOP 금지:** 페이즈 진입 뮤지컬 스팅어, 플레이어 저HP 심박 베드, 접촉 머티리얼 레이어, FINAL 도달 프라이드 배지, 세션 개선 스파크라인, 승리 절차 아르페지오 팡파르.
- **코드·밸런스·스토리:** 미수정. 본 문서만. 유료·코어 규칙 변경 = **[제안]** 만.

---

## TOP

### ① 희동이 **마운드 idle 강도** 에스컬레이트(포즈·애니만)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://flukz.org/devlog/boss-fight-design-indie-shmup/ (2026-06: 페이즈 전환을 북키핑이 아닌 **신호·리스파이트·형태 변화** 순간으로) · https://www.gamedeveloper.com/design/opinion-boss-design---tips-from-a-combat-designer (Birkhead: Anticipation·Exaggeration·Staging — 보스는 과장된 준비 포즈로 읽힌다) · https://www.jasondeheras.com/gamedesign/2021/4/23/how-do-3rd-person-melee-combat-games-communicate-game-and-hit-feel (과장 포즈·실루엣 스냅으로 의도·강도 가독) |
| ② 한줄 요약 | 페이즈 임계에서 **희동이 마운드 idle/셋업 포즈만** 한 단계 더 공격적으로(스탠스 폭·글러브 높이·볼 그립·호흡 리듬) 바꿔 ‘회가 바뀌었다’를 보스 존재감으로 읽힌다 — 구장 팔레트·실루엣 칩·보드·관중·HP청크·배너 없이. |
| ③ 왜 희동이 게임에 맞는지 | HARD **월드 시프트**(하늘/흙·실루엣·소형 칩)·**스코어보드·플로드라이트**·**관중 빌보드 치어**·HP청크·배너와 **다른 채널**(보스 캐릭터 애니만). Perfect juice·타이밍 힌트·구종 텔(눈빛/글러브)과 무관 — **페이즈 임계 idle**만. 판정·점수 불변. |
| ④ TOP 적용안 | (1) 기존 페이즈 경계 통과 시: 희동이 idle 클립을 `phaseIdleTier` 0→1→2로 교체(또는 동일 클립의 scale/스탠스 파라미터만 ↑) — 투구 윈드업 텔·불꽃 눈빛 HARD와 분리. (2) 동시에 팔레트·스코어보드 플립·플로드라이트·관중 에너지·소형「2회」칩·HP청크·배너 재도입 금지. (3) settle+idle fidget HARD 유지 — 본안은 **페이즈 단위 강도 티어**이지 매 투구 fidget이 아님. (4) 저사양: 포즈 스왑 대신 어깨 라인/글러브 Y만 +4~8px. Perfect 스크린 juice 금지. |
| 판정/규칙 변경 | **없음** (보스 idle 애니만). |

---

### ② 패배 **「한 호흡」** 인비트윈 브레스(저마찰)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://ics-gmt.science.uu.nl/node/54 (2026-07: Master Blaster — 큰 좌절 직후 **짧은 가이드 호흡**이 순간 좌절↓; 비주얼 호흡 가이드를 게임 안에 임베드) · https://www.gamedeveloper.com/design/in-between-spaces-and-their-design (시도 사이 **인비트윈 공간**을 설계하면 학습·재정비가 자리 잡음) · https://www.joyplayx.com/article/how-to-handle-failure-in-games-designing-death-and-retry-loops (2025-06: 실패 톤·프레임이 재시도 동기; 빠른 재시작은 유지하되 감정적 숨 고르기) · https://www.socratopia.app/library/game-design-compelling-en/chapter-19 (실패의 **friction**을 설계 파라미터로 — 너무 길면 이탈, 0이면 무게 없음) |
| ② 한줄 요약 | 패배 화면에 **1.0–1.8s 한 호흡(들숨→날숨) 마이크로 인비트윈**을 두고 sticky「다시 승부」가 무장되는 느낌을 준다 — 잔여 HP 히어로·PB 델타·「바꿀 한 수」전략·페일 리뷰·soft continue와 슬롯 분리. |
| ③ 왜 희동이 게임에 맞는지 | HARD **거의 이김 잔여 HP**·**개인 베스트 델타**(수치)·**「바꿀 한 수」전략 프롬프트**(카피)·**페일라인/페일 리뷰**·「불꽃N·PERFECTN·MissN」요약·soft continue와 **다른 축**(시간·호흡 UX). 1탭 재도전(이미 적용)은 유지 — 강제 긴 카운트다운·유료 이어하기 금지. EARLY/LATE·치명 구종 진단 없음. |
| ④ TOP 적용안 | (1) 패배 오버레이 등장 직후: 중앙 또는 CTA 위에 **원형/바 호흡 가이드** 1사이클(≈1.0–1.8s) — 카피 예: `한 호흡` / `준비`. (2) sticky「다시 승부」는 **호흡 중에도 탭 가능**(Joyplayx식 빠른 재시작 유지); 호흡이 끝나기 전 탭 시 가이드만 스킵. (3) 잔여 HP·PB 델타·전략 한 줄·페일 리뷰 칩을 이 슬롯에 넣지 않음. (4) soft continue·유료 이어하기·연승/칭호 토스트 금지. |
| 판정/규칙 변경 | **없음** (패배→재도전 UX만. 점수식·판정창 불변). |

---

### ③ 릴리즈 **스윙 시작 배트 후시**(SFX, 타격 juice·비행 라이저 아님)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://add.app/sound-effects/baseball-sound-effects/ (2024-05: 스윙/투구 **whoosh**는 속도·의도 가독; 접촉 crack과 역할 분리) · https://freesound.org/people/MrGungus/sounds/766542/ (2024-11: 플라스틱 배트 스윙 swoosh 실녹 — 짧은 후시 슬롯) · https://www.jasondeheras.com/gamedesign/2021/4/23/how-do-3rd-person-melee-combat-games-communicate-game-and-hit-feel (ANTICIPATION/wind-up 구간의 SFX가 의도·에이전시를 전달; 히트 프레임 SFX와 분리) |
| ② 한줄 요약 | 드래그 후 **릴리즈→스윙 시작 프레임**에만 짧은 배트 후시 1샷으로 ‘휘둘렀다’를 귀에 남긴다 — Perfect 타격 juice·불꽃 비행 라이저·회피 처프·피치 래더·BGM 스냅샷 아님. |
| ③ 왜 희동이 게임에 맞는지 | HARD **불꽃 비행 예감 라이저**(비행 중)·**회피 성공 확인 처프**(회피 후)·**페이즈 BGM 스냅샷+silence**·**뮤직 스템**·**피치 래더**·**스윙 스미어**(비주얼)·Perfect 히트 juice와 **다른 슬롯**(플레이어 릴리즈 **시작** SFX). 접촉 crack/머티리얼·등급 pitch 금지. 판정창 불변. |
| ④ TOP 적용안 | (1) 릴리즈 확정→스윙 애니 시작 콜백에 **80–140ms** noise/bandpass 후시 1샷(키는 BGM과 충돌 적게, master 대비 −8~−12dB). (2) Good/Perfect/Miss 접촉 순간·불꽃 회피·비행 중에는 재생하지 않음(타격 juice·라이저·처프 슬롯과 분리). (3) 스윙 스미어 VFX·배트 킥백·접촉 더스트 HARD 재도입 금지. (4) 뮤트·reduce-audio 옵션 존중. |
| 판정/규칙 변경 | **없음** (릴리즈 시작 SFX만). |
| **BGM 전제** | `music.js` 절차음 **2모드만**(opening/play), 외부 스템·파일 없음. Master gain ≈0.06–0.08. Mute 존중. 본안은 BGM 그래프를 건드리지 않는 **원샷 SFX**. |
| **구현 난이도** | **쉬움** — 릴리즈/스윙스타트 콜백에 oscillator+noise 후시 1샷; BGM 모드·gain·filter·silence 로직 불필요. 샘플 없이도 절차 합성 가능. |

---

## 제외/확장만

| 아이디어 | 처리 | 이유 |
|---|---|---|
| 관중 치어·「바꿀 한 수」·회피 처프 | HARD(9/30 PM) | 재제안 금지. ①②③은 보스idle·호흡UX·스윙후시로 슬롯 분리. |
| 스코어보드·플로드라이트·PB 델타·불꽃 비행 라이저 | HARD(9/30 AM) | 재제안 금지. |
| 월드 시프트·잔여 HP 히어로·BGM 스냅샷+silence | HARD(9/29 PM) | 재제안 금지. ①은 팔레트/칩 없이 보스 포즈만. |
| 페이즈 진입 뮤지컬 스팅어 | AM 러너업 | 1차 TOP 금지 — ③은 스윙 시작 후시 우선. |
| 저HP 심박 베드·접촉 머티리얼·FINAL 프라이드 배지·세션 스파크라인·승리 아르페지오 | 러너업/스킵 | 1차 TOP 금지. |
| 강제 긴 패배 카운트다운(≥3s)·CTA 잠금 | 스킵 | Joyplayx식 빠른 재시작·기존 1탭 sticky와 충돌 — ②는 스킵 가능 단호흡만. |
| 플레이트 도착 thud(일반구) | 러너업 | ③과 슬롯 경쟁 — 스윙 에이전시 후시 우선. |
| 페이즈 풍속 ambient 베드 | 러너업 | BGM 스냅샷 HARD와 경계 주의 — 본 배치 TOP 아님. |
| 덕아웃/파울폴 프롭 비트 | 러너업 | 보드/관중 HARD와 인접 — 보스 idle 채널 우선. |

---

## Director용 한줄 요약

**AM TOP(판정불변·진행/리트라이/사운드):** ①희동이 마운드 idle 강도 에스컬레이트(월드 시프트·보드/라이트·관중 치어·HP청크·배너 금지) → ②패배「한 호흡」인비트윈 브레스(잔여 HP·PB 델타·전략 프롬프트·페일 리뷰·EARLY/LATE 금지, sticky 1탭 유지) → ③릴리즈 스윙 시작 배트 후시 SFX(비행 라이저·회피 처프·스냅샷·스템·피치 래더·타격 juice 아님).

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-10-01 ~10:30 KST AM 루틴
