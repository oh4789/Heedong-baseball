# 불꽃 아지랑이·회피 잔상 P2 재확인

- 대상: `632b1a8726f98aa277051dc02c1d5f3e6d34ed79`
- 메시지: `fix: clear haze/afterimage on end; keep haze radius floor`
- 시각: 2026-10-05 10:17 KST (커밋 시각 `2026-10-04 20:17:19 -0500`)
- 방법: 정적 대조. 게임 소스 미수정. `game.js`만 읽고 반경·prune/clear를 같은 식으로 계산.
- 판정: **PASS** (디렉터 체크 1–3). 일시정지 중 틱은 이번 수정 범위에 없음(아래 잔여).

## 변경 파일

커밋 diff는 `game.js` 한 파일, +16 / −3. `engine.js` 및 판정·점수 경로는 이 커밋에 없음.

| 위치 | 내용 |
|---|---|
| `clearFireHazeAndAfterimage` L17–20 | `fireHazeFade`, `lastFireHazeSnap`, `fireDodgeAfterimage`, `batterPosHist` 전부 비움 |
| `pruneFireHazeSnap` L21–27 | 페이드 중이 아니고 비행 중 불꽃구(`type==='fire' && !(t<0)`)가 없으면 스냅 삭제 |
| `start` L1000 | 기존 hist/잔상 클리어를 위 함수로 교체 (halo+snap 포함) |
| `end` L1601–1603 | `clearInput()` 직후 같은 클리어. 승/패 오버레이보다 앞 |
| `frame` playing 분기 | `processEvents()` 다음 `pruneFireHazeSnap()` → `updateFireHazeFade` |
| `drawFireHeatHazeHalo` L1789–1796 | 시임 피크의 `zone*=0.72` 삭제. zone은 그대로 |

호출: `clearFireHazeAndAfterimage()`는 `start`와 `end`만. `beginFireHazeFade`는 `damage` / `vulnerable`. `beginFireDodgeAfterimage`는 `vulnerable`만.

## 체크 1 — end/start가 halo·잔상·히스토리를 비움 — PASS

`clearFireHazeAndAfterimage`가 네 필드를 한 번에 끊음.

- `fireHazeFade=null` (남아 있던 80ms 후광)
- `lastFireHazeSnap=null`
- `fireDodgeAfterimage=null`
- `batterPosHist=[]` (다음 회피 잔상이 이전 위치를 물지 않음)

`end()`는 승리 이닝 스톱·패배 결과보다 먼저 호출. 승/패/사망 화면과 그 다음 `start()`(새 게임·이어하기 모두, `mode` 분기 이전 공통)에는 고스트가 없음.

시뮬레이션: 스냅·페이드·잔상·히스토리를 채운 뒤 clear → 넷 다 빈 상태.

## 체크 2 — 불꽃구가 없으면 lastFireHazeSnap 제거 — PASS

`pruneFireHazeSnap` (playing 프레임, `processEvents` 직후):

- `fireHazeFade`가 있으면 return (정상 페이드는 유지)
- `game.balls`에 `type==='fire'` 이고 `t<0`이 아닌 공이 없으면 `lastFireHazeSnap=null`
- 와인드업(`t<0`)만 있으면 비행 중이 아니므로 스냅을 지움
- 비행 중 불꽃구가 있으면 스냅 유지 (그 프레임 `draw`가 현재 좌표로 다시 씀)

이전 P2(무적/라스트스탠드로 `damage` 없이 불꽃이 사라지고, **이후** 일반구 `damage`가 옛 좌표에 후광)는 그 사이 프레임의 prune으로 스냅이 null이라 `beginFireHazeFade`가 바로 return. 재현 좌표 (244.3, 627.9)는 이후 타격에서 되살아나지 않음.

같은 식 시뮬레이션: 불꽃 없음 → null. 비행 불꽃 → 유지. `t<0` 불꽃 → null. prune 이후 일반 타격 → 페이드 시작 안 함.

참고(블로커 아님): prune은 `processEvents`보다 뒤다. 불꽃이 페이드 없이 사라지는 **그 프레임에** 다른 `damage`가 같이 있으면, 그 한 프레임은 아직 스냅을 쓸 수 있다. 원래 재현(나중 타격)은 막힌다. 페이드가 살아있는 동안은 prune이 스냅을 안 지우고, 페이드가 끝나는 프레임의 `updateFireHazeFade`는 prune 뒤에 있어서 스냅 청소는 다음 playing 프레임이다.

## 체크 3 — 시임 피크 외곽 반경 ≥40px — PASS

강도만 ×0.55. zone은 줄지 않음.

```
HAZE_ZONE_PX = 60
HAZE_SEAM_PEAK_DIM = 0.55   // t∈[80ms, 200ms] (SEAM_TELL_PEAK_*)
zone = max(40, min(80, 60)) = 60     // 예전 seam: max(40, 60*0.72)=43.2 삭제
outer = r + zone*0.55 = r + 33
r = 8 + min(1, t/duration)*5 ∈ [8, 13]   // 쉬운 실루엣 ON이면 ×1.2 → 더 큼
```

| t/duration | r (px) | 지금 outer (시임 피크 포함) | 이전 시임 피크 outer |
|---|---:|---:|---:|
| 0 | 8 | **41** | 31.76 |
| 0.5 | 10.5 | **43.5** | 34.26 |
| 1 | 13 | **46** | 36.76 |

최솟값 41px ≥ 40. 시임 피크와 평상시 기하가 같다. `{seamPeak:sDim<1}`는 아직 넘기지만 `drawFireHeatHazeHalo`는 zone에 쓰지 않는다.

강도: `intensity = hazeApproachMul(approach) * sDim`, `sDim`은 피크 구간만 0.55, 아니면 1. `alpha = intensity * 0.16`, `disp = intensity * 1.5`. 접근 배율 범위는 0.25–0.85 그대로.

## 엔진 / 판정 / 점수

`git diff-tree 632b1a8` 이름 목록 = `game.js`만. 판정 이벤트 종류·점수·`engine.js` diff 없음. 후광/잔상은 기존 `damage`·`vulnerable` 비주얼 훅만 사용.

## 잔여 (이번 체크의 FAIL 아님)

`pause()`와 `showStartMenu()`는 clear를 호출하지 않는다. `updateFireHazeFade` / `updateFireDodgeAfterimage`는 `game.state==='playing'` 안에서만 돈다.

- 승/패/`end`: 즉시 제거. 멈춘 채 결과 화면에 남지 않음.
- 일시정지(Esc/blur/숨김) 후 80ms(후광) 또는 220ms(잔상) 안: 오버레이 뒤에 그 알파로 멈춤. 이어하기면 남은 수명만큼 다시 흐르고, 시작 화면으로 나가도 `start()` 전까지는 캔버스에 남을 수 있음. 다음 런의 `start()`가 비움.

커밋 주석 범위는 “Defeat/retry/start”. 디렉터 체크 1도 end/start와 다음 런이다.
