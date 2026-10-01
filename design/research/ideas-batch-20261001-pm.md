# 2026-10-01 PM 외부 아이디어

- **NO_NEW=false**
- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — 희동이 HP 연동 피격 웨어 · 패배 페이즈 마일스톤 래더 · 윈드업 글러브 가죽 크릭(SFX) 3개. **축:** 진행감 / 리트라이 동기 / 사운드. Perfect 히트 스크린 juice·타이밍 방향 힌트 **전면 금지**.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, 글러브 티핑, Trauma 카메라, VFX 4레인, 공 캐스트 그림자, 피격플래시+리코일, 시임/스핀 텔, Doppler 니어미스 whizz, 불꽃 직전 눈빛 텔, 열왜곡, 회피 애프터이미지, Miss 방향 카메라 임펄스, 방향성 임팩트 카메라 킥, 크라우드 RTPC, 주변시 엣지 밝기 펄스, 스윙 스미어+팔로우스루, Miss/Good/Perfect juice 예산표, settle+idle fidget, WANDR 가림, Bullet Dance aim-lock, Flukz 패턴 리믹스, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 히트스톱, 모양언어, 색만 구종 ID, EARLY/LATE 라벨·타이밍 방향 힌트, 약점글로우, 뮤직 스템[제안], 이점/약점 모디[제안], 비가시 타이밍창 DDA[제안], Nine Sols 부정확패리, mushy contact, Takamido 전신 텔, Witch Time 회피, 배트 킥백+접촉 더스트/스파크, 공 비행 트레일 잔상, Perfect 임팩트 프레임(1–2컷), 불꽃 Hold/Charge, Hitting DoF/릴리즈 존 DoF, Perfect 크로매틱 수차 펀치, 마운드/플레이트 환경 먼지, 접촉점 등급 플로팅 텍스트(Perfect/Good), 배트/공 스쿼시·스트레치 스프링 펀치, Perfect FOV 줌 펀치, Perfect 비네트 펄스, 배트/공 머티리얼 화이트 플래시, 확장 충격파 링(A), soft→hard 릴리즈 포커스 앵커(B), 스쿼시 쇼트리스트(C), Color Grade 골든 틴트, bloom 스파이크, 캐처 미트 스냅, 만화 방사 스피드라인. **추가 재제안 금지(기존 시안·HARD):** 페이즈 HP 청크·보스 페이즈 배너, 이닝스톱 CTA, 페일라인/페일 리뷰 칩, 피치 래더 SFX, 승리 결과 카드 골격, 패배「불꽃N·PERFECTN·MissN」한줄 요약 그 자체, 1탭 재도전·희동이 도발(이미 적용), 칭호·연승·스탬프·친구응원·고스트배트·FTUE, 구수 X/Y 카운터, 베스트 런 데미지 커브 고스트(러너업). **9/29 PM TOP→HARD:** 보스 페이즈 월드 시프트(구장 팔레트·희동이 실루엣·소형 페이즈 칩), 패배 거의 이김 잔여 HP 히어로(+도전 프라이드), 페이즈 BGM 인텐시티 스냅샷+실패 earned silence. **9/30 AM TOP→HARD:** 구장 스코어보드·플로드라이트 마이크로 비트, 패배 개인 베스트 델타, 불꽃 비행 예감 라이저 SFX. **9/30 PM TOP→HARD:** 관중 빌보드 치어 에너지 스파이크(비주얼만), 재도전「바꿀 한 수」전략 프롬프트, 불꽃 회피 성공 확인 처프 SFX. **10/01 AM TOP→HARD:** 희동이 마운드 idle 강도 에스컬레이트(포즈·애니만), 패배「한 호흡」인비트윈 브레스, 릴리즈 스윙 시작 배트 후시 SFX. **AM/PM 러너업 1차 TOP 금지:** 페이즈 진입 뮤지컬 스팅어, 플레이어 저HP 심박 베드, 접촉 머티리얼 레이어, FINAL 도달 프라이드 배지, 세션 개선 스파크라인, 승리 절차 아르페지오 팡파르, 플레이트 도착 thud, 페이즈 풍속 ambient 베드, 덕아웃/파울폴 프롭 비트.
- **코드·밸런스·스토리:** 미수정. 본 문서만. 유료·코어 규칙 변경 = **[제안]** 만.

---

## TOP

