# 연타 배율 칩 모션 · Static QA — `171887c`

**결과: PASS**

- Commit: `171887cff9c10433093df05723e877f0e90603dd` — `ui: combo mult chip motion v1`
- Spec: `design/refs/combo-mult-chip-motion-v1.md` (+ 정적 `combo-mult-chip-v1.md`)
- 변경 파일: `game.js` (+107/−2), `style.css` (+47), `index.html` (+1/−1 DOM 칩)
- **engine.js 미변경** (parent blob `8911e7e6…` === commit blob)
- WIP: working tree는 untracked evidence/research만; HEAD=`171887c`이므로 detach worktree 불필요. gameplay 파일 미수정.

## Director 클레임 체크리스트

| # | 클레임 | 결과 | 근거 |
|---|---|---|---|
| 1 | Perfect/Good 연타: pop → settle | **PASS** | `syncComboMultChip`: `cur>prev` → `triggerComboMultPop` → state `pop`(0.92→1.22 / 120ms) → `settle`(easeOutBack →1.0 / 80ms). engine `perfect`/`hit` 모두 `combo++` |
| 2 | ×≥4 코랄 림 | **PASS** | `COMBO_MULT_HOT_AT=4`; `comboMultRim` → `coral`; CSS `#FF986E` |
| 3 | Miss / 피격 / pass 콤보 깨짐 → ×1 뮤트 + 좌우 shake | **PASS** | engine: whiff·body-hit·pass(비불꽃 y>785) → `combo=0`. `cur<prev` → `triggerComboMultReset`: rim `muted`, `sin(2πu)*5px` / 180ms, scale 고정 1 |
| 4 | reduced-motion: snap only | **PASS** | JS: pop/reset/update 모두 idle 스냅; CSS `@media(prefers-reduced-motion:reduce)` transform/ghost/sparks 강제 OFF |
| 5 | 판정·점수 불변 | **PASS** | `engine.js` blob 동일; game.js diff에 damage/perfectZone/combo++ 공식 없음. HUD 표시·모션만 |

## 스펙 타이밍·비주얼

| 항목 | 스펙 | 구현 | |
|---|---|---|---|
| POP | ~0–120ms, 0.92→1.22 | `COMBO_MULT_POP=.12`, easeOutCubic | PASS |
| SETTLE | ~120–200ms(구간), easeOutBack →1.0 | `COMBO_MULT_SETTLE=.08`, 합계 200ms | PASS |
| RESET | ~180ms, ±4~6px 1회, pop 금지 | `.18`, ±5px sine 1주기, scale=1 | PASS |
| 고스트·금 스파크 | POP 중 | `.combo-mult-ghost` / `.combo-mult-sparks` `#FFD25B` | PASS |
| 크림 림 idle | `#FFE09A` | default border | PASS |
| unscaled | 히트스톱 독립 | `updateComboMultChip(dt)`는 freeze 게이트 **앞**, real dt | PASS |
| 위치 | 콤보 옆 | `#combo` 다음 `#combo-mult-chip`, `pointer-events:none` | PASS |

## Node asserts

`design/evidence/combo-mult-chip-motion/code-check.json` — **55/55 PASS**  
(상수·rim·상태머신 시뮬·RM 스냅·engine break sites·score-diff 없음)

## 재현 steps (정적)

```bash
cd /workspace/heedong-game
git show 171887c --stat
git rev-parse 171887c^:engine.js 171887c:engine.js   # 동일 해시
rg -n 'COMBO_MULT_|triggerComboMult|comboMultRim|prefers-reduced-motion' game.js style.css
# 선택: node로 code-check.json 재생성(위 assert 스크립트)
```

인게임(선택): Perfect/Good 연속 → 칩 pop+settle; combo≥4 → 코랄; 헛스윙/피격/통과 → ×1 뮤트+흔들림; OS reduced-motion ON → 숫자·림만 즉시 갱신.

## 노트

- 표시값 `Math.max(1, combo)` → combo 0도 ×1 (스펙 reset 비주얼과 일치).
- 첫 랠리(`combo>=3` → 0)도 decrease 경로라 reset shake 발생 — 콤보 깨짐과 동일 HUD 채널, 점수식 무관.
- 본 QA는 정적 코드/스펙 대조; 런타임 스크린샷 미포함.

## Director 한줄 요약 (KO)

**PASS** — `171887c` 연타 배율 칩 모션은 스펙대로 pop/settle·×≥4 코랄·리셋 뮤트 shake·RM 스냅을 충족하고, engine 판정·점수 경로는 전혀 손대지 않았다.
