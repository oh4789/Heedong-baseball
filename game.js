'use strict';
const $=s=>document.querySelector(s),canvas=$('#field'),ctx=canvas.getContext('2d'),game=new BaseballGame(),bg=new Image(),pitcher=new Image(),batter=new Image();const pitchPoses={idle:new Image(),windup:new Image(),arm_swing:new Image(),release:new Image(),follow:new Image()};let pitchPosesReady=false;const batterPoses={ready:new Image(),load:new Image(),swing:new Image(),contact:new Image(),follow:new Image()};let batterPosesReady=0;const W=480,H=850;let previous=0,visualTime=0,pointer=null,aim={x:0,y:0},keys={},effects=[],freeze=0,shake=0,feedbackTime=0,callTime=0,flash=0,muted=false,audio=null,pitchPoseTime=0,bossImpact=0,assetsReady=false;
let fireCoachShown=false;let perfectStreak=0;let defeatRetryAt=0;
const FTUE_KEY='beat-heedong.ftue-hitzone-v1';
let ftueActive=false,ftueFade=0,ftuePlayTime=0,ftuePitchCount=0;
// Heedong taunt pool for damage/whiff reactions (engine emits fixed lines; diversify here)
const HEEDONG_TAUNTS=['벌써 휘둘렀어?','이번 공은 내 거야.','너무 서두르네~','내 마구는 어때?','아직 멀었어!','그게 최선이야?','눈에 불을 켜봐!'];
function pickHeedongTaunt(fallback){
 if(fallback&&(fallback.startsWith('콤보 보호')||fallback==='이제 진짜 던진다!'))return fallback;
 return HEEDONG_TAUNTS[(Math.random()*HEEDONG_TAUNTS.length)|0];
}

let recordStorage;try{recordStorage=window.localStorage}catch{}
const records=new BaseballRecords(recordStorage);let matchRecordStart={...records.data};
function recordsHtml(showNew=false){
 const d=records.data;
 const stageNew=showNew&&d.stage>matchRecordStart.stage,perfectNew=showNew&&d.perfects>matchRecordStart.perfects;
 return '<div class="personal-records"><div class="record-title">나의 최고 기록'+(stageNew||perfectNew?' · <strong>NEW!</strong>':'')+'</div><div class="record-values"><span>최고 도달 <b>'+d.stage+' 스테이지</b></span><span>한 승부 PERFECT <b>'+d.perfects+'회</b></span></div><p>'+(records.saved?'이 기기·브라우저에 저장됩니다':'저장 불가 · 현재 접속 중에만 유지됩니다')+'</p></div>';
}
$('#personal-records').innerHTML=recordsHtml();
TitleBook.init({getRecords:()=>records.data,say:(t,c,d)=>say(t,c,d)});
DailyMatch.init({start:()=>start('new'),assetsReady:false});
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=canvas.clientWidth*d;canvas.height=canvas.clientHeight*d}addEventListener('resize',resize);resize();
function sound(kind){if(muted||!audio)return;try{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.type=kind==='perfect'?'square':'triangle';const f={perfect:880,hit:420,whiff:140,damage:90,pitch:230,windup:300,impact:150,fury:100}[kind]||400;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(Math.max(40,f*.35),t+.12);g.gain.setValueAtTime(kind==='perfect'?.065:.05,t);g.gain.exponentialRampToValueAtTime(.001,t+.17);o.connect(g).connect(audio.destination);o.start();o.stop(t+.18)}catch{}}
function activateAudio(){try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume()}catch{}}
function clearInput(){pointer=null;aim={x:0,y:0};keys={}}
const cinematicScenes=[
 {name:'조용한 구장',line:'오늘은… 이상할 만큼 조용하다.',sub:'관중석도, 응원도 — 나만 서 있다.',duration:2200,alt:'노을이 지는 야구장과 희동이를 이겨라 전광판'},
 {name:'희동이의 도발',line:'“내 공, 하나라도 제대로 쳐봐.”',sub:'친구 희동이. 웃는 얼굴이 더 얄밉다.',duration:3200,alt:'공을 내밀며 자신 있게 웃는 희동이'},
 {name:'배트를 잡다',line:'좋아. 던지면 받아친다.',sub:'장갑을 조이고, 눈을 공에 고정한다.',duration:2200,alt:'10번 타자가 장갑을 낀 손으로 배트를 잡는 모습'},
 {name:'첫 번째 공',line:'뭐야, 이 공—!',sub:'타이밍이 안 맞는다. 뭔가 이상해.',duration:3200,alt:'첫 공에 타이밍을 놓치고 당황하는 타자'},
 {name:'쌍둥이의 기습',line:'잠깐, 둘이잖아?!',sub:'희원이의 도움. 사전 경고 제로.',duration:3200,alt:'놀란 타자와 갑자기 협공하는 희동이 희원이 쌍둥이'},
 {name:'희동이를 이겨라',line:'희동이를 이겨라',sub:'쌍둥이의 마구 — 네 배트로 끊는다.',duration:2200,alt:'보라색 마구와 쌍둥이가 등장하는 희동이를 이겨라 타이틀'}
];
const openingVideo=$('#opening-video');let cinematicFocus=null;
function finishCinematic(){openingVideo.pause();GameMusic.stop();$('#cinematic').classList.add('hidden');$('#overlay').inert=false;try{localStorage.setItem('beat-heedong.video-v1-seen','1')}catch{}(cinematicFocus||$('#start')).focus()}
function updateOpeningCaption(){let total=0,index=5;for(let i=0;i<cinematicScenes.length;i++){total+=cinematicScenes[i].duration/1000;if(openingVideo.currentTime<total){index=i;break}}const scene=cinematicScenes[index];openingVideo.style.objectPosition=[50,29,32,56,42,66][index]+'% center';$('#cinematic-chapter').textContent=String(index+1).padStart(2,'0')+' / 06 · '+scene.name;$('#cinematic-line').textContent=scene.line;$('#cinematic-sub').textContent=scene.sub;$('#cinematic-progress').innerHTML=cinematicScenes.map((_,i)=>'<i class="'+(i<=index?'active':'')+'"></i>').join('');}
function playCinematic(force=false){let seen=false;try{seen=localStorage.getItem('beat-heedong.video-v1-seen')==='1'}catch{}if(seen&&!force)return false;clearInput();cinematicFocus=force?$('#intro-replay'):$('#start');$('#overlay').inert=true;$('#cinematic').classList.remove('hidden');if(!openingVideo.getAttribute('src'))openingVideo.src='opening-full.mp4';openingVideo.currentTime=0;openingVideo.muted=true;activateAudio();GameMusic.activate();GameMusic.setMuted(muted);GameMusic.startOpening();$('#cinematic-next').textContent=openingVideo.paused?'영상 재생 ▶':'일시정지 Ⅱ';updateOpeningCaption();openingVideo.play().catch(()=>{$('#cinematic-next').textContent='영상 재생 ▶'});$('#cinematic-skip').focus();return true}
$('#cinematic-next').onclick=()=>{if(openingVideo.paused){openingVideo.play().catch(()=>{});GameMusic.activate();GameMusic.setMuted(muted);GameMusic.startOpening();$('#cinematic-next').textContent='일시정지 Ⅱ'}else{openingVideo.pause();GameMusic.stop();$('#cinematic-next').textContent='계속 재생 ▶'}};
openingVideo.addEventListener('timeupdate',updateOpeningCaption);openingVideo.addEventListener('ended',finishCinematic);openingVideo.addEventListener('error',finishCinematic);
$('#cinematic').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finishCinematic()}if(e.key==='Tab'){const first=$('#cinematic-skip'),last=$('#cinematic-next');if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});

