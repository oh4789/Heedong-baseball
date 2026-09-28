# 「희동이를 이겨라」 외부 아이디어 배치 — 2026-09-24 10시(AM 루틴)

- **목적:** Director 적용 검토용. **코어 판정·점수 불변** — 시임/스핀 텔 · 니어미스 휘즈 · 눈빛 텔 3개.
- **제외(HARD):** Soft Heat, BeatWarping, 페이크아웃, aim-lock 미끼불꽃, Flukz, WANDR 손가락가림, 히트스톱+터치지연, 불꽃 VO/오디오 텔, Perfect 햅틱, soft continue, 모양언어(레인/원/펄스), 색=회피전용[제안], 약점글로우, 몸짓 티핑(글러브), Trauma², 비가시 타이밍창 DDA[제안], Takamido 전신 키네마틱, Nine Sols 부정확패리, ULTRAKILL mushy, 희동이 피격플래시+리코일, VFX 4레인, 공 그림자 깊이, 스윙 스미어+팔로우스루, juice 예산표, settle+idle fidget, 칭호·연승·스탬프·시드·친구응원·이닝스톱·고스트배트·FTUE·의도버퍼·EARLY/LATE·스침·HP청크·반응형스템·이점약점모디·best-of-N 등.
- **코드·밸런스:** 본 문서만. 판정창·점수식 불변.

---

## TOP1 — 공 시임/스핀 패턴으로 구종 가독성

| 항목 | 내용 |
|---|---|
| ① 한줄 | 비행 중 **솔기(시임) 밴드·닷 패턴**으로 일반구 vs 불꽃구를 색/레인 없이 읽게 한다. |
| ② 출처 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12121998/ (Clutter et al., Baseball Seam Recognition; PubMed 2025 게시) · https://sabr.org/journal/article/nickel-and-dime-pitches/ (Bahill 등, 닷/니켈 서클 스핀 패턴) |
| ③ 희동이 맞춤 | 드래그·릴리즈 전 **초반 비행**에서 구종 판별. 글러브 티핑·불꽃 VO·모양언어·그림자와 **다른 레이어**(공 자체 텍스처). |
| ④ 적용안 | (1) 일반구=가는 4시임 세로 블러 밴드. 불꽃구=굵은 2시임 밴드 또는 **빨간 닷/니켈 서클** + 회전 살짝↑. (2) 릴리즈 후 80–200ms 구간만 시임 대비를 키워 모바일에서도 읽히게. (3) 색각 보조: 시임은 휘도 대비 유지(색만으로 구분 금지—accessibility 중복 인코딩). (4) 저사양: 시임 스프라이트 2종 스왑만, 셰이더 생략 가능. |
| 판정/규칙 변경 | **없음** (공 비주얼 텔만). |

---

## TOP2 — 니어미스·회피 성공 시 공기 휘즈(Doppler) 레이어

| 항목 | 내용 |
|---|---|
| ① 한줄 | 점수 변화 없이, **아슬아슬히 스친/피한 공**에만 짧은 whizz·whoosh로 ‘공기 밀림’을 준다. |
| ② 출처 | https://blog.criware.com/index.php/2020/11/24/creating-a-projectile-whizz-by-effect-in-atom-craft/ (CRI, projectile whizz-by + Doppler) · https://cogconnected.com/2026/06/making-gameplay-feel-more-responsive-using-sound/ (2026-06, dodge/whoosh로 동작·결과 확인) |
| ③ 희동이 맞춤 | 불꽃 **회피 성공**·배트 **스침 직전 미스**의 juice. 불꽃 VO(투구 전 텔)와 직교—여기는 **비행/통과 순간** 오디오. Soft Heat·연승·점수와 무관. |
| ④ 적용안 | (1) 불꽃 회피 성공: 공–배트/타자 최근접 프레임에 80–150ms whizz, 접근↑피치 → 통과↓피치(간단 Doppler). (2) 일반구 Perfect 근접(판정은 Miss지만 거리만 가까움)에는 더 약한 whoosh—점수/스침 규칙 불변. (3) 동시 다구 혼잡 방지: 최근접 1발만, 볼륨 캡. (4) 무음/저자극 옵션에서 끄기. |
| 판정/규칙 변경 | **없음** (오디오 juice만. 스침 판정·점수 손대지 않음). |

---

## TOP3 — 불꽃 직전 희동이 **눈빛/시선·표정** 텔 (글러브 티핑과 직교)

| 항목 | 내용 |
|---|---|
| ① 한줄 | 투수 **얼굴·눈선·화난 표정**이 ‘더 세고 어려운 공’ 기대를 만든다—불꽃 전용으로 짧게 쓴다. |
| ② 출처 | https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00178/full (Cheshin et al., Pitching Emotions; anger→더 빠르고 어려운 공 기대) · PDF: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00178/pdf |
| ③ 희동이 맞춤 | 몸짓 티핑(글러브 높이/플레어)과 **다른 채널**(얼굴). 불꽃 VO·시임과 겹쳐도 ‘사전 경고’ 레이어로 역할 분리 가능. |
| ④ 적용안 | (1) 불꽃만: 와인드업 마지막 120–250ms 눈이 타자(카메라)를 고정·미세 미간 찌푸림 또는 눈 하이라이트 1펄스. (2) 일반구는 시선 흐리거나 측면—대비로 학습. (3) 페이크아웃 금지(HARD 제외): 눈빛 켠 뒤 **반드시** 불꽃(거짓말 텔 없음). (4) 저해상도: 눈 스프라이트 2프레임만으로도 충분. |
| 판정/규칙 변경 | **없음** (사전 연출만. 구종 확률·판정창 불변). |

---

## Director 체크

| # | 아이디어 | 적용 성격 | 판정/코어 규칙 | 비고 |
|---|---|---|---|---|
| 1 | 시임/스핀 패턴 | 비행 중 구종 텔 | 변경 없음 | 티핑·VO·모양언어·그림자와 직교 |
| 2 | 니어미스 whizz | 회피/근접 juice 오디오 | 변경 없음 | 불꽃 VO(투구 전)와 시점 분리 |
| 3 | 눈빛/표정 텔 | 릴리즈 직전 얼굴 텔 | 변경 없음 | 글러브 몸짓 티핑과 직교; 페이크 금지 |

## skipped as duplicate (검증용)
- Soft Heat / BeatWarping / 페이크아웃 투구쌍 / aim-lock 미끼불꽃
- 텔레그래프 모양언어(레인·원·펄스) · 색=회피전용[제안]
- 불꽃 VO · Perfect 햅틱 · 히트스톱 · soft continue · 약점글로우
- 글러브 높이/플레어 몸짓 티핑 · 공 캐스트 그림자 · 스윙 스미어+팔로우스루 · 희동이 피격플래시

**라이브:** https://oh4789.github.io/Heedong-baseball/  
**작성:** 게임 아이디어 조사 · 2026-09-24 10:32 KST AM 루틴