### ① 희동이 **HP 연동 피격 웨어**(손상 상태·비주얼만)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://glaadvoice.org/how-creature-art-vfx-damage-states-and-arena-design-all-meet-in-the-boss-fight/ (2026-07: 데미지 스테이트가 HP바 숫자 대신 **장면 안 진행**을 읽게 함 — early damage→critical) · https://thunderstore.io/c/repo/p/Vippy/BattleScars/ (HP↓에 따라 균열·붕대·덴트가 쌓여 **한눈에 체력 가독**) · https://www.strayspark.studio/blog/procedural-damage-game-assets-complete-workflow (표면 웨어는 미세부터; 과하면 스토리 깨짐) |
| ② 한줄 요약 | 희동이 잔여 HP가 내려갈수록 **유니폼 흙·땀 광택·모자 각도·어깨 처짐** 같은 미세 웨어 티어가 쌓여 ‘때리고 있다’를 보스 몸에서 읽힌다 — 페이즈 idle 포즈 스왑·월드 팔레트·피격플래시와 슬롯 분리. |
| ③ 왜 희동이 게임에 맞는지 | HARD **마운드 idle 강도 에스컬레이트**(페이즈 임계 **포즈/애니 티어**)·**월드 시프트**(구장 팔레트·실루엣 칩)·**피격플래시+리코일**·환경 먼지·HP청크·배너와 **다른 채널**(HP% 연동 **표면/소품 웨어**). Perfect juice·타이밍 힌트·구종 텔과 무관. 판정·점수 불변. |
| ④ TOP 적용안 | (1) 잔여 HP 구간(예: 100–67 / 66–34 / 33–0)마다 웨어 티어 0→1→2: 유니폼 흙 스프라이트 opacity↑, 이마 하이라이트(땀), 모자 yaw ±3–6°, 어깨 Y −2~−6px. (2) **페이즈 경계에서만** idle 클립을 바꾸는 AM①과 분리 — 본안은 HP% 연속(또는 세분 티어) 웨어. (3) 히트 순간의 화이트 플래시·리코일·머티리얼 플래시·환경 먼지 재도입 금지. (4) 저사양: 흙 opacity + 모자 각도만. Perfect 스크린 juice 금지. |
| 판정/규칙 변경 | **없음** (보스 비주얼 웨어만). **판정불변**. |

---

### ② 패배 **페이즈 마일스톤 래더**(이닝 클리어 프라이드)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://www.gamedeveloper.com/design/staying-power-rethinking-feedback-to-keep-players-in-the-game (Phillips/MGS: 실패 직후 **학습·중간 목표** 피드백이 재도전 동기; 여정 가시화) · https://www.psychologyofgames.com/2016/09/the-near-miss-effect-and-game-rewards/ (Near-miss: 중간 기어/마일스톤을 여러 개 두면 ‘거의’가 자주 생겨 원모어트라이↑) · https://www.joyplayx.com/article/how-to-handle-failure-in-games-designing-death-and-retry-loops (2025-06: 실패에도 **남긴 진행**이 보이면 이탈↓) |
| ② 한줄 요약 | 패배 화면에 **1회 · 2회 · FINAL** 작은 래더를 두고, 이번 런에서 넘긴 페이즈만 점등해 ‘여기까지 밀었다’를 각인 — 잔여 HP 히어로·PB 델타·「바꿀 한 수」·「한 호흡」·FINAL 배지와 슬롯 분리. |
| ③ 왜 희동이 게임에 맞는지 | HARD **거의 이김 잔여 HP**(절대 %)·**개인 베스트 델타**(역대 비교)·**「바꿀 한 수」전략 카피**·**「한 호흡」시간 UX**·AM 러너업 **FINAL 도달 프라이드 배지**(단일 토스트)와 **다른 축**(이번 런 **중간 마일스톤 래더**). 페일 리뷰·EARLY/LATE·soft continue 금지. sticky「다시 승부」1탭 유지. |
| ④ TOP 적용안 | (1) 히어로/델타 **아래**(또는 그 옆) 가로 3칸: `1회` `2회` `FINAL` — 클리어한 페이즈만 fill/체크, 미도달은 outline. (2) 다음 칸이 outline이고 직전 임계까지 Δ≤약 10%p면 다음 칸만 약한 pulse 1회(니어미스) — 수치 문장·EARLY/LATE 없음. (3) FINAL 배지 토스트·연승/칭호·페일 리뷰 칩·전략 한 줄을 이 슬롯에 넣지 않음. (4) soft continue·유료 이어하기 금지. |
| 판정/규칙 변경 | **없음** (결과 UI·프라이드 표시만. 점수식·판정창 불변). **판정불변**. |

---

