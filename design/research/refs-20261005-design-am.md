# refs — 2026-10-05 디자인 오전 루틴

VFX 신규 시안 정지 유지(Perfect impact 큐 ④ 미선적 — game.js/engine.js에 관련 코드 없음 확인). A~E 큐 스킵, 레퍼런스만. 이전 레퍼(히트스톱·패리 등급·텔레그래프·HP 세그먼트·오디오 믹스)와 다른 축: **보스 등장 연출** · **노을 구장 이중 조명**.

1. BattleTale — 컷신 인트로 가이드  
   https://battletale.app/customhelp/how-to/add-cutscene-intro  
   - 한줄: 보스 등장 컷신 동안 HP바·버튼·점수 등 HUD를 전부 숨기고 배경·보스·대사·스킵만 남김. 스킵 가능하므로 HP·변수 변경 같은 중요한 처리는 컷신 안에 두지 말 것.  
   - 희동이 적용: D(희동이 보스 얼굴/시작 아트) 해제 시 시작 화면을 「배경 + 희동이 + 한 줄 도발 + 건너뛰기」 4요소로 제한. 판정·HP 초기화는 컷신 밖에서 먼저 확정(스킵해도 동일). 페이즈 전환 배너(phase-world-shift)와 같은 규칙으로 재사용 가능.

2. Illumina Backdrops — Stadium at Dusk (야구 노을 구장 배경 팩 설명)  
   https://illuminabackdrops.com/products/baseball-backdrops-stadium-at-dusk  
   - 한줄: 노을이 아직 밝을 때 조명탑이 막 켜지는 "이중 조명" 순간, 내야 흙의 주황 글로우·잔디 위 긴 그림자·마운드 역광 림라이트가 핵심. 팔레트는 앰버·골드·코퍼·소프트 핑크 → 딥 블루.  
   - 희동이 적용: C(구장 배경 v2) 해제 시 하늘 그라데이션은 다크 네이비 #081329 위로 코랄→크림 띠만 지평선 쪽에 두고, 조명탑 글로우 1~2개를 크림으로. 희동이 마운드에 코랄 역광 림을 넣어 실루엣 가독성 확보(투구 텔레그래프와 색 겹치지 않게 림은 저채도).

## 러너업 (미사용)
- Epic Boss System v3.0 — 인트로 스타일 4종(None/NamePlate/CameraFocus/FullCutscene)·인트로 중 입력 차단·무적. https://adrenalinegames.pl/epicbosssystem (D 해제 시 NamePlate형 경량안 비교용)

## 프로그래머 메모
- 코드·판정 변경 없음. 신규 PNG 없음. 위 두 항목은 C·D 큐 재개 시 시안 입력값.