function ftueSeen(){try{return localStorage.getItem(FTUE_KEY)==='1'}catch{return false}}
function enableFtueIfNeeded(mode){
 ftueActive=false;ftueFade=0;ftuePlayTime=0;ftuePitchCount=0;
 if(mode==='continue')return;
 if(!ftueSeen())ftueActive=true;
}
function dismissFtue(){
 if(!ftueActive)return;
 ftueActive=false;ftueFade=.4;
 try{localStorage.setItem(FTUE_KEY,'1')}catch{}
}
function drawFtueHand(x,y,ghost){
 // Cream finger/hand silhouette (or dotted ghost for drag start)
 ctx.save();ctx.translate(x,y);ctx.rotate(-.35);
 if(ghost){
  ctx.strokeStyle='#F7F3E899';ctx.setLineDash([3,4]);ctx.lineWidth=2;ctx.fillStyle='#F7F3E822';
 }else{
  ctx.fillStyle='#F7F3E8';ctx.strokeStyle='#F7F3E8';ctx.lineWidth=0;ctx.setLineDash([]);
 }
 // palm
 ctx.beginPath();ctx.ellipse(0,18,16,20,0,0,7);ghost?ctx.stroke():ctx.fill();
 // index finger toward zone center
 ctx.beginPath();ctx.ellipse(-2,-18,7,22,0,0,7);ghost?ctx.stroke():ctx.fill();
 // thumb
 ctx.beginPath();ctx.ellipse(-16,6,7,12,-.6,0,7);ghost?ctx.stroke():ctx.fill();
 // knuckle bumps
 if(!ghost){
  ctx.fillStyle='#EDE6D4';
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(8+i*1.5,4+i*7,4.5,5.5,0,0,7);ctx.fill()}
 }
 ctx.setLineDash([]);ctx.restore();
}
function drawFtueGuide(){
 if(!ftueActive&&ftueFade<=0)return;
 const a=ftueActive?1:Math.max(0,ftueFade/.4);
 const z=game.zone;
 ctx.save();ctx.globalAlpha=a;
 // Soft dim over playfield — does not block input (canvas draw only)
 ctx.fillStyle='#081329aa';ctx.fillRect(0,0,W,H);
 const pulse=1+Math.sin(visualTime*5)*.07;
 const R=64*pulse; // ~120–140px diameter
 // Mint outer pulse ring
 ctx.shadowColor='#9BFFE6';ctx.shadowBlur=18+Math.sin(visualTime*4)*6;
 ctx.strokeStyle='#9BFFE6';ctx.lineWidth=5.5;ctx.globalAlpha=a*(.75+Math.sin(visualTime*4)*.2);
 ctx.beginPath();ctx.arc(z.x,z.y,R,0,7);ctx.stroke();
 // Soft mint fill
 ctx.shadowBlur=0;ctx.fillStyle='#9BFFE618';ctx.globalAlpha=a*.9;
 ctx.beginPath();ctx.arc(z.x,z.y,R*.92,0,7);ctx.fill();
 // Dashed inner ring
 ctx.strokeStyle='#9BFFE6';ctx.lineWidth=2;ctx.setLineDash([5,6]);ctx.globalAlpha=a*.85;
 ctx.beginPath();ctx.arc(z.x,z.y,R*.55,0,7);ctx.stroke();ctx.setLineDash([]);
 // Mint trail arc under hand (drag→release cue)
 const drag=Math.sin(visualTime*2.2)*.5+.5; // 0..1 loop
 const hx0=z.x-52, hx1=z.x+8, hy=z.y+38;
 ctx.strokeStyle='#9BFFE6';ctx.shadowColor='#9BFFE6';ctx.shadowBlur=10;ctx.lineWidth=4;ctx.lineCap='round';
 ctx.globalAlpha=a*(.45+.4*drag);
 ctx.beginPath();ctx.moveTo(hx0,hy+6);ctx.quadraticCurveTo((hx0+hx1)/2,hy+28,hx1,hy);ctx.stroke();
 ctx.shadowBlur=0;
 // Ghost hand (drag start) + solid hand (current)
 drawFtueHand(hx0+drag*18,hy-8,true);
 ctx.globalAlpha=a;
 drawFtueHand(hx0+28+drag*36,hy-10,false);
 // Curved mint release arrow
 ctx.strokeStyle='#9BFFE6';ctx.fillStyle='#9BFFE6';ctx.lineWidth=3;ctx.lineCap='round';
 ctx.globalAlpha=a*(.55+drag*.4);
 const ax=z.x+36,ay=z.y-8;
 ctx.beginPath();ctx.moveTo(ax-10,ay+18);ctx.quadraticCurveTo(ax+22,ay+10,ax+8,ay-16);ctx.stroke();
 ctx.beginPath();ctx.moveTo(ax+8,ay-16);ctx.lineTo(ax-2,ay-6);ctx.lineTo(ax+16,ay-4);ctx.closePath();ctx.fill();
 // Caption near hand
 ctx.globalAlpha=a;ctx.fillStyle='#F7F3E8';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillText('떼면 스윙',z.x+8,z.y+72);
 // Main label above ring
 ctx.font='bold 16px system-ui';
 const label='여기서 스윙';
 ctx.fillStyle='#F7F3E8';ctx.fillText(label,z.x,z.y-R-22);
 // Mint triangles ▶ ◀
 ctx.fillStyle='#9BFFE6';
 const tw=ctx.measureText(label).width/2+14;
 ctx.beginPath();ctx.moveTo(z.x-tw-10,z.y-R-22);ctx.lineTo(z.x-tw,z.y-R-27);ctx.lineTo(z.x-tw,z.y-R-17);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.moveTo(z.x+tw+10,z.y-R-22);ctx.lineTo(z.x+tw,z.y-R-27);ctx.lineTo(z.x+tw,z.y-R-17);ctx.closePath();ctx.fill();
 // Side hint chips: 드래그로 위치 · 손 떼면 스윙
 function chip(cx,cy,text){
  ctx.fillStyle='#081329cc';ctx.strokeStyle='#9BFFE655';ctx.lineWidth=1.5;
  const w=Math.max(86,text.length*11+28),h=28;
  ctx.beginPath();
  const r=10,x0=cx-w/2,y0=cy-h/2;
  ctx.moveTo(x0+r,y0);ctx.arcTo(x0+w,y0,x0+w,y0+h,r);ctx.arcTo(x0+w,y0+h,x0,y0+h,r);ctx.arcTo(x0,y0+h,x0,y0,r);ctx.arcTo(x0,y0,x0+w,y0,r);ctx.closePath();
  ctx.fill();ctx.stroke();
  ctx.fillStyle='#9BFFE6';ctx.beginPath();ctx.arc(x0+14,cy,6,0,7);ctx.fill();
  ctx.fillStyle='#F7F3E8';ctx.font='bold 11px system-ui';ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText(text,x0+24,cy);
 }
 const chipY=Math.min(H-36,z.y+110);
 chip(Math.max(70,z.x-130),chipY,'드래그로 위치');
 chip(Math.min(W-70,z.x+130),chipY,'손 떼면 스윙');
 ctx.textBaseline='alphabetic';ctx.restore();
}