### ③ 투구 **윈드업 글러브 가죽 크릭**(SFX, 구종 텔·스윙 후시 아님)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://add.app/sound-effects/baseball-sound-effects/ (2024-05: 글러브/가죽 텍스처·윈드업 동작음이 근접감; 캐치 pop·스윙 whoosh와 역할 분리) · https://sfxengine.com/blog/sound-effects-for-baseball-games (2026-03: 윈드업 구간은 긴장 레이어, 임팩트와 분리) · https://soundcy.com/article/how-to-write-baseball-sound (가죽 텍스처·글러브 동작이 다이아몬드 근접 Foley) · https://artlist.io/sfx/track/creaks-and-squeaks---leather-baseball-glove-creak/114031 (가죽 글러브 creak 슬롯 참고) |
| ② 한줄 요약 | 희동이 **윈드업 시작 프레임**에만 짧은 가죽 크릭/마찰 1샷으로 ‘투구가 온다’를 귀에 남긴다 — 구종 ID 텔·스윙 배트 후시·불꽃 라이저·회피 처프·캐처 미트 스냅 아님. |
| ③ 왜 희동이 게임에 맞는지 | HARD **글러브 티핑**(구종 비주얼 텔)·**불꽃 VO/오디오 텔**·**릴리즈 스윙 시작 배트 후시**(플레이어 에이전시)·**불꽃 비행 라이저**·**회피 처프**·**캐처 미트 스냅**·피치 래더·BGM 스냅샷과 **다른 슬롯**(보스 윈드업 **시작**·전 구종 공통 Foley). 어떤 구종인지 알리지 않음(동일 크릭). 판정창 불변. |
| ④ TOP 적용안 | (1) 희동이 윈드업 애니 시작 콜백에 **60–120ms** band-limited noise/friction 크릭 1샷(master 대비 −10~−14dB, BGM과 키 충돌 적게). (2) 일반·불꽃 **동일** 재생 — 구종별 pitch/필터 분기 금지(오디오 텔 HARD 유지). (3) 릴리즈 스윙 후시·비행 라이저·회피 처프·접촉 crack·캐처 미트와 동시 스택 시 크릭만 우선순위↓ 또는 스킵. (4) 뮤트·reduce-audio 존중. |
| 판정/규칙 변경 | **없음** (윈드업 시작 SFX만). **판정불변**. |
| **BGM 전제** | `music.js` 절차음 **2모드만**(opening/play), 외부 스템·파일 없음. Master gain ≈0.06–0.08. Mute 존중. 본안은 BGM 그래프를 건드리지 않는 **원샷 SFX**. |
| **구현 난이도** | **쉬움** — 윈드업 시작 콜백에 noise+짧은 bandpass 크릭 1샷; BGM 모드·gain·filter·silence·스템 로직 불필요. 샘플 없이도 절차 합성 가능. |

---

## 제외/확장만

| 아이디어 | 처리 | 이유 |
|---|---|---|
| 마운드 idle·「한 호흡」·스윙 후시 | HARD(10/01 AM) | 재제안 금지. ①②③은 HP웨어·마일스톤래더·윈드업크릭으로 슬롯 분리. |
| 관중 치어·「바꿀 한 수」·회피 처프 | HARD(9/30 PM) | 재제안 금지. |
| 스코어보드·플로드라이트·PB 델타·불꽃 비행 라이저 | HARD(9/30 AM) | 재제안 금지. |
| 월드 시프트·잔여 HP 히어로·BGM 스냅샷+silence | HARD(9/29 PM) | 재제안 금지. ②는 절대%·역대비교가 아닌 **중간 마일스톤**. |
| FINAL 도달 프라이드 배지 | AM 러너업 | 1차 TOP 금지 — ②는 3칸 래더(전 페이즈)로 범위·슬롯 다름, 배지 토스트 재도입 안 함. |
| 플레이트 도착 thud·접촉 머티리얼·페이즈 풍속 ambient | 러너업 | ③과 슬롯 경쟁/경계 — 윈드업 크릭 우선. |
| 덕아웃/파울폴 프롭 비트 | 러너업 | 보드/관중 HARD 인접 — 보스 웨어 채널 우선. |
| 글러브 티핑·불꽃 눈빛/VO 텔 | HARD | ③은 전 구종 동일 크릭만 — 구종 ID 금지. |
| 캐처 미트 스냅 | HARD | Miss/통과 확인음 재제안 금지. |

---

## Director용 한줄 요약

**PM TOP(판정불변·진행/리트라이/사운드):** ①희동이 HP 연동 피격 웨어(idle 포즈 티어·월드 시프트·피격플래시·HP청크·배너 금지) → ②패배 페이즈 마일스톤 래더(잔여 HP·PB 델타·전략 프롬프트·한 호흡·FINAL 배지·EARLY/LATE 금지, sticky 1탭 유지) → ③윈드업 글러브 가죽 크릭 SFX(구종 텔·스윙 후시·비행 라이저·회피 처프·미트 스냅·스냅샷·스템·피치 래더 아님).

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-10-01 ~16:30 KST PM 루틴
