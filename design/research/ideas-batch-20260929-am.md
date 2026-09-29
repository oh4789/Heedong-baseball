# 2026-09-29 AM 외부 아이디어

- **NO_NEW=false**
- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — Perfect FOV 줌 펀치 · Perfect 비네트 펄스 · 배트/공 머티리얼 화이트 플래시 3개.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, 글러브 티핑, Trauma 카메라, VFX 4레인, 공 캐스트 그림자, 피격플래시+리코일, 시임/스핀 텔, Doppler 니어미스 whizz, 불꽃 직전 눈빛 텔, 열왜곡, 회피 애프터이미지, Miss 방향 카메라 임펄스, 방향성 임팩트 카메라 킥, 크라우드 RTPC, 주변시 엣지 밝기 펄스, 스윙 스미어+팔로우스루, Miss/Good/Perfect juice 예산표, settle+idle fidget, WANDR 가림, Bullet Dance aim-lock, Flukz 패턴 리믹스, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 히트스톱, 모양언어, 색만 구종 ID, EARLY/LATE 라벨·타이밍 방향 힌트, 약점글로우, 뮤직 스템[제안], 이점/약점 모디[제안], 비가시 타이밍창 DDA[제안], Nine Sols 부정확패리, mushy contact, Takamido 전신 텔, Witch Time 회피, 배트 킥백+접촉 더스트/스파크, 공 비행 트레일 잔상, Perfect 임팩트 프레임(1–2컷), 불꽃 Hold/Charge, Hitting DoF/릴리즈 존 DoF, Perfect 크로매틱 수차 펀치, 마운드/플레이트 환경 먼지, 접촉점 등급 플로팅 텍스트(Perfect/Good), 배트/공 스쿼시·스트레치 스프링 펀치(저녁 러너업·에셋 있음).
- **코드·밸런스·스토리:** 미수정. 본 문서만.

---

## TOP

### ① Perfect 전용 **FOV 줌 펀치**(카메라 위치·회전 고정)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://feel-docs.moremountains.com/API/class_more_mountains_1_1_feedbacks_1_1_m_m_f___camera_zoom.html (Feel MMF_CameraZoom: ZoomFieldOfView·Transition≈0.05s·Hold≈0.1s, Return to original) · https://spanzeto.dev/en/docs/game-juice-pro/feedbacks/ (Game Juice Pro Camera Zoom: Target FOV·Duration≈0.3s·Zoom Curve, dramatic impact용) |
| ② 한줄 요약 | Perfect 확정 순간만 **렌즈 FOV를 짧게 좁혔다 복귀** — 카메라 transform(위치·회전) 흔들림 없이 ‘확 다가온’ 타격감. |
| ③ 왜 희동이 게임에 맞는지 | Trauma / Miss 임펄스 / 방향성 킥(위치·회전)·DoF(초점면)·CA(RGB 분리)와 **다른 채널**(시야각/orthographic size). 웹·2D는 뷰포트·캔버스 scale 또는 ortho size 펀치로 동일 의도. 판정창 불변. |
| ④ TOP 적용안 | (1) Perfect만: FOV(또는 2D ortho/view scale)를 **약 6–12%** 좁힘→복귀, 총 **100–180ms**(in≈40–60 / hold≈30–50 / out≈40–70). (2) Good=절반 또는 OFF; Miss=OFF. (3) 카메라 x/y/rotation 변경 금지 — FOV/scale만. (4) reduce-motion=OFF. 연속 Perfect 시 이전 트윈 kill 후 재시작. |
| 판정/규칙 변경 | **없음** (렌즈/뷰 스케일만). |

---

