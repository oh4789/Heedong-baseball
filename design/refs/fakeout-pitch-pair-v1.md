# 페이크아웃 투구쌍 · FAKEOUT PAIR v1

파일: `design/assets/fakeout-pitch-pair-v1.png`  
근거: `design/research/ideas-batch-20260922-pm.md` TOP3

## 목표
예열(일반) 텔레그래프 **70%**까지 → **1틱**에 불꽃 색/피치로 스냅. 비주얼만. 판정 불변.

## 시퀀스
1. **Warm-up** — 민트 레인/텔레그래프 `#9BFFE6`, 강도 ~70%
2. **One-tick snap** — 기존 불꽃 3단 유지  
   early `#FFAB88` → late `#FF986E` → flight `#FF5A2A`
3. **Opposite-lane foreshadow** (소) — `#FFE09A` 벤드 마크, 반대 레인 예고

## 채널 유지
- 불꽃 3단·모양언어(레인/원/펄스)와 동일 팔레트
- **빨간 dodge-only 큐 금지** (코어 보류안과 충돌 방지)

## 금지
- 판정 윈도우·히트박스 변경
- `#FF3B3B` dodge-only 텔레그래프 재도입
