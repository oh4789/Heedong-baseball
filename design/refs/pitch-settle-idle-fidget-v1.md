# 투구 사이 settle + 희동이 idle fidget · v1

파일: `design/assets/pitch-settle-idle-fidget-v1.png` (시안 보드 라벨 한글)

## 목표
구와 구 사이 **사이 숨**만 추가. Soft Heat·티핑·페이크아웃·aimLockFire과 **직교**. **판정·투구 간격·점수 불변**. 빨간 dodge-only 금지.

## 채널
| 항목 | 수치 / 동작 | 비고 |
|------|-------------|------|
| 배트·타자 settle | 목표각 **150ms** spring · overshoot 소량 | 스윙/회피 직후. **배트 settle은 `swing-smear-followthrough-v1.md` 우선**(120–180ms). 본 시트는 **타자 실루엣** 동일 이징 |
| 희동이 idle fidget | 숨·어깨 **sin 저진폭** | 투구 **대기**만. **세트(windup) 진입 시 포즈 고정** |
| HUD 수치 | **120–200ms** ease-out | HP·이닝 라벨 등. **스냅 금지** |
| 불꽃 직전 | fidget **진폭만 ↓** | **긴장만**. 구종·레인 정보 **안 줌** → 티핑과 분리 |

## 충돌 방지
| 채널 | 소유 |
|------|------|
| Soft Heat | 대기 시 투구 밀도 |
| 티핑 | 몸짓으로 구종 힌트 |
| 페이크아웃 / aimLockFire | 패턴·조준 |
| 스윙 스미어 settle | 배트 아크·팔로우스루 |
| **본 시트** | 보스 fidget · HUD ease · 타자 실루엣 settle · 불꽃 직전 진폭↓ |

## 프로그래머용
- 크롭: 패널2(희동이) 실루엣+어깨 화살 **256–512px** / 패널3 HUD 바 애니 참고
- fidget: sin amp 평소 기준, 불꽃 windup 직전만 amp 배수 ~0.3–0.5 (텔레그래프 색·모양 변경 없음)
- reduced-motion: fidget OFF, settle·HUD는 즉시 또는 1f

## 팔레트
`#081329` `#F7F3E8` `#FFE09A` `#A8E8FF` `#C3A4FF` `#FF986E`  
(회피 전용 빨강 `#FF3B3B` 사용 금지)
