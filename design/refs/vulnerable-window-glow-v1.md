# 취약창 약점 글로우 · VULN WINDOW v1

파일: `design/assets/vulnerable-window-glow-v1.png`

## 목표
불꽃 회피 성공 직후, 보스/투수 약점 1–2구. **금·화이트만, 빨강 금지.**

## 상태
1. idle — 글로우 없음
2. weak — 금 림라이트 `#FFE09A` + 가슴 코어 soft pulse
3. strong — 화이트-골드 플래시 `#FFF8E7` `#FFFFFF` (창 열림 피크)

## 타이밍
- spawn: 불꽃 회피 성공 직후
- duration: 1–2 pitch
- accent 허용: `#C3A4FF` soft only

## 금지
빨강/코랄 위협색 사용 금지 (회피·불꽃 텔레그래프와 혼동 방지)