function start(mode='new'){if(!assetsReady)return;document.activeElement?.blur();activateAudio();GameMusic.activate();GameMusic.setMuted(muted);GameMusic.startPlay();clearInput();matchRecordStart={...records.data};if(mode!=='continue')fireCoachShown=false;perfectStreak=0;enableFtueIfNeeded(mode);if(mode==='continue')game.continueRun();else game.newRun();records.update(game.stage,game.perfects);effects=[];freeze=shake=flash=pitchPoseTime=bossImpact=0;$('#overlay').classList.add('hidden');say('공이 원에 오면 손을 떼세요','#e1f7d3',2.8);$('#pitchcall').textContent='';previous=performance.now();hud()}
function say(t,c='#ffdda0',duration=.85){$('#feedback').textContent=t;$('#feedback').style.color=c;$('#feedback').style.fontSize=t.length>14?'18px':'30px';feedbackTime=duration}
function burst(x,y,color,n=15){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=45+Math.random()*180;effects.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.3+Math.random()*.3,color})}}
function hud(){$('#bossbar').style.width=Math.max(0,game.boss/game.bossMax*100)+'%';$('#bossvalue').textContent=game.boss+' / '+game.bossMax;$('#stage').textContent='STAGE '+game.stage+' · '+(game.stage===1?'NORMAL':game.stage===2?'HARD':'FEVER');$('#hearts').textContent='♥ '.repeat(game.hp)+'♡ '.repeat(3-game.hp);$('#hearts').setAttribute('aria-label','체력 '+game.hp);$('#clock').textContent=Math.floor(game.time/60)+':'+String(Math.floor(game.time%60)).padStart(2,'0');$('#combo').innerHTML='<b>'+game.combo+'</b> COMBO';$('#pitchcount').textContent=game.pitchCount?game.pitchCount+'번째 투구':'첫 번째 승부';$('#hits').textContent='PERFECT '+game.perfects;$('#ready').textContent=game.cooldown>0?'배트 회수 중':'스윙 준비';$('#cool').style.width=(1-game.cooldown/(game.getSwingCooldown?game.getSwingCooldown():.38))*100+'%'}
function nextUpgradeText(key){const d=BaseballGame.UPGRADE_DATA[key],current=game.meta[key]||0,next=d.levels[current];return next?'다음 Lv.'+next.level+' · '+d.stat+' '+next.value:'최대 레벨 · '+d.stat+' '+d.levels[d.levels.length-1].value}
function showStartMenu(){
 GameMusic.stop();
 clearInput();
 if(game.state==='playing'||game.state==='paused')game.state='ready';
 const panel=$('#overlay .panel');
 panel.classList.add('start-panel');
 panel.innerHTML=`<div class="panel-body"><div class="menu-art" role="img" aria-label="희동이 보스 클로즈업"></div><span class="eyebrow">BEAT HEEDONG</span><h1>희동이를 이겨라</h1><button type="button" id="title-chip" class="title-chip" aria-label="칭호 없음 · 도감 열기"><span class="title-chip-text">칭호 없음 · 탭해서 고르기</span><span class="title-chip-chevron" aria-hidden="true">›</span></button><p class="sub">“내 공, 하나라도 제대로 쳐봐.”</p><div class="rules"><p><b>01</b><span>드래그해서 <strong>공 앞에 자리 잡기</strong></span></p><p><b>02</b><span>초록 원에 오면 <strong>손 떼서 스윙</strong></span></p><p><b>03</b><span><strong class="red">불꽃 마구</strong>는 옆으로 피하기</span></p></div><div id="personal-records"></div><div id="daily-match"></div><button type="button" class="ranking-open" id="ranking-start">공용 랭킹 보기</button><button type="button" id="intro-replay" class="intro-replay">오프닝 다시 보기</button></div><div class="panel-cta"><button class="primary" id="start" disabled>구장 준비 중…</button><p id="loadnote" class="keyboard">PC: 방향키 / WASD 이동 · <kbd>SPACE</kbd> 스윙</p></div>`;
 $('#overlay').classList.remove('hidden');
 $('#personal-records').innerHTML=recordsHtml();
 DailyMatch.renderCard();
 if(typeof TitleBook.bindUi==='function')TitleBook.bindUi();
 TitleBook.refreshChip();
 if(typeof TitleBook.refreshHeaderDot==='function')TitleBook.refreshHeaderDot();
 const startBtn=$('#start');
 startBtn.onclick=()=>{DailyMatch.beginNormal();start('new')};
 if(assetsReady){startBtn.disabled=false;startBtn.innerHTML='플레이 볼 <span>→</span>'}
 else{startBtn.disabled=true;startBtn.textContent='구장 준비 중…'}
 $('#intro-replay').onclick=()=>playCinematic(true);
 const rank=$('#ranking-start');
 if(rank)rank.onclick=SharedRanking.open;
}
function tryDefeatRetry(from){
 if(game.state!=='lost')return false;
 if(performance.now()<defeatRetryAt)return false;
 const panel=$('#overlay .panel');
 if(!panel||$('#overlay').classList.contains('hidden'))return false;
 defeatRetryAt=Infinity;
 DailyMatch.beginNormal();
 start('new');
 return true;
}
function end(){clearInput();GameMusic.stop();records.update(game.stage,game.perfects);TitleBook.noteRun({dodges:game.dodges,stage:game.stage,perfects:game.perfects});if(DailyMatch.isActive())DailyMatch.noteRun({stage:game.stage,perfects:game.perfects,won:game.state==='won'});const won=game.state==='won';const choices=won?game.getUpgradeChoices():[];const upgradeHtml=choices.length?'<p class="upgrade-title">강화 하나 선택 · 다음 승부에도 이어집니다</p><div class="upgrade-list">'+choices.map(key=>'<button class="upgrade" data-up="'+key+'"><b>'+BaseballGame.UPGRADE_DATA[key].name+' · Lv.'+(game.meta[key]||0)+'</b><small>'+nextUpgradeText(key)+'</small></button>').join('')+'</div>':'<p class="upgrade-title">모든 강화를 완성했어요!</p><button class="primary" id="continue-max">다음 승부로 →</button>';$('#overlay').classList.remove('hidden');$('#overlay .panel').classList.remove('start-panel');const resultBody=`<div class="story-art ${won?'scene-4':'scene-5'} result-art" role="img" aria-label="${won?'공을 받아친 타자':'쌍둥이의 협공에 놀란 타자'}"></div><span class="eyebrow">${won?'YOU WIN THE DUEL':'STRIKE BACK NEXT TIME'}</span><h1>${won?'희동이를 이겼다!':'다시 도전할까?'}</h1><p class="sub">${won?'다음 승부엔 더 강한 마구가 기다립니다.':'공을 끝까지 보고, 손을 떼보세요.'}</p><div class="result-grid"><div><b>${game.perfects}</b><small>PERFECT</small></div><div><b>${game.bestCombo}</b><small>최대 콤보</small></div><div><b>${Math.floor(game.time)}s</b><small>승부 시간</small></div></div><p class="detail">타격 ${game.hits}회 · 헛스윙 ${game.misses}회<br>랠리 ${game.rallyCount}회 · 불꽃 마구 회피 ${game.dodges}회</p>${recordsHtml(true)}${TitleBook.unlockNoteHtml()}${DailyMatch.resultNoteHtml()}${SharedRanking.resultHtml()}`;const menuBtn='<button type="button" class="secondary" id="to-menu">시작 화면</button>';const resultCta=won?upgradeHtml+menuBtn:'<button class="primary" id="retry">다시 승부하기 <span>↻</span></button>'+menuBtn;$('#overlay .panel').innerHTML=`<div class="panel-body">${resultBody}</div><div class="panel-cta">${resultCta}</div>`;SharedRanking.bindResult($('#overlay .panel'),{stage:game.stage,perfects:game.perfects,daily:DailyMatch.isActive()&&DailyMatch.state.cleared});const goMenu=()=>{DailyMatch.beginNormal();showStartMenu()};$('#to-menu').onclick=goMenu;if(won){document.querySelectorAll('.upgrade').forEach(b=>b.onclick=()=>{if(game.chooseUpgrade(b.dataset.up))start('continue')});if(!choices.length)$('#continue-max').onclick=()=>start('continue')}else{
 defeatRetryAt=performance.now()+250;
 const panel=$('#overlay .panel');
 const onRetry=e=>{if(e){e.preventDefault();e.stopPropagation()}tryDefeatRetry('btn')};
 $('#retry').onclick=onRetry;
 // Tap anywhere on panel/CTA except menu/secondary/upgrade areas
 panel.onclick=e=>{
  const block=e.target.closest('button,a,input,textarea,select,label,summary,form,.upgrade,.share-record');
  if(block&&block.id!=='retry')return;
  tryDefeatRetry('panel');
 };
}}
function pause(){if(!$('#cinematic').classList.contains('hidden'))return;if(game.state==='playing'){game.state='paused';clearInput();GameMusic.stop();$('#overlay').classList.remove('hidden');$('#overlay .panel').classList.remove('start-panel');$('#overlay .panel').innerHTML='<div class="panel-body"><span class="eyebrow">TIME OUT</span><h1>잠깐 타임!</h1><p class="detail">다음 공도 받아칠 준비 됐나요?</p></div><div class="panel-cta"><button class="primary" id="resume">승부 계속하기 <span>→</span></button><button type="button" class="secondary" id="to-menu">시작 화면</button></div>';$('#resume').onclick=()=>{game.state='playing';document.activeElement?.blur();previous=performance.now();GameMusic.activate();GameMusic.setMuted(muted);GameMusic.startPlay();$('#overlay').classList.add('hidden')};$('#to-menu').onclick=()=>{DailyMatch.beginNormal();showStartMenu()}}else if(game.state==='paused'){const r=$('#resume');if(r)r.click()}}
$('#start').onclick=()=>{DailyMatch.beginNormal();start('new')};$('#pause').onclick=pause;$('#cinematic-skip').onclick=finishCinematic;$('#intro-replay').onclick=()=>playCinematic(true);$('#sound').onclick=()=>{muted=!muted;$('#sound').textContent=muted?'×':'♪';$('#sound').setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');$('#sound').setAttribute('aria-pressed',String(!muted));GameMusic.setMuted(muted);if(!muted){activateAudio();GameMusic.activate();if(!$('#cinematic').classList.contains('hidden'))GameMusic.startOpening();else if(game.state==='playing')GameMusic.startPlay()}};
canvas.addEventListener('pointerdown',e=>{if(game.state!=='playing'||pointer)return;e.preventDefault();activateAudio();canvas.setPointerCapture(e.pointerId);pointer={id:e.pointerId,x:e.clientX,y:e.clientY};aim={x:0,y:0}});canvas.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;const sx=W/canvas.clientWidth,sy=H/canvas.clientHeight;aim={x:(e.clientX-pointer.x)*sx,y:(e.clientY-pointer.y)*sy};const l=Math.hypot(aim.x,aim.y);if(l>48){pointer.x=e.clientX-aim.x/l*48/sx;pointer.y=e.clientY-aim.y/l*48/sy}});canvas.addEventListener('pointerup',e=>{if(!pointer||e.pointerId!==pointer.id)return;clearInput();game.swing();processEvents()});function cancel(e){if(pointer?.id===e.pointerId)clearInput()}canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);
addEventListener('keydown',e=>{if(!$('#cinematic').classList.contains('hidden')||e.target?.closest?.('input,textarea,dialog,button'))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.code==='Space'&&!e.repeat){if(tryDefeatRetry('space'))return;activateAudio();game.swing();processEvents()}if(e.key==='Escape'&&!e.repeat)pause()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>{if(game.state==='playing')pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='playing')pause()});
function processEvents(){for(const e of game.events.splice(0)){sound(e.type);if(e.type==='perfect'){dismissFtue();perfectStreak++;records.update(game.stage,game.perfects);say('PERFECT!','#fff2a5');const n=perfectStreak>=4?48:perfectStreak>=2?38:28;burst(e.x,e.y,'#FFD25B',n);burst(e.x,e.y,'#FFE09A',Math.floor(n/2));burst(e.x,e.y,'#FFF2A5',Math.floor(n/3));if(perfectStreak>=4)burst(e.x,e.y,'#C3A4FF',8);freeze=.045;shake=.12}else if(e.type==='hit'){dismissFtue();perfectStreak=0;say('NICE HIT','#b5f3d2');burst(e.x,e.y,'#b5f3d2',12)}else if(e.type==='whiff'){perfectStreak=0;say('헛스윙','#b8cccc',.45)}else if(e.type==='lastStand'){say('끝까지 버티기! · 체력 1','#a7ffe3',1.3);burst(game.player.x,game.player.y,'#a7ffe3',24)}else if(e.type==='damage'){perfectStreak=0;say('피격!','#ff9a84');flash=.18;shake=.16;burst(e.x,e.y,'#ff997d');}else if(e.type==='windup'){$('#pitchcall').innerHTML='<span>'+({double:'연속 직구 · 두 번 받아치세요',changeFast:'체인지업 → 직구 · 기다렸다 두 번!',slider:'슬라이더 · 휘는 공을 따라가세요'}[e.pattern]||(e.pitch==='fire'?'⚠ 불꽃 마구 · 회피':e.pitch==='slow'?'체인지업 · 기다리세요':'직구 · 받아치세요'))+'</span>';$('#pitchcall').style.color=e.pitch==='fire'?'#FFC9A8':e.pitch==='slow'?'#a5e7ff':'#f4eacb';callTime=4;if(e.pitch==='fire'&&!fireCoachShown){fireCoachShown=true;say('불꽃 마구! · 치지 말고 옆으로!','#FF7A45',2.2)}}else if(e.type==='pitch'){pitchPoseTime=.55;if(ftueActive){ftuePitchCount++;if(ftuePitchCount>=4)dismissFtue()}}else if(e.type==='twin'){say('희원이의 도움!','#d9b5ff',1.1);burst(240,250,'#d59cff',22)}else if(e.type==='impact'){bossImpact=.2;burst(240,280,e.perfect?'#ffdb82':'#c3efd3',18)}else if(e.type==='rally'){say('RALLY x'+e.count+' · 홈런 찬스!','#ffe38c',1.1);burst(240,280,'#ffb84d',32);freeze=.06;shake=.24}else if(e.type==='reaction'){say(pickHeedongTaunt(e.line),'#d3e8ff',1.15)}else if(e.type==='fury')say('승부는 지금부터!','#ffd18b',1.2);else if(e.type==='end')end()}hud()}
function ball(x,y,r,color,fire=false){ctx.save();ctx.translate(x,y);if(fire){ctx.fillStyle='#f8773766';ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(-r*.6,-r*3.2);ctx.lineTo(0,-r*1.6);ctx.lineTo(r*.6,-r*3.8);ctx.lineTo(r,0);ctx.fill()}ctx.shadowColor=color;ctx.shadowBlur=fire?15:7;ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=fire?'#6d260d':'#ba5a51';ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(-r*.8,0,r*.7,-1.1,1.1);ctx.stroke();ctx.beginPath();ctx.arc(r*.8,0,r*.7,2.05,4.25);ctx.stroke();ctx.restore()}
function currentPitchPose(){
 if(game.windup){
  const dur=game.windup.duration||game.windup.t||1;
  const remain=Math.max(0,game.windup.t)/dur;
  return remain<=0.42?'arm_swing':'windup';
 }
 if(pitchPoseTime>0.45)return 'release';
 if(pitchPoseTime>0)return 'follow';
 return 'idle';
}
function drawPitcher(){
 // Pose frames are crop-ready 941×592 with alpha; draw over stadium (no solid card).
 const pose=currentPitchPose();
 const frame=pitchPoses[pose];
 if(frame&&frame.naturalWidth){
  // Transparent pose on stadium — no solid letterbox card.
  ctx.drawImage(frame,0,0,frame.naturalWidth,frame.naturalHeight,0,116,480,302);
 }else if(pitcher.complete&&pitcher.naturalWidth){
  ctx.drawImage(pitcher,0,143,941,592,0,116,480,302);
 }
 const fade=ctx.createLinearGradient(0,400,0,442);fade.addColorStop(0,'#18362900');fade.addColorStop(.45,'#18362988');fade.addColorStop(1,'#18362900');ctx.fillStyle=fade;ctx.fillRect(0,400,480,42);
 if(bossImpact>0){ctx.strokeStyle='#ffe3a1';ctx.globalAlpha=bossImpact*3;ctx.lineWidth=2;ctx.beginPath();ctx.arc(240,290,18+(1-bossImpact/.2)*20,0,7);ctx.stroke();ctx.globalAlpha=1}
}
function currentBatterPose(){
 if(game.swingAnim<=0)return 'ready';
 const progress=1-game.swingAnim/.21;
 if(progress<0.2)return 'load';
 if(progress<0.45)return 'swing';
 if(progress<0.7)return 'contact';
 return 'follow';
}
function drawBatter(){
 const p=game.player;
 ctx.save();ctx.translate(p.x,p.y);
 if(game.inv>0&&Math.floor(game.inv*12)%2)ctx.globalAlpha=.4;
 ctx.fillStyle='#02091455';ctx.beginPath();ctx.ellipse(-20,102,40,9,0,0,7);ctx.fill();
 ctx.translate(-42,37);
 const pose=currentBatterPose();
 const frame=batterPoses[pose];
 if(frame&&frame.naturalWidth){
  ctx.drawImage(frame,0,0,frame.naturalWidth,frame.naturalHeight,-96,-148,173,220);
 }else if(batter.complete&&batter.naturalWidth){
  const progress=game.swingAnim>0?1-game.swingAnim/.21:0;
  ctx.rotate(game.swingAnim>0?Math.sin(progress*Math.PI)*.12:0);
  ctx.drawImage(batter,-96,-148,173,220);
 }
 ctx.restore();
}
function draw(){
 ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
 ctx.fillStyle='#102336';ctx.fillRect(0,0,W,H);ctx.save();
 if(shake>0)ctx.translate((Math.random()-.5)*5,(Math.random()-.5)*5);
 if(bg.complete&&bg.naturalWidth)ctx.drawImage(bg,0,0,W,H);
 const shade=ctx.createLinearGradient(0,430,0,850);shade.addColorStop(0,'#08213000');shade.addColorStop(1,'#05182d25');ctx.fillStyle=shade;ctx.fillRect(0,430,W,420);
 drawPitcher();
 const z=game.zone;
 const pz=game.getPerfectZone();
 const near=game.balls.some(b=>b.t>=0&&b.type!=='fire'&&((b.x-z.x)/game.getWideReach())**2+((b.y-z.y)/48)**2<=1);
 const inPerfect=game.balls.some(b=>b.t>=0&&b.type!=='fire'&&((b.x-z.x)/pz.x)**2+((b.y-z.y)/pz.y)**2<=1);
 // Timing-ring v1 colors only (no Early/Late labels): idle #8AFDCB, near #CAFFAC, perfect flash #FFE09A
 ctx.fillStyle=near?(inPerfect?'#FFE09A24':'#CAFFAC22'):'#a6fdda09';
 ctx.strokeStyle=game.cooldown>0?'#a4ccbf55':inPerfect?'#FFE09A':near?'#CAFFAC':'#8AFDCBbb';
 ctx.lineWidth=inPerfect?3.5:near?3:2;
 ctx.shadowColor=inPerfect?'#FFE09A':near?'#CAFFAC':'#8AFDCB';
 ctx.shadowBlur=inPerfect?22:near?14:6;
 ctx.beginPath();ctx.ellipse(z.x,z.y,game.getWideReach(),48,0,0,7);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
 ctx.strokeStyle=inPerfect?'#FFE09Acc':'#CAFFAC66';ctx.lineWidth=inPerfect?2.4:1.2;
 if(inPerfect){ctx.shadowColor='#FFE09A';ctx.shadowBlur=16}
 ctx.setLineDash(inPerfect?[]:[3,5]);ctx.beginPath();ctx.ellipse(z.x,z.y,pz.x,pz.y,0,0,7);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
 if(inPerfect){
  // Perfect ellipse only: hard flash (design note) — visual only
  ctx.save();ctx.translate(z.x,z.y);ctx.globalAlpha=.35+Math.sin(visualTime*36)*.25;
  ctx.fillStyle='#FFF2A5';ctx.beginPath();
  for(let i=0;i<8;i++){const a=i*Math.PI/4+visualTime*2,r=i%2?18:8;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}
  ctx.closePath();ctx.fill();ctx.restore();
 }
 if(game.state==='ready'){ctx.fillStyle='#d1ffde';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText('PARRY',z.x,z.y-57)}
 if(game.windup){
  const dur=game.windup.duration||game.windup.t||1;
  const remain=Math.max(0,game.windup.t)/dur;
  const pulse=.35+Math.sin(visualTime*20)*.15;
  if(game.windup.type==='fire'){
   // Design fire telegraph v1: early #FFC9A8 / late #FF7A45 (flight stage when ball y>420)
   const cx=240,cy=290;
   if(remain>0.45){
    // Early windup: soft peach ring
    const R=15+(1-remain)*8;
    ctx.strokeStyle='#FFC9A8';ctx.shadowColor='#FFC9A8';ctx.shadowBlur=10;
    ctx.globalAlpha=.4+Math.sin(visualTime*12)*.15;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
    ctx.shadowBlur=0;ctx.fillStyle='#FFC9A855';ctx.globalAlpha=pulse*.55;
    ctx.beginPath();ctx.arc(cx,cy,R*.5,0,7);ctx.fill();
   }else{
    // Late windup: thicker #FF7A45 ring + warning triangle
    const R=20+(0.45-remain)*22;
    ctx.strokeStyle='#FF7A45';ctx.shadowColor='#FF7A45';ctx.shadowBlur=14;
    ctx.globalAlpha=.65+Math.sin(visualTime*18)*.2;ctx.lineWidth=4.5;
    ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle='#FF7A4544';ctx.globalAlpha=.4+Math.sin(visualTime*16)*.15;
    ctx.beginPath();ctx.arc(cx,cy,R*1.2,0,7);ctx.fill();
    // Warning triangle + core highlight
    const s=14+(0.45-remain)*10;
    ctx.globalAlpha=.85+Math.sin(visualTime*22)*.15;
    ctx.fillStyle='#FF7A45';ctx.beginPath();
    ctx.moveTo(cx,cy-s);ctx.lineTo(cx+s*.9,cy+s*.7);ctx.lineTo(cx-s*.9,cy+s*.7);ctx.closePath();ctx.fill();
    ctx.fillStyle='#FFD25B';ctx.beginPath();
    ctx.moveTo(cx,cy-s*.55);ctx.lineTo(cx+s*.45,cy+s*.35);ctx.lineTo(cx-s*.45,cy+s*.35);ctx.closePath();ctx.fill();
    ctx.fillStyle='#1a1020';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('!',cx,cy+2);
   }
   ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.textBaseline='alphabetic';
  }else{
   // Normal pitches keep yellow cue
   ctx.fillStyle='#fff0b9';ctx.globalAlpha=pulse;ctx.beginPath();ctx.arc(240,290,9+(1-remain)*9,0,7);ctx.fill();ctx.globalAlpha=1;
  }
 }
 drawBatter();
 for(const b of game.balls){
 if(b.t<0)continue;
 const fire=b.type==='fire',color=fire?'#FF7A45':b.twin?'#e4a6ff':b.type==='slider'?'#82ffd0':b.type==='slow'?'#b5e8ff':'#fff4df';
 const r=8+Math.min(1,b.t/b.duration)*5;
 ctx.strokeStyle=fire?'#FF5A2A66':b.type==='slow'?'#a8d9ff60':'#fff1cc60';ctx.lineWidth=fire?14:4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b.x-(b.tx-240)*.05,b.y-(fire?63:28));ctx.lineTo(b.x,b.y);ctx.stroke();
 if(fire){for(let j=0;j<5;j++){const h=20+j*11;ctx.fillStyle=j%2?'#FFD25B99':'#FF5A2A88';ctx.beginPath();ctx.arc(b.x+Math.sin(visualTime*21+j)*j*1.4,b.y-h,Math.max(1,7-j),0,7);ctx.fill()}}
 ball(b.x,b.y,r,color,fire);
 if(fire&&b.y>420){
  // Flight evasion stage: #FF5A2A dashed landing oval + ! badge (design v1)
  ctx.strokeStyle='#FF5A2A';ctx.shadowColor='#FF5A2A';ctx.shadowBlur=12;ctx.globalAlpha=.75+Math.sin(visualTime*16)*.15;
  ctx.lineWidth=2.5;ctx.setLineDash([6,5]);
  ctx.beginPath();ctx.ellipse(b.x,Math.min(H-40,b.y+18),28,12,0,0,7);ctx.stroke();
  ctx.setLineDash([]);ctx.shadowBlur=0;ctx.globalAlpha=1;
  const bx=b.x+34,by=b.y+10;
  ctx.fillStyle='#FF5A2Acc';ctx.beginPath();ctx.arc(bx,by,12,0,7);ctx.fill();
  ctx.fillStyle='#FFD25B';ctx.beginPath();ctx.arc(bx,by,7,0,7);ctx.fill();
  ctx.fillStyle='#1a1020';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('!',bx,by+1);ctx.textBaseline='alphabetic';
 }
 }
 for(const r of game.returns){
  const q=Math.min(1,Math.max(0,r.t-.075)/.38);
  const x0=r.sx+(240-r.sx)*q,y0=r.sy+(290-r.sy)*q;
  if(r.perfect){
   // Design gold trail v1: intensify at streak>=4; palette #FFE09A #FFD25B #FFF2A5 #C3A4FF
   const hot=perfectStreak>=4, warm=perfectStreak>=2;
   const wob=Math.sin(visualTime*22)* (hot?3.2:warm?2:1.2);
   ctx.lineCap='round';
   // Soft outer ribbon
   ctx.strokeStyle=hot?'#FFE09A66':'#FFE09A55';ctx.shadowColor='#FFD25B';ctx.shadowBlur=hot?32:warm?24:18;
   ctx.lineWidth=hot?16:warm?12:9;
   ctx.beginPath();ctx.moveTo(x0,y0+wob*.4);ctx.quadraticCurveTo((x0+r.x)/2+wob, (y0+r.y)/2-Math.abs(wob), r.x,r.y);ctx.stroke();
   // Core gold
   ctx.strokeStyle=hot?'#FFF2A5ee':'#FFD25Bcc';ctx.shadowBlur=hot?20:14;ctx.lineWidth=hot?10:warm?8:6;
   ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+r.x)/2-wob*.5,(y0+r.y)/2,r.x,r.y);ctx.stroke();
   ctx.shadowBlur=0;
   // Star sparkles along trail
   const sparks=hot?7:warm?5:3;
   for(let i=0;i<sparks;i++){
    const u=(i+1)/(sparks+1),sx=x0+(r.x-x0)*u+Math.sin(visualTime*20+i)*3,sy=y0+(r.y-y0)*u;
    const col=i%3===0?'#C3A4FF':(i%2?'#FFF2A5':'#FFD25B');
    ctx.fillStyle=col;ctx.globalAlpha=.5+Math.sin(visualTime*28+i)*.4;
    const s=hot?3.6:2.4;
    ctx.beginPath();ctx.moveTo(sx,sy-s);ctx.lineTo(sx+s*.35,sy-s*.35);ctx.lineTo(sx+s,sy);ctx.lineTo(sx+s*.35,sy+s*.35);
    ctx.lineTo(sx,sy+s);ctx.lineTo(sx-s*.35,sy+s*.35);ctx.lineTo(sx-s,sy);ctx.lineTo(sx-s*.35,sy-s*.35);ctx.closePath();ctx.fill();
   }
   ctx.globalAlpha=1;
   ball(r.x,r.y,hot?12:warm?10.5:10,hot?'#FFF2A5':'#FFD25B');
  }else{
   ctx.strokeStyle='#d1ffde99';ctx.shadowColor='#ffd25e';ctx.shadowBlur=3;ctx.lineWidth=3;
   ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(r.x,r.y);ctx.stroke();ctx.shadowBlur=0;
   ball(r.x,r.y,9,'#efffec');
  }
 }
 if(game.swingAnim>0){const t=1-game.swingAnim/.21;
 const streak=Math.min(4,perfectStreak);
 ctx.save();ctx.globalAlpha=Math.sin(t*Math.PI);
 // Gold swing ribbon (palette) + dashed afterimages scaled by perfect streak
 ctx.strokeStyle=streak>=4?'#FFD25Bdd':'#FFE09Acc';ctx.shadowColor='#FFD25B';ctx.shadowBlur=streak>=2?16:8;ctx.lineWidth=streak>=4?12:9;
 ctx.beginPath();ctx.arc(z.x,z.y,53,Math.PI*.0,Math.PI*.9);ctx.stroke();
 ctx.shadowBlur=0;ctx.setLineDash([5,6]);ctx.lineWidth=2;
 for(let i=0;i<streak;i++){
  ctx.strokeStyle=i%2?'#FFF2A588':'#C3A4FF66';ctx.globalAlpha=Math.sin(t*Math.PI)*(0.35+i*0.08);
  ctx.beginPath();ctx.arc(z.x,z.y,57+i*3.5,Math.PI*.02,Math.PI*.85);ctx.stroke();
 }
 ctx.setLineDash([]);ctx.restore();
 // The moving bat meets the same point as the timing marker.
 ctx.strokeStyle='#6e431b';ctx.lineWidth=11;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(z.x-42,z.y+28);ctx.lineTo(z.x+Math.cos(t*Math.PI)*35,z.y-Math.sin(t*Math.PI)*15);ctx.stroke();ctx.strokeStyle='#ebc88b';ctx.lineWidth=7;ctx.stroke();
 }
 for(const e of effects){ctx.globalAlpha=Math.min(1,e.t*3);ctx.fillStyle=e.color;ctx.fillRect(e.x,e.y,3,3)}ctx.globalAlpha=1;
 if(pointer){const r=canvas.getBoundingClientRect(),x=(pointer.x-r.left)/r.width*W,y=(pointer.y-r.top)/r.height*H;ctx.strokeStyle='#d0f2dd44';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,25,0,7);ctx.stroke();const l=Math.hypot(aim.x,aim.y)||1;ctx.fillStyle='#deefd766';ctx.beginPath();ctx.arc(x+aim.x/l*Math.min(18,l),y+aim.y/l*Math.min(18,l),8,0,7);ctx.fill()}
 drawFtueGuide();ctx.restore();if(flash>0){ctx.fillStyle='#ff765329';ctx.fillRect(0,0,W,H)}
}
function frame(now){let dt=Math.min(.06,(now-previous)/1000||0);previous=now;visualTime+=dt;if(ftueFade>0)ftueFade=Math.max(0,ftueFade-dt);if(game.state==='playing'){if(ftueActive){ftuePlayTime+=dt;if(ftuePlayTime>=30)dismissFtue()}let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);if(pointer){dx=aim.x;dy=aim.y;if(Math.hypot(dx,dy)<5)dx=dy=0}if(freeze>0)freeze-=dt;else {let remaining=dt;while(remaining>0){const step=Math.min(1/120,remaining);game.update(step,dx,dy);remaining-=step}}processEvents();feedbackTime-=dt;if(feedbackTime<=0)$('#feedback').textContent='';callTime-=dt;if(callTime<=0)$('#pitchcall').textContent='';pitchPoseTime=Math.max(0,pitchPoseTime-dt);bossImpact=Math.max(0,bossImpact-dt);shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt);for(const e of effects){e.x+=e.vx*dt;e.y+=e.vy*dt;e.t-=dt}effects=effects.filter(e=>e.t>0)}draw();requestAnimationFrame(frame)}hud();requestAnimationFrame(frame);
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_baseball_game',description:'Read the current baseball parry match state.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({state:game.state,health:game.hp,bossHealth:game.boss,perfects:game.perfects,combo:game.combo,seconds:Math.floor(game.time)})})).catch(()=>{})}catch{}}

