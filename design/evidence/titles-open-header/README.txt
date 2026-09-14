P3 smoke: header #titles-open through start overlay (pointer-events)
URL: http://127.0.0.1:8765/?v=1789380436211
Method: playwright-core + Chrome headless; hard reload/cache bypass
Viewport: 390x844

PASS  start overlay visible
PASS  start CTA visible
PASS  SPACE hint under CTA
PASS  daily card present
PASS  title chip present
PASS  CSS overlay pointer-events none — none
PASS  CSS panel pointer-events auto — auto
PASS  elementFromPoint hits #titles-open — {"x":246,"y":36.28125,"tag":"BUTTON","id":"titles-open","className":"","overlayPE":"none","panelPE":"auto","hitsBtn":true}
PASS  header #titles-open opens dialog — {"open":true,"cards":4}
PASS  titles dialog closed
PASS  #title-chip opens dialog — {"open":true,"cards":4}
PASS  #sound toggles through overlay — before=♪ after=× pressed=false
PASS  sticky CTA near bottom — {"x":33,"y":739.8125,"width":324,"height":52}
PASS  overlay hidden after start
PASS  in-play #titles-open works — {"open":true,"cards":4}
PASS  in-play #sound works
PASS  pause shows overlay — TIME OUT
잠깐 타임!

다음 공도 받아칠 준비 됐나요?

승부 계속하기
→
시작 화면

{
  "total": 17,
  "passed": 17,
  "failed": 0,
  "fails": []
}