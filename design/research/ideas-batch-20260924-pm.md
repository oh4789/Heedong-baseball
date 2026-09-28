# 「희동이를 이겨라」 외부 아이디어 배치 — 2026-09-24 16시(PM 루틴)

- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — 불꽃 열왜곡 · 회피 애프터이미지 · 타이밍 방향 임펄스 3개.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, aim-lock 미끼불꽃, Flukz, WANDR 손가락가림, 히트스톱+터치지연, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 모양언어, 약점글로우, 글러브 티핑, Trauma² FOV, 비가시 타이밍창 DDA[제안], Takamido 전신, Nine Sols 부정확패리, ULTRAKILL mushy, 희동이 피격플래시+리코일, VFX 4레인, 공 그림자 깊이, 스윙 스미어+팔로우스루, juice 예산표, settle+idle fidget, 시임/스핀 텔, Doppler whizz, 눈빛/표정 텔, 칭호·연승·스탬프·시드·친구응원·이닝스톱·고스트배트·FTUE·의도버퍼·EARLY/LATE 라벨·스침 점수·HP청크·반응형스템·이점약점모디·best-of-N, 9/15 Near-miss 코랄 비네트·「회피!」민트 플로팅(텍스트/스파크) 그 자체.
- **Director 대기열(재제안 금지):** 피격플래시 → 공그림자 → VFX 4레인.
- **코드·밸런스:** 본 문서만. 판정창·점수식 불변.

---

## TOP1 — 불꽃 비행 중 **열왜곡(heat haze)** 후광

| 항목 | 내용 |
|---|---|
| ① 한줄 | 불꽃구만 공 주변 **약한 굴절/일렁임**으로 ‘뜨겁다’를 비행 중에 읽게 한다. |
| ② 출처 | https://docs.studiofishbones.com/fowl-play/effects-shaders/effects/abilities/fire-ball/ (Studio Fishbones Fire Ball: 코어·트레일·스파크로 화염 프로젝타일 계층) · https://assetstore.unity.com/packages/vfx/procedural-heat-distortion-urp-362150 (Procedural Heat Distortion URP, 2026-04) |
| ③ 희동이 맞춤 | 시임(공 텍스처)·그림자 가장자리 잔불(지면)·VO(투구 전)·눈빛(얼굴)과 **다른 레이어**(공기 굴절). 드래그 중에도 구종을 주변에 남긴다. |
| ④ 적용안 | (1) 불꽃만: 공 스프라이트 뒤 40–80px 저강도 노이즈 왜곡 쿼드(알파·강도 캡). (2) 접근할수록 왜곡↑, 임팩트/회피 성공 시 80ms 페이드아웃. (3) 일반구=OFF. 저사양: 왜곡 끄고 외곽 1px 오렌지 림만. (4) reduce-motion에서 왜곡 OFF(림만 유지). |
| 판정/규칙 변경 | **없음** (비행 VFX만). |
| 비고 | 공그림자 「잔불/일렁임」은 지면 큐 — 본안은 **공 주변 공기**. 직교. |

---

## TOP2 — 불꽃 **회피 성공** 시 타자 애프터이미지(확장)

| 항목 | 내용 |
|---|---|
| ① 한줄 | 드래그로 불꽃을 피한 순간에만 타자 **고스트 잔상 3–5장**으로 ‘빠져나감’을 읽힌다. |
| ② 출처 | https://saltmire.github.io/godot-4-motion-trail-afterimage.html (Saltmire, 2026-08: 스냅샷 고스트 interval≈0.04s / life≈0.25s) · https://wizuslabs.com/blog/anatomy-of-game-juice/ (juice=규칙 불변 피드백 스택) |
| ③ 희동이 맞춤 | 9/15 「회피!」민트 플로팅+스파크와 **채널 분리**(UI 텍스트 vs 몸 잔상). Doppler whizz(통과 오디오)와도 시점·감각 직교. |
| ④ 적용안 | (1) 불꽃 회피 성공 판정 프레임에만 activate → 150–220ms 후 deactivate. (2) 고스트 3–5장, 연한 민트/시안 tint, z는 타자 뒤. (3) 일반 드래그·일반구 회피에는 끄기(노이즈 방지). (4) 기존 「회피!」플로팅과 동시 가능 — 텍스트는 유지, 본안은 **확장**. |
| 판정/규칙 변경 | **없음** (연출 확장만). |

---

## TOP3 — Miss 시 **방향성 카메라 임펄스**(Early/Late 라벨 없이)

| 항목 | 내용 |
|---|---|
| ① 한줄 | Miss의 ‘어느 쪽으로 빗나갔는지’를 **짧은 방향 셰이크**로만 알려, EARLY/LATE 칩 없이 타이밍을 몸감으로 학습시킨다. |
| ② 출처 | https://uhiyama-lab.com/en/notes/unity/unity-game-feel-hit-feedback/ (UhiyamaLab 2026-07: 플래시=맞았나 / 파티클=어디 / 셰이크=얼마나 세게 — 정보 채널 분리) · https://www.gamedeveloper.com/design/what-goes-into-a-good-parry-system- (2025-12: 패리 juice·피드백으로 성공/실패 구분) |
| ③ 희동이 맞춤 | Trauma²는 Perfect FOV 펀치. 9/15 Near-miss는 코랄 비네트. 본안은 **Miss 방향 벡터 임펄스** — 라벨·점수·창 수치 불변. juice 예산표의 ‘강도’와 직교하는 **방향** 축. |
| ④ 적용안 | (1) 임팩트 확정 후: Early Miss=공 진행 반대쪽(또는 배트 쪽)으로 1–2px 임펄스, Late Miss=반대 방향. Perfect는 기존 Trauma²/히트스톱만(본안 미적용). (2) 지속 40–80ms, 감쇠 필수, 중첩 시 1개만. (3) Good는 무방향 미세 또는 OFF로 대비. (4) reduce-shake에서 OFF. |
| 판정/규칙 변경 | **없음** (카메라 juice만. EARLY/LATE UI 라벨 추가 금지). |

---

## Director 체크

| # | 아이디어 | 적용 성격 | 판정/코어 규칙 | 비고 |
|---|---|---|---|---|
| 1 | 불꽃 열왜곡 | 비행 중 구종 VFX | 변경 없음 | 시임·그림자·VO·눈빛과 직교 |
| 2 | 회피 애프터이미지 | 회피 juice **확장** | 변경 없음 | 9/15 민트 플로팅과 병행 |
| 3 | Miss 방향 임펄스 | 타이밍 학습 카메라 | 변경 없음 | Trauma²·Near-miss 비네트와 시점/채널 분리 |

## skipped as duplicate (검증용)
- Soft Heat / BeatWarping / 페이크아웃 / aim-lock / Flukz / WANDR
- 시임·Doppler whizz·눈빛(AM) / 피격플래시·그림자·VFX4(대기열)
- 스미어·juice 예산표·settle / 글러브 티핑·Trauma²·히트스톱·불꽃 VO
- 9/15 Near-miss 코랄 비네트·「회피!」텍스트/스파크 재제안
- EARLY/LATE 칩·스윙창 DDA[제안]

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-24 16:22 KST PM 루틴