function loadAsset(img,url){return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error(url));img.src=url})}
function loadAssetSoft(img,url){return new Promise(resolve=>{const done=ok=>resolve(!!ok);const finish=async()=>{try{if(img.decode)await img.decode()}catch{}done(img.naturalWidth>0)};if(img.complete&&img.naturalWidth)return finish();img.onload=()=>finish();img.onerror=()=>done(false);img.src=url})}
const coreAssets=[loadAsset(bg,'stadium-friend.png'),loadAsset(pitcher,'friend-stage.png'),loadAsset(batter,'batter-10.png'),loadAsset(new Image(),'storyboard.png')];
const poseAssets=[
 loadAssetSoft(pitchPoses.idle,'assets/pitcher/heedong-idle.png'),
 loadAssetSoft(pitchPoses.windup,'assets/pitcher/heedong-windup.png'),
 loadAssetSoft(pitchPoses.arm_swing,'assets/pitcher/heedong-arm_swing.png'),
 loadAssetSoft(pitchPoses.release,'assets/pitcher/heedong-release.png'),
 loadAssetSoft(pitchPoses.follow,'assets/pitcher/heedong-follow.png'),
 loadAssetSoft(batterPoses.ready,'assets/batter/batter-ready.png'),
 loadAssetSoft(batterPoses.load,'assets/batter/batter-load.png'),
 loadAssetSoft(batterPoses.swing,'assets/batter/batter-swing.png'),
 loadAssetSoft(batterPoses.contact,'assets/batter/batter-contact.png'),
 loadAssetSoft(batterPoses.follow,'assets/batter/batter-follow.png')
];
Promise.all([Promise.all(coreAssets),Promise.all(poseAssets)]).then(([_,flags])=>{
 pitchPosesReady=flags.slice(0,5).filter(Boolean).length;
 batterPosesReady=flags.slice(5).filter(Boolean).length;
 assetsReady=true;$('#start').disabled=false;$('#start').innerHTML='플레이 볼 <span>→</span>';DailyMatch.setAssetsReady(true);playCinematic();
 if(pitchPosesReady<5)console.warn('pitch poses partial',flags.slice(0,5));
 if(batterPosesReady<5)console.warn('batter poses partial',flags.slice(5));
}).catch(()=>{$('#start').disabled=false;$('#start').textContent='다시 불러오기';$('#start').onclick=()=>location.reload();$('#loadnote').textContent='이미지를 불러오지 못했어요. 다시 시도해 주세요.'});
