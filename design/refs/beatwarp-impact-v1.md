# BeatWarping 임팩트 · BEATWARP v1

파일: `design/assets/beatwarp-impact-v1.png`  
근거: `design/research/ideas-batch-20260922-pm.md` TOP2

## 원칙
1. **릴리즈 = 배트 즉시 시작** — 입력 반응성 유지
2. **임팩트 SFX/VFX만 ±1박 워프** — 스팅어 원샷. 풀 반응형 스템 제외
3. **판정 윈도우·히트박스 불변**

## 채널
| 등급 | 워프 | VFX | 팔레트 |
|------|------|-----|--------|
| Perfect | 강 (±1박) | 금 스팅어 플래시 + 큰 hitstop spark | `#FFE09A` `#FFD25B` |
| Good | 약 (가벼운 tick) | 민트 soft flash | `#A8E8FF` |
| 불꽃 회피 | **NO WARP** | 회피 스파크만 | `#FF7A6E` |

## 타이밍
- t0: 릴리즈 → 배트 모션 즉시
- impact: 접촉 프레임에 SFX/VFX 스팅어 (Perfect면 ±1박 감각 워프)
- 불꽃 회피 성공 시 워프 채널 off

## 금지
- 판정·히트박스 변경
- 전체 오디오 스템 워프
- 회피에 Perfect/Good 워프 적용