### ② Perfect 전용 **비네트 강도 펄스**(화면 가장자리 어두움)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://feel-docs.moremountains.com/API/class_more_mountains_1_1_feedbacks_for_third_party_1_1_m_m_f___vignette___u_r_p.html (Feel MMF_Vignette_URP: Intensity 0→1→0 curve, Duration 기본 0.2s) · https://feel-docs.moremountains.com/core-concepts.html (PostProcess Vignette + MMVignetteShaker 자동 셋업 예시) |
| ② 한줄 요약 | Perfect만 **가장자리를 짧게 어둡게** 조여 중앙(접촉점)으로 시선을 모음 — HUD를 밝히지 않음. |
| ③ 왜 희동이 게임에 맞는지 | HARD **주변시 엣지 밝기 펄스**(가장자리 **밝힘**/HUD)와 **반대 극성·다른 슬롯**(가장자리 **어두움**/풀스크린 포스트). CA·FOV·임팩트프레임과도 직교. 판정 불변. |
| ④ TOP 적용안 | (1) Perfect: vignette intensity 0→peak→0, **80–150ms**, peak는 약하게(중앙 가독 유지, 모바일에서 과도한 터널링 금지). (2) Good=미적용 또는 peak≈1/3; Miss=OFF. (3) 색은 중립 검정(골든/빨강 tint 금지 — Color Grade와 슬롯 분리). (4) 웹: CSS radial-gradient 오버레이 opacity 트윈 또는 캔버스 가장자리 페이드로 대체. reduce-motion=OFF. |
| 판정/규칙 변경 | **없음** (포스트 FX만). |

---

### ③ 배트·공 **머티리얼 화이트 플래시**(오브젝트 오버레이)

| 항목 | 내용 |
|---|---|
| ① 출처/링크 | https://saltmire.github.io/godot-4-sprite-shader-effects.html (2026-08: hit-flash — sprite→white mix, ≈0.12s fade; 파티클·카메라 없이 ‘맞았다’) · https://spanzeto.dev/en/docs/game-juice-pro/feedbacks/ (Material Flash: Flash Color·Intensity≈2.0·Duration≈0.15s overlay) · https://uhiyama-lab.com/en/notes/unity/unity-game-feel-hit-feedback/ (hit flash를 다감각 스택의 위치·타격 확인 레이어로 분리) |
| ② 한줄 요약 | 접촉 확정 시 **배트·공 스프라이트만** 짧게 하얗게 번쩍 — 카메라·월드 텍스트·더스트 없이. |
| ③ 왜 희동이 게임에 맞는지 | HARD **희동이 피격플래시+리코일**(투수 피격 대상)과 **타겟·슬롯 분리**(본안=배트/공 접촉 오브젝트). 스쿼시 스프링(스케일)·접촉 더스트/스파크·플로팅 텍스트·CA와 직교하는 **머티리얼/틴트 채널**. 판정 불변. |
| ④ TOP 적용안 | (1) Perfect: 배트+공 `mix(rgb, white, amount)` amount 1→0, **80–120ms**. (2) Good: 공만 또는 amount≈0.5·더 짧음; Miss=OFF. (3) 희동이 본체 플래시·리코일은 재도입하지 않음. (4) 웹/캔버스: `globalCompositeOperation` 또는 틴트 오버레이 1레이어. reduce-motion=즉시 1프레임 플래시만 또는 OFF. |
| 판정/규칙 변경 | **없음** (스프라이트 틴트만). |

---

## 제외/확장만

| 아이디어 | 처리 | 이유 |
|---|---|---|
| 접촉점 **만화식 방사 스피드라인** | 러너업 | Godot anime speedlines·MirzaBeig — 채널은 새로우나 9/28 AM 임팩트프레임 ink-lines와 시각 근접. FOV/비네트/머티리얼 우선. |
| Perfect **Color Grade** 골든 틴트 | 스킵 | GJP Color Grade — 비네트·CA와 풀스크린 포스트 스택 과다. |
| Perfect **확장 충격파 링** | 기존 러너업 | (A) 쇼트리스트 — 재제안 금지. |
| Soft→hard **릴리즈 포커스 앵커** | 기존 러너업 | (B)·DoF HARD 근접. |
| 배트/공 **스쿼시·스케일 스프링** | 기존 러너업 | (C)·저녁 에셋 있음 — 재제안 금지. |
| Bloom intensity 스파이크 | 스킵 | CA·비네트와 포스트 겹침. |
| 캐처 미트 스냅 | 스킵 | 에셋·연출 부담(PM과 동일). |
| 시임/트레일/Hold/임팩트프레임/먼지/플로팅텍스트/CA 등 | HARD 제외 | 재제안 금지. |

---

## Director용 한줄 요약

**AM TOP(판정불변):** ①Perfect FOV 줌 펀치(위치·회전 고정) → ②Perfect 비네트 펄스(엣지 어두움·밝기펄스와 반대) → ③배트/공 머티리얼 화이트 플래시(희동이 피격플래시와 타겟 분리).

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-29 10:20 KST AM 루틴
