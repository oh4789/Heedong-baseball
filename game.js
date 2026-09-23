'use strict';
const $=s=>document.querySelector(s),canvas=$('#field'),ctx=canvas.getContext('2d'),game=new BaseballGame(),bg=new Image(),pitcher=new Image(),batter=new Image();const pitchPoses={idle:new Image(),windup:new Image(),arm_swing:new Image(),release:new Image(),follow:new Image()};let pitchPosesReady=false;const batterPoses={ready:new Image(),load:new Image(),swing:new Image(),contact:new Image(),follow:new Image()};let batterPosesReady=0;const W=480,H=850;let previous=0,visualTime=0,pointer=null,aim={x:0,y:0},keys={},effects=[],cheers=[],freeze=0,shake=0,feedbackTime=0,callTime=0,flash=0,muted=false,audio=null,pitchPoseTime=0,bossImpact=0,assetsReady=false;
let fireCoachShown=false;let perfectStreak=0;let defeatRetryAt=0;
let juiceFx=[],nearMissEdge=0,vulnToastDelay=0;
let camPunch=0,camPunchLife=0;const CAM_PUNCH_LIFE=2/60;
const reduceMotion=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}};
function applyFreeze(sec,shakeAmt=0){
 if(reduceMotion()){flash=Math.max(flash,1/60);return}
 if(sec>0)freeze=Math.max(freeze,sec);
 if(shakeAmt>0)shake=Math.max(shake,shakeAmt);
}
function triggerCamPunch(){
 // Perfect Trauma² cam punch — own channel, independent of BeatWarp/hitstop
 if(reduceMotion())return;
 camPunch=1;camPunchLife=CAM_PUNCH_LIFE;
}
let phaseChunkLast=3,phaseBannerTime=0;
const PHASE_LINES={2:'희동이: 이제 진지하게 간다',3:'희동이: 끝까지 붙어보자'};
const FTUE_KEY='beat-heedong.ftue-hitzone-v1';
const OPT_HOLD_LOCK='beat-heedong.opt-hold-lock';
const OPT_EASY_SIL='beat-heedong.opt-easy-silhouette';
let ftueActive=false,ftueFade=0,ftuePlayTime=0,ftuePitchCount=0;
let gestureOptsReturn=null;
// Ghost bat silhouette guide (hold-lock visual only; judgment untouched)
const ghostBatImg=new Image();
let ghostBatReady=false,ghostBatFade=0,ghostBatSpark=0;
// Above-finger contact/orbit guide (visual only; judgment/hitbox untouched)
let fingerGuideFade=0,fingerGuideClient=null;
const fingerGuideThumb={x:240,y:720};
function getOptFlag(key,def='0'){try{const v=localStorage.getItem(key);return v==='1'||v==='0'?v:def}catch{return def}}
function setOptFlag(key,on){try{localStorage.setItem(key,on?'1':'0')}catch{}}
function holdLockOn(){return getOptFlag(OPT_HOLD_LOCK)==='1'}
function easySilhouetteOn(){return getOptFlag(OPT_EASY_SIL)==='1'}
function ftueGuidePrefOn(){return !ftueSeen()}
function setFtueGuidePref(on){try{if(on)localStorage.removeItem(FTUE_KEY);else localStorage.setItem(FTUE_KEY,'1')}catch{}}
// Heedong taunt pool for damage/whiff reactions (engine emits fixed lines; diversify here)
const HEEDONG_TAUNTS=['벌써 휘둘렀어?','이번 공은 내 거야.','너무 서두르네~','내 마구는 어때?','아직 멀었어!','그게 최선이야?','눈에 불을 켜봐!'];
function pickHeedongTaunt(fallback){
 if(fallback&&(fallback.startsWith('콤보 보호')||fallback==='이제 진짜 던진다!'))return fallback;
 return HEEDONG_TAUNTS[(Math.random()*HEEDONG_TAUNTS.length)|0];
}

let recordStorage;try{recordStorage=window.localStorage}catch{}
const records=new BaseballRecords(recordStorage);let matchRecordStart={...records.data};
function failLineCardHtml(won){
 const dodges=game.dodges|0,perfects=game.perfects|0,misses=game.misses|0,hits=game.hits|0;
 const title=won?'승부 한줄 복기':'실패 한줄 복기';
 let tip='';
 if(misses>perfects+hits/2) tip='조금만 참고 손을 떼보세요';
 else if(dodges===0&&misses>0) tip='공을 끝까지 보고, 손을 떼보세요';
 else if(won) tip='깔끔한 승부였어요!';
 const tipHtml=tip?`<p class="fail-line-tip"><span class="fail-line-tip-icon" aria-hidden="true">💡</span><span>${tip}</span></p>`:'';
 return `<div class="fail-line-card" role="group" aria-label="${title}"><div class="fail-line-head"><span class="fail-line-title">${title}</span><span class="fail-line-mark" aria-hidden="true">✦</span></div><div class="fail-line-stats"><span class="fail-chip fail-chip-fire">불꽃 ${dodges}</span><span class="fail-line-sep" aria-hidden="true">·</span><span class="fail-chip fail-chip-perfect">PERFECT ${perfects}</span><span class="fail-line-sep" aria-hidden="true">·</span><span class="fail-chip fail-chip-miss">Miss ${misses}</span></div>${tipHtml}</div>`;
}
function recordsHtml(showNew=false){
 const d=records.data;
 const stageNew=showNew&&d.stage>matchRecordStart.stage,perfectNew=showNew&&d.perfects>matchRecordStart.perfects;
 return '<div class="personal-records"><div class="record-title">나의 최고 기록'+(stageNew||perfectNew?' · <strong>NEW!</strong>':'')+'</div><div class="record-values"><span>최고 도달 <b>'+d.stage+' 스테이지</b></span><span>한 승부 PERFECT <b>'+d.perfects+'회</b></span></div><p>'+(records.saved?'이 기기·브라우저에 저장됩니다':'저장 불가 · 현재 접속 중에만 유지됩니다')+'</p></div>';
}
$('#personal-records').innerHTML=recordsHtml();
TitleBook.init({getRecords:()=>records.data,say:(t,c,d)=>say(t,c,d)});
DailyMatch.init({start:()=>start('new'),assetsReady:false});
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=canvas.clientWidth*d;canvas.height=canvas.clientHeight*d}addEventListener('resize',resize);resize();
function sound(kind,ev){if(muted||!audio)return;try{const t=audio.currentTime,pitch=ev&&ev.pitch||'fast',fire=pitch==='fire',slow=pitch==='slow',slider=pitch==='slider';
 const tone=(type,freq,dur,gain,freqEnd,delay=0)=>{const o=audio.createOscillator(),g=audio.createGain(),s=t+delay;o.type=type;o.frequency.setValueAtTime(freq,s);if(freqEnd!=null)o.frequency.exponentialRampToValueAtTime(Math.max(40,freqEnd),s+Math.max(.04,dur*.85));g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(gain,s+.01);g.gain.exponentialRampToValueAtTime(.001,s+dur);o.connect(g).connect(audio.destination);o.start(s);o.stop(s+dur+.03)};
 if(kind==='windup'){const base=fire?440:slow?170:slider?260:300,end=fire?760:slow?260:slider?400:500;tone('sine',base,.24,fire?.038:slow?.02:.028,end);if(fire){tone('sawtooth',base*.65,.2,.014,end*.75);/* fire telegraph whoosh/tick — VO channel reserved */tone('sawtooth',520,.07,.02,180,.02);tone('triangle',900,.04,.011,420,.05)}else if(!slow)tone('triangle',base*.85,.18,.012,end*.7)}
 else if(kind==='fakeFireReveal'){/* one-tick fire snap ~0.12s — no full fire windup */tone('sawtooth',520,.12,.022,180);tone('triangle',900,.08,.012,420,.02)}
 else if(kind==='pitch'){const base=fire?400:slow?150:slider?250:230;tone(fire?'square':'triangle',base,.09,fire?.055:slow?.026:.04,base*.35);if(fire){tone('sine',base*1.6,.07,.022,base*.55);tone('sine',210,.06,.016,85,.01);tone('square',640,.032,.012,220,.028)}else if(slider)tone('sine',base*1.2,.08,.016,base*.5)}
 else if(kind==='perfect'){tone('square',880,.13,.07,620);tone('sine',1320,.15,.042,990,.02)}
 else if(kind==='hit'){tone('triangle',420,.1,.048,170);tone('sine',190,.08,.028,85)}
 else if(kind==='whiff'){tone('triangle',130,.15,.036,55);tone('sine',70,.18,.03,40)}
 else if(kind==='damage'){tone('sawtooth',95,.14,.032,48)}
 else if(kind==='impact'){tone('triangle',160,.11,.034,70)}
 else if(kind==='fury'){tone('square',110,.16,.03,75)}
}catch{}}
function activateAudio(){try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume()}catch{}}
function clearInput(){
 if(pointer&&fingerGuideClient)syncFingerGuideThumb();
 pointer=null;aim={x:0,y:0};keys={};fingerGuideClient=null;
}
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

function drawHoldLockAim(){
 if(game.state!=='playing')return;
 const on=holdLockOn();
 if(!on)return; // OFF: no lock UI (keep current controls visual only)
 if(!pointer)return; // show mint guide only while held
 const z=game.zone;
 const x=z.x;
 const yTop=210,yMid=z.y,yBot=Math.min(760,game.player.y+36);
 const mint='#9BFFE6';
 ctx.save();
 // Vertical solid mint guide through batter/zone X
 ctx.strokeStyle=mint;ctx.shadowColor=mint;ctx.shadowBlur=10;ctx.lineWidth=2;ctx.globalAlpha=.92;
 ctx.beginPath();ctx.moveTo(x,yTop);ctx.lineTo(x,yBot);ctx.stroke();
 ctx.shadowBlur=0;
 // Hollow marker circles (top / zone / plate)
 for(const yy of [yTop+8,yMid,yBot-6]){
  ctx.strokeStyle=mint;ctx.lineWidth=2;ctx.globalAlpha=.95;
  ctx.beginPath();ctx.arc(x,yy,5.5,0,7);ctx.stroke();
 }
 // Corner brackets around hit zone
 const hw=game.getWideReach?game.getWideReach()*.55:28, hh=28;
 ctx.strokeStyle=mint;ctx.lineWidth=2.4;ctx.lineCap='square';ctx.globalAlpha=.95;
 const L=10;
 function corner(cx,cy,sx,sy){
  ctx.beginPath();ctx.moveTo(cx+sx*L,cy);ctx.lineTo(cx,cy);ctx.lineTo(cx,cy+sy*L);ctx.stroke();
 }
 corner(x-hw,yMid-hh,1,1);corner(x+hw,yMid-hh,-1,1);corner(x-hw,yMid+hh,1,-1);corner(x+hw,yMid+hh,-1,-1);
 // Lock chip: 조준 고정
 const label='조준 고정';
 ctx.font='bold 13px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
 const tw=ctx.measureText(label).width;
 const cw=tw+46,ch=30,cx=W/2,cy=Math.min(H-92,yBot+28);
 ctx.globalAlpha=.96;ctx.fillStyle=mint;ctx.strokeStyle='#08132966';ctx.lineWidth=1;
 const r=14,x0=cx-cw/2,y0=cy-ch/2;
 ctx.beginPath();
 ctx.moveTo(x0+r,y0);ctx.arcTo(x0+cw,y0,x0+cw,y0+ch,r);ctx.arcTo(x0+cw,y0+ch,x0,y0+ch,r);
 ctx.arcTo(x0,y0+ch,x0,y0,r);ctx.arcTo(x0,y0,x0+cw,y0,r);ctx.closePath();ctx.fill();
 // padlock icon
 ctx.fillStyle='#081329';ctx.strokeStyle='#081329';ctx.lineWidth=1.6;
 const lx=cx-tw/2-14,ly=cy;
 ctx.beginPath();ctx.arc(lx,ly-4,4.2,Math.PI,0);ctx.stroke();
 ctx.fillRect(lx-5,ly-2,10,9);
 ctx.fillStyle='#9BFFE6';ctx.beginPath();ctx.arc(lx,ly+1.5,1.4,0,7);ctx.fill();
 ctx.fillStyle='#081329';ctx.fillText(label,cx+6,cy+0.5);
 ctx.restore();
}
function drawGhostBatProcedural(len){
 // Handle→barrel path; gradient lavender→cyan (asset missing fallback)
 const grd=ctx.createLinearGradient(0,0,len,0);
 grd.addColorStop(0,'#C3A4FF');grd.addColorStop(1,'#A8E8FF');
 ctx.fillStyle=grd;
 ctx.beginPath();
 ctx.moveTo(0,-5);
 ctx.quadraticCurveTo(len*.12,-4.5,len*.35,-5);
 ctx.quadraticCurveTo(len*.55,-14,len*.78,-16);
 ctx.quadraticCurveTo(len*.92,-15,len,-10);
 ctx.quadraticCurveTo(len+2,0,len,10);
 ctx.quadraticCurveTo(len*.92,15,len*.78,16);
 ctx.quadraticCurveTo(len*.55,14,len*.35,5);
 ctx.quadraticCurveTo(len*.12,4.5,0,5);
 ctx.quadraticCurveTo(-6,0,0,-5);
 ctx.closePath();ctx.fill();
 // Soft barrel tip glow (no red/coral)
 ctx.globalAlpha*=.55;ctx.fillStyle='#A8E8FF';
 ctx.beginPath();ctx.ellipse(len*.88,0,10,13,0,0,7);ctx.fill();
}
function drawGhostBat(){
 // Design ghost-bat-silhouette v1: hold-lock aim guide only (not Perfect gold trail)
 if(game.state!=='playing')return;
 const holding=holdLockOn()&&!!pointer;
 const fading=ghostBatFade>0;
 if(!holding&&!fading)return;
 const a=holding?0.4:0.4*ghostBatFade;
 if(a<.02)return;
 const z=game.zone;
 // Anchor: same handle pivot as live swing bat stroke
 const px=z.x-42,py=z.y+28;
 // Ideal hold pose ~ early-mid arc; on release follow swingAnim
 let t=.38;
 if(game.swingAnim>0)t=1-game.swingAnim/.21;
 const tipX=z.x+Math.cos(t*Math.PI)*35,tipY=z.y-Math.sin(t*Math.PI)*15;
 const ang=Math.atan2(tipY-py,tipX-px);
 const len=Math.hypot(tipX-px,tipY-py)+52;
 ctx.save();
 // Dashed ideal trajectory arc (separate from gold trail afterimages)
 ctx.globalAlpha=a*.85;ctx.strokeStyle='#F5E6C8';ctx.lineWidth=1.5;ctx.setLineDash([5,6]);ctx.lineCap='round';
 ctx.beginPath();ctx.arc(z.x,z.y,53,0,Math.PI*.9);ctx.stroke();
 ctx.beginPath();ctx.arc(z.x,z.y,58,Math.PI*.05,Math.PI*.82);ctx.stroke();
 ctx.setLineDash([]);
 // Ghost bat silhouette
 ctx.translate(px,py);ctx.rotate(ang);ctx.globalAlpha=a;
 ctx.shadowColor='#A8E8FF';ctx.shadowBlur=10;
 if(ghostBatReady&&ghostBatImg.naturalWidth){
  const iw=ghostBatImg.naturalWidth,ih=ghostBatImg.naturalHeight;
  const sc=len/iw;
  ctx.drawImage(ghostBatImg,0,-ih*sc/2,iw*sc,ih*sc);
 }else{
  drawGhostBatProcedural(len);
 }
 ctx.shadowBlur=0;ctx.restore();
 // Release: optional cream spark at sweet spot (zone center) — visual only
 if(ghostBatSpark>0){
  const u=Math.min(1,ghostBatSpark/.32);
  const sx=z.x,sy=z.y;
  ctx.save();ctx.translate(sx,sy);ctx.globalAlpha=.55*u;
  ctx.fillStyle='#FFE09A';ctx.shadowColor='#FFE09A';ctx.shadowBlur=14;
  ctx.beginPath();
  for(let i=0;i<8;i++){const th=i*Math.PI/4+visualTime*3,r=i%2?14*u:6*u;ctx.lineTo(Math.cos(th)*r,Math.sin(th)*r)}
  ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;ctx.globalAlpha=.35*u;ctx.fillStyle='#F5E6C8';
  ctx.beginPath();ctx.arc(0,0,3.5*u,0,7);ctx.fill();
  ctx.restore();
 }
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


function phaseChunksFromRatio(r){if(r>2/3)return 3;if(r>1/3)return 2;if(r>0)return 1;return 0}
function showPhaseBanner(n){
 const ban=$('#phase-banner');if(!ban)return;
 $('#phase-banner-title').textContent='PHASE '+n;
 $('#phase-banner-line').textContent=PHASE_LINES[n]||'희동이: …';
 ban.hidden=false;ban.classList.add('show');phaseBannerTime=1.2;
}
function hidePhaseBanner(){
 const ban=$('#phase-banner');if(!ban)return;
 ban.classList.remove('show');ban.hidden=true;phaseBannerTime=0;
}
function updateBossPhaseHud(){
 const bar=$('#bossbar');if(!bar||!bar.classList.contains('boss-phase-bar'))return;
 const ratio=game.bossMax>0?Math.max(0,game.boss/game.bossMax):0;
 const chunks=bar.querySelectorAll('.boss-chunk');
 chunks.forEach((el,i)=>{
  const lo=i/3,hi=(i+1)/3;
  const fill=Math.max(0,Math.min(1,(ratio-lo)/Math.max(1e-6,hi-lo)));
  const fillEl=el.querySelector('i');
  if(fillEl)fillEl.style.width=(fill*100)+'%';
  if(fill<=0)el.classList.add('empty');else el.classList.remove('empty');
 });
 const now=phaseChunksFromRatio(ratio);
 if(now<phaseChunkLast){
  for(let c=phaseChunkLast;c>now;c--){
   const el=chunks[c-1];
   if(el){
    el.classList.add('empty','flash');
    const fillEl=el.querySelector('i');if(fillEl)fillEl.style.width='0%';
    setTimeout(()=>el.classList.remove('flash'),420);
   }
   if(c===3)showPhaseBanner(2);
   else if(c===2)showPhaseBanner(3);
  }
  phaseChunkLast=now;
 }else if(now>phaseChunkLast){
  phaseChunkLast=now;
 }
}


function syncFingerGuideThumb(){
 if(!fingerGuideClient)return;
 const r=canvas.getBoundingClientRect();
 if(!r.width||!r.height)return;
 fingerGuideThumb.x=(fingerGuideClient.x-r.left)/r.width*W;
 fingerGuideThumb.y=(fingerGuideClient.y-r.top)/r.height*H;
}
function drawGuideChip(cx,cy,label,col,a){
 const pad=8;
 ctx.save();
 ctx.font='bold 11px system-ui,sans-serif';
 const tw=ctx.measureText(label).width;
 const cw=tw+30,ch=22,rad=11;
 cx=Math.max(pad+cw/2,Math.min(W-pad-cw/2,cx));
 cy=Math.max(pad+ch/2,Math.min(H-pad-ch/2,cy));
 const x0=cx-cw/2,y0=cy-ch/2;
 ctx.globalAlpha=a*.96;
 ctx.fillStyle='#081329ee';ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.shadowColor=col;ctx.shadowBlur=8;
 ctx.beginPath();
 ctx.moveTo(x0+rad,y0);ctx.arcTo(x0+cw,y0,x0+cw,y0+ch,rad);ctx.arcTo(x0+cw,y0+ch,x0,y0+ch,rad);
 ctx.arcTo(x0,y0+ch,x0,y0,rad);ctx.arcTo(x0,y0,x0+cw,y0,rad);ctx.closePath();
 ctx.fill();ctx.stroke();ctx.shadowBlur=0;
 ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillText(label,cx+5,cy+.5);
 ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=1.3;
 if(label==='접점'){
  ctx.beginPath();ctx.moveTo(x0+9,cy);ctx.lineTo(x0+17,cy);ctx.moveTo(x0+13,cy-4);ctx.lineTo(x0+13,cy+4);ctx.stroke();
 }else{
  ctx.setLineDash([2,2]);ctx.beginPath();ctx.arc(x0+13,cy,4.2,Math.PI*.15,Math.PI*1.55);ctx.stroke();ctx.setLineDash([]);
 }
 ctx.restore();
}
function drawAboveFingerGuide(){
 // Design above-finger-guide v1: mint contact @ zone, gold orbit above thumb — visual only
 if(fingerGuideFade<=0.01)return;
 if(game.state!=='playing'&&!fingerGuideFade)return;
 const a=Math.min(1,fingerGuideFade);
 const z=game.zone;
 const mint='#9BFFE6',gold='#FFE09A';
 // 1) Mint contact ring = predicted bat-ball contact (zone), NOT finger tip
 ctx.save();
 ctx.globalAlpha=a*.95;
 ctx.strokeStyle=mint;ctx.shadowColor=mint;ctx.shadowBlur=12;ctx.lineWidth=2.6;
 const rx=Math.min(34,(game.getWideReach?game.getWideReach():53)*.5),ry=20;
 ctx.beginPath();ctx.ellipse(z.x,z.y,rx,ry,0,0,7);ctx.stroke();
 ctx.shadowBlur=0;ctx.lineWidth=1.6;ctx.globalAlpha=a*.88;
 ctx.beginPath();ctx.moveTo(z.x-9,z.y);ctx.lineTo(z.x+9,z.y);ctx.moveTo(z.x,z.y-9);ctx.lineTo(z.x,z.y+9);ctx.stroke();
 ctx.beginPath();ctx.arc(z.x,z.y,2.2,0,7);ctx.fillStyle=mint;ctx.fill();
 ctx.restore();
 // Above-finger band: 48–80px above thumb tip, 8px screen inset
 const thumb=fingerGuideThumb;
 const lift=64; // mid of 48–80
 let bandX=Math.max(8,Math.min(W-8,thumb.x));
 let bandY=Math.max(8,Math.min(H-8,thumb.y-lift));
 // 2) Gold dashed orbit arc (not fire coral) — predicted path + band flourish
 let srcX=240,srcY=300,found=false;
 let bestD=1e12;
 for(const b of game.balls){
  if(b.t<0||b.resolved||b.type==='fire')continue;
  const d=(b.x-z.x)*(b.x-z.x)+(b.y-z.y)*(b.y-z.y);
  if(d<bestD){bestD=d;srcX=b.x;srcY=b.y;found=true}
 }
 if(!found&&game.windup&&game.windup.type!=='fire'){srcX=240;srcY=290;found=true}
 ctx.save();
 ctx.globalAlpha=a*.9;ctx.strokeStyle=gold;ctx.shadowColor=gold;ctx.shadowBlur=8;ctx.lineWidth=2;ctx.lineCap='round';ctx.setLineDash([6,5]);
 if(found){
  const mx=(srcX+z.x)*.5+((srcX<z.x)?16:-16);
  const my=Math.min(srcY,z.y)-36;
  ctx.beginPath();ctx.moveTo(srcX,srcY);ctx.quadraticCurveTo(mx,my,z.x,z.y);ctx.stroke();
 }
 // Band-local orbit dash (design: placed 48–80px above thumb)
 ctx.lineWidth=1.9;ctx.shadowBlur=6;
 ctx.beginPath();ctx.arc(bandX+6,bandY+4,30,Math.PI*1.05,Math.PI*1.92);ctx.stroke();
 ctx.setLineDash([]);ctx.restore();
 // 3) Chips above finger band
 drawGuideChip(bandX-56,bandY-16,'접점',mint,a);
 drawGuideChip(bandX+58,bandY-10,'궤도',gold,a);
}
function start(mode='new'){if(!assetsReady)return;document.activeElement?.blur();activateAudio();GameMusic.activate();GameMusic.setMuted(muted);GameMusic.startPlay();clearInput();matchRecordStart={...records.data};if(mode!=='continue')fireCoachShown=false;perfectStreak=0;enableFtueIfNeeded(mode);if(mode==='continue')game.continueRun();else game.newRun();records.update(game.stage,game.perfects);effects=[];cheers=[];juiceFx=[];beatWarpQ=[];nearMissEdge=0;vulnToastDelay=0;fingerGuideFade=0;fingerGuideClient=null;freeze=shake=flash=pitchPoseTime=bossImpact=0;camPunch=0;camPunchLife=0;phaseChunkLast=3;hidePhaseBanner();hideFirstFireIntroToast();$('#overlay').classList.add('hidden');say('공이 원에 오면 손을 떼세요','#e1f7d3',2.8);$('#pitchcall').textContent='';previous=performance.now();hud()}
function say(t,c='#ffdda0',duration=.85){$('#feedback').textContent=t;$('#feedback').style.color=c;$('#feedback').style.fontSize=t.length>14?'18px':'30px';feedbackTime=duration}
function burst(x,y,color,n=15){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=45+Math.random()*180;effects.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.3+Math.random()*.3,color})}}
// Director juice helpers (VFX only — judgment/hitboxes untouched)
function spawnRing(x,y,color,life=.45,r0=8,r1=58){juiceFx.push({kind:'ring',x,y,color,t:life,life,r0,r1})}
function spawnFloatText(x,y,text,fill,glow,life=.7,vy=-52){juiceFx.push({kind:'floatText',x,y,text,fill,glow,t:life,life,vy})}
function spawnSmoke(x,y){juiceFx.push({kind:'smoke',x,y,t:.38,life:.38});for(let i=0;i<5;i++){const a=-Math.PI/2+(Math.random()-.5)*1.4,s=20+Math.random()*40;effects.push({x:x+(Math.random()-.5)*10,y:y+(Math.random()-.5)*8,vx:Math.cos(a)*s,vy:Math.sin(a)*s-10,t:.28+Math.random()*.2,color:i%2?'#FF7A6Eaa':'#ff9a8499'})}}
function spawnSunburst(x,y){juiceFx.push({kind:'sunburst',x,y,t:.42,life:.42,spin:Math.random()*Math.PI})}
function spawnFireDodgeJuice(x,y){
 // fire-dodge-juice-v1: 회피! float + coral/gold sparks + mint ring; no heavy hitstop
 const cx=x??(game.zone?.x??240),cy=y??(game.zone?.y??650);
 spawnFloatText(cx,cy-18,'회피!','#FFAB88','#FF5A2A',.7);
 burst(cx,cy,'#FF5A2A',16);burst(cx,cy,'#FFD25B',10);
 spawnRing(cx,cy+10,'#9BFFE6',.55,10,54);
}
function isNearMissWhiff(){
 // VFX-only proximity — does NOT alter swing() candidates
 const z=game.zone,reach=game.getWideReach(),nearR=reach*1.15;
 return game.balls.some(b=>{
  if(b.resolved||b.t<0||b.type==='fire')return false;
  const hit=((b.x-z.x)/reach)**2+((b.y-z.y)/48)**2<=1;
  if(hit)return false;
  if(((b.x-z.x)/nearR)**2+((b.y-z.y)/48)**2<=1)return true;
  return Math.abs(b.y-z.y)<56&&Math.abs(b.x-z.x)<nearR*1.25;
 });
}
function spawnNearMissJuice(){
 // near-miss-flash-v1: coral edge vignette + short 아슬아슬! — no hitstop, no Early/Late chip
 nearMissEdge=.2;
 juiceFx.push({kind:'nearText',x:game.zone.x,y:game.zone.y-36,t:.2,life:.2});
 juiceFx.push({kind:'slash',x:game.zone.x,y:game.zone.y,t:.18,life:.18});
 burst(game.zone.x,game.zone.y,'#FF7A6E',8);burst(game.zone.x,game.zone.y,'#FFAB88',5);
}
function spawnGoodHitJuice(x,y){
 spawnRing(x,y,'#A8E8FF',.4,6,50);
 burst(x,y,'#F5E6C8',12);burst(x,y,'#A8E8FF',7);
}
function spawnPerfectHitJuice(x,y){
 spawnSunburst(x,y);
 burst(x,y,'#C3A4FF',10);
}
// BeatWarping impact juice (VFX/SFX/hitstop only — judgment/hitboxes/bat untouched)
// BEAT_SEC ≈ 0.48s ≈ 125 BPM feel; Perfect snaps ±1 beat, Good weaker ±0.35 beat
const BEAT_SEC=0.48;
let beatWarpQ=[];
function beatWarpOffset(strength){
 if(reduceMotion())return 0;
 const beat=BEAT_SEC;
 const phase=((visualTime%beat)+beat)%beat;
 // snap to nearest beat boundary (0 or beat)
 let off=phase<beat/2?-phase:beat-phase;
 const max=strength==='perfect'?beat:beat*0.35;
 return Math.max(-max,Math.min(max,off));
}
function spawnBeatStinger(x,y,tier){
 // Distinct radial flash / spark ring — gold Perfect, mint Good
 if(tier==='perfect'){
  juiceFx.push({kind:'beatStinger',x,y,t:.38,life:.38,tier:'perfect'});
  juiceFx.push({kind:'beatFlash',x,y,t:.22,life:.22,color:'#FFE09A',r0:10,r1:72});
 }else{
  juiceFx.push({kind:'beatFlash',x,y,t:.2,life:.2,color:'#A8E8FF',r0:6,r1:48});
 }
}
function fireBeatWarpImpact(tier,x,y){
 // One-shot impact stinger only — does NOT warp GameMusic / full stems
 const cx=x??(game.zone?.x??240),cy=y??(game.zone?.y??650);
 if(tier==='perfect'){
  flash=Math.max(flash,reduceMotion()?1/60:.12);
  spawnBeatStinger(cx,cy,'perfect');
  spawnPerfectHitJuice(cx,cy);
  burst(cx,cy,'#FFD25B',22);burst(cx,cy,'#FFE09A',14);burst(cx,cy,'#FFF2A5',8);
  sound('perfect',{x:cx,y:cy});
  applyFreeze(.1,.15);
 }else{
  flash=Math.max(flash,reduceMotion()?1/60:.06);
  spawnBeatStinger(cx,cy,'good');
  spawnGoodHitJuice(cx,cy);
  burst(cx,cy,'#A8E8FF',10);burst(cx,cy,'#b5f3d2',6);
  sound('hit',{x:cx,y:cy});
  applyFreeze(.03,.06);
 }
}
function queueBeatWarpImpact(tier,x,y){
 // Schedule impact juice+sound+freeze together (same applyFreeze channel — no double-freeze pile)
 const strength=tier==='perfect'?'perfect':'good';
 const offset=beatWarpOffset(strength);
 // Positive delay = wait until next beat; negative = already past nearest — fire now (or tiny delay 0)
 const delay=offset>0.008?offset:0;
 if(delay<=0||reduceMotion()){
  fireBeatWarpImpact(tier,x,y);
  return;
 }
 beatWarpQ.push({delay,tier,x,y});
}
function updateBeatWarpQ(dt){
 // Tick with real dt even during freeze so warp lands on beat while world is frozen
 if(!beatWarpQ.length)return;
 for(const q of beatWarpQ)q.delay-=dt;
 const ready=beatWarpQ.filter(q=>q.delay<=0);
 beatWarpQ=beatWarpQ.filter(q=>q.delay>0);
 for(const q of ready)fireBeatWarpImpact(q.tier,q.x,q.y);
}
function updateJuice(dt){
 for(const j of juiceFx){
  if(j.kind==='floatText'){j.y+=(j.vy|| -52)*dt;j.vy=(j.vy||-52)*Math.max(0,1-1.2*dt)}
  j.t-=dt;
 }
 juiceFx=juiceFx.filter(j=>j.t>0);
 if(nearMissEdge>0)nearMissEdge=Math.max(0,nearMissEdge-dt);
}
function drawJuice(){
 for(const j of juiceFx){
  const p=1-j.t/j.life,fade=Math.min(1,j.t*5)*(1-Math.max(0,p-.7)/.3);
  if(j.kind==='ring'){
   const r=j.r0+(j.r1-j.r0)*Math.min(1,p*1.15);
   ctx.save();ctx.globalAlpha=fade*.9;ctx.strokeStyle=j.color;ctx.lineWidth=2.2*(1-p*.55);ctx.shadowColor=j.color;ctx.shadowBlur=10;
   ctx.beginPath();ctx.ellipse(j.x,j.y,r,r*.38,0,0,7);ctx.stroke();ctx.shadowBlur=0;ctx.restore();
  }else if(j.kind==='floatText'){
   ctx.save();ctx.translate(j.x,j.y);ctx.rotate(-.12);ctx.globalAlpha=fade;
   ctx.font='italic 900 34px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.shadowColor=j.glow;ctx.shadowBlur=18;ctx.fillStyle=j.fill;ctx.fillText(j.text,0,0);
   ctx.shadowBlur=8;ctx.strokeStyle=j.glow;ctx.lineWidth=1.5;ctx.strokeText(j.text,0,0);
   ctx.shadowBlur=0;ctx.restore();
  }else if(j.kind==='nearText'){
   const shakeX=Math.sin(visualTime*90)*2.2*(1-p);
   ctx.save();ctx.translate(j.x+shakeX,j.y);ctx.rotate(-.08+shakeX*.01);ctx.globalAlpha=fade;
   ctx.font='italic 900 28px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.shadowColor='#FF5A2A';ctx.shadowBlur=14;ctx.fillStyle='#FFAB88';ctx.fillText('아슬아슬!',0,0);
   ctx.shadowBlur=0;ctx.restore();
  }else if(j.kind==='slash'){
   ctx.save();ctx.globalAlpha=fade*.75;ctx.strokeStyle='#FF7A6E';ctx.lineWidth=3;ctx.lineCap='round';ctx.shadowColor='#FF5A2A';ctx.shadowBlur=12;
   const len=40+p*50;ctx.beginPath();ctx.moveTo(j.x-len*.7,j.y+len*.35);ctx.lineTo(j.x+len*.55,j.y-len*.4);ctx.stroke();
   ctx.shadowBlur=0;ctx.restore();
  }else if(j.kind==='smoke'){
   ctx.save();ctx.globalAlpha=fade*.55;
   for(let i=0;i<4;i++){
    const ang=i*1.7+p,rr=10+i*7+p*16;
    ctx.fillStyle=i%2?'#FF7A6E66':'#c4b8b055';
    ctx.beginPath();ctx.ellipse(j.x+Math.cos(ang)*rr*.3,j.y-p*22-i*4,12+i*3,8+i*2,ang*.2,0,7);ctx.fill();
   }
   ctx.restore();
  }else if(j.kind==='beatFlash'){
   // Soft radial mint/gold flash ring (beatwarp impact channel)
   const r=j.r0+(j.r1-j.r0)*Math.min(1,p*1.2);
   ctx.save();ctx.globalAlpha=fade*.85;ctx.strokeStyle=j.color;ctx.fillStyle=j.color+'33';
   ctx.shadowColor=j.color;ctx.shadowBlur=18;ctx.lineWidth=3.2*(1-p*.5);
   ctx.beginPath();ctx.arc(j.x,j.y,r,0,7);ctx.stroke();
   ctx.globalAlpha=fade*.35;ctx.beginPath();ctx.arc(j.x,j.y,r*.45,0,7);ctx.fill();
   ctx.shadowBlur=0;ctx.restore();
  }else if(j.kind==='beatStinger'){
   // Large gold Perfect spark ring — distinct from sunburst rays
   ctx.save();ctx.translate(j.x,j.y);ctx.rotate(p*.55);ctx.globalAlpha=fade;
   const rays=10;
   for(let i=0;i<rays;i++){
    const a=i/rays*Math.PI*2,len=36+(i%2)*14+p*22;
    const col=i%2===0?'#FFE09A':'#FFD25B';
    ctx.strokeStyle=col;ctx.lineWidth=i%2===0?3.4:2.2;ctx.shadowColor=col;ctx.shadowBlur=14;
    ctx.beginPath();ctx.moveTo(Math.cos(a)*4,Math.sin(a)*4);ctx.lineTo(Math.cos(a)*len,Math.sin(a)*len);ctx.stroke();
   }
   ctx.shadowBlur=22;ctx.fillStyle='#FFE09A';ctx.beginPath();ctx.arc(0,0,10+p*6,0,7);ctx.fill();
   ctx.fillStyle='#FFD25B';ctx.beginPath();ctx.arc(0,0,5+p*2,0,7);ctx.fill();
   ctx.shadowBlur=0;ctx.restore();
  }else if(j.kind==='sunburst'){
   ctx.save();ctx.translate(j.x,j.y);ctx.rotate((j.spin||0)+p*.4);ctx.globalAlpha=fade;
   const rays=14;
   for(let i=0;i<rays;i++){
    const a=i/rays*Math.PI*2,len=28+(i%3)*10+p*18,col=i%3===0?'#C3A4FF':'#FFD25B';
    ctx.strokeStyle=col;ctx.lineWidth=i%3===0?2:2.8;ctx.shadowColor=col;ctx.shadowBlur=10;
    ctx.beginPath();ctx.moveTo(Math.cos(a)*6,Math.sin(a)*6);ctx.lineTo(Math.cos(a)*len,Math.sin(a)*len);ctx.stroke();
   }
   ctx.shadowBlur=16;ctx.fillStyle='#FFE09A';ctx.beginPath();ctx.arc(0,0,8+p*4,0,7);ctx.fill();
   ctx.shadowBlur=0;ctx.restore();
  }
 }
 ctx.globalAlpha=1;ctx.textBaseline='alphabetic';
}
function drawNearMissVignette(){
 if(nearMissEdge<=0)return;
 const a=Math.min(1,nearMissEdge/.2)*.62;
 const g=ctx.createRadialGradient(W/2,H/2,W*.22,W/2,H/2,W*.78);
 g.addColorStop(0,'rgba(255,90,42,0)');g.addColorStop(.55,'rgba(255,90,42,0)');g.addColorStop(1,`rgba(255,90,42,${a})`);
 ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
}
// Local/fake friend cheer FX (design/refs/friend-cheer-fx-v1.md) — canvas particles only, no hitstop.
const CHEER_CREAM='#F7F3E8',CHEER_MINT='#9BFFE6',CHEER_CORAL='#FF986E',CHEER_GOLD='#FFE09A';
function spawnFriendCheer(x,y,{power=1}={}){
 const cx=x??(game.zone?.x??240),cy=y??(game.zone?.y??650);
 const life=.55+power*.08; // ~0.6s
 cheers.push({kind:'clap',x:cx,y:cy,t:life,life,scale:.8+power*.35});
 const sparks=Math.floor(5+power*7);
 for(let i=0;i<sparks;i++){
  const a=Math.random()*Math.PI*2,s=(35+Math.random()*110)*(.55+power*.55);
  cheers.push({kind:'spark',x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-25,t:life*(.55+Math.random()*.45),life,r:1.6+Math.random()*3.2,color:Math.random()>.28?CHEER_MINT:CHEER_CORAL});
 }
 const arcs=power>=.75?3:power>=.4?2:1;
 for(let i=0;i<arcs;i++)cheers.push({kind:'arc',x:cx,y:cy,a0:Math.random()*Math.PI*2,r:14+Math.random()*18,t:life*.85,life,spin:(Math.random()-.5)*5,w:18+Math.random()*22});
 const chips=power>=1?2+(Math.random()>.5?1:0):1;
 for(let i=0;i<chips;i++){
  const ang=-Math.PI/2+(i-(chips-1)/2)*.65+(Math.random()-.5)*.35;
  cheers.push({kind:'chip',x:cx+Math.cos(ang)*16,y:cy+Math.sin(ang)*8,vx:Math.cos(ang)*(18+Math.random()*22),vy:-50-Math.random()*45,t:life,life,rot:(Math.random()-.5)*.5,vr:(Math.random()-.5)*1.4,color:Math.random()>.32?CHEER_GOLD:CHEER_CORAL,text:'좋아!'});
 }
}
function updateCheers(dt){
 for(const c of cheers){
  if(c.vx!=null){c.x+=c.vx*dt;c.y+=c.vy*dt}
  if(c.kind==='spark'){c.vy+=55*dt;c.vx*=Math.max(0,1-1.8*dt)}
  else if(c.kind==='chip'){c.vy+=28*dt;if(c.vr)c.rot+=c.vr*dt}
  else if(c.kind==='arc'){c.a0+=c.spin*dt;c.r+=38*dt}
  c.t-=dt;
 }
 cheers=cheers.filter(c=>c.t>0);
}
function drawCheerHand(flip){
 ctx.save();ctx.scale(flip,1);ctx.fillStyle=CHEER_CREAM;
 ctx.beginPath();ctx.ellipse(0,3,9.5,11.5,0,0,7);ctx.fill();
 for(let i=0;i<4;i++){const fx=-6.5+i*4.2;ctx.beginPath();ctx.ellipse(fx,-9.5,2.1,5.8,0,0,7);ctx.fill()}
 ctx.beginPath();ctx.ellipse(9.5,1,2.8,4.8,.55,0,7);ctx.fill();
 ctx.restore();
}
function drawCheerStar(x,y,r){
 ctx.beginPath();
 for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,rr=i%2?r:r*.32;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}
 ctx.closePath();ctx.fill();
}
function drawCheers(){
 if(!cheers.length)return;
 for(const c of cheers){
  const p=1-c.t/c.life,fade=Math.min(1,c.t*3.2)*(1-Math.max(0,p-.75)/.25);
  if(c.kind==='clap'){
   const pop=.65+Math.sin(Math.min(1,p*3.2)*Math.PI)*.55;
   const scale=c.scale*pop,sep=Math.max(0,12*(1-Math.min(1,p*3.4)));
   ctx.save();ctx.translate(c.x,c.y);ctx.globalAlpha=fade;ctx.scale(scale,scale);
   ctx.strokeStyle=CHEER_CREAM;ctx.lineWidth=2;ctx.lineCap='round';
   for(let i=0;i<6;i++){const a=i*Math.PI/3+p*1.2,r0=16+p*6,r1=26+p*16;ctx.globalAlpha=fade*(1-p*.85);ctx.beginPath();ctx.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);ctx.lineTo(Math.cos(a)*r1,Math.sin(a)*r1);ctx.stroke()}
   ctx.globalAlpha=fade;ctx.save();ctx.translate(-7-sep,0);drawCheerHand(1);ctx.restore();ctx.save();ctx.translate(7+sep,0);drawCheerHand(-1);ctx.restore();
   ctx.restore();
  }else if(c.kind==='spark'){
   ctx.save();ctx.globalAlpha=fade;ctx.fillStyle=c.color;ctx.shadowColor=c.color;ctx.shadowBlur=8;
   drawCheerStar(c.x,c.y,c.r*(.85+Math.sin(p*Math.PI)*.25));
   ctx.shadowBlur=0;ctx.beginPath();ctx.arc(c.x,c.y,Math.max(.6,c.r*.35),0,7);ctx.fill();
   ctx.restore();
  }else if(c.kind==='arc'){
   ctx.save();ctx.globalAlpha=fade*.85;ctx.strokeStyle=CHEER_MINT;ctx.lineWidth=1.6;ctx.lineCap='round';
   ctx.beginPath();ctx.arc(c.x,c.y,c.r,c.a0,c.a0+c.w*(Math.PI/180)*4);ctx.stroke();
   ctx.restore();
  }else if(c.kind==='chip'){
   ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rot||0);ctx.globalAlpha=fade;
   const w=30,h=15;
   ctx.fillStyle=c.color;ctx.strokeStyle='#2A203066';ctx.lineWidth=1.4;
   ctx.beginPath();ctx.moveTo(0,-h);ctx.lineTo(w*.82,-h*.28);ctx.lineTo(w*.52,h);ctx.lineTo(-w*.52,h);ctx.lineTo(-w*.82,-h*.28);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.fillStyle='#2A2030';ctx.font='bold 11px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillText(c.text||'좋아!',0,1);ctx.restore();
  }
 }
 ctx.globalAlpha=1;ctx.textBaseline='alphabetic';
}
function hud(){updateBossPhaseHud();$('#bossvalue').textContent=game.boss+' / '+game.bossMax;$('#stage').textContent='STAGE '+game.stage+' · '+(game.stage===1?'NORMAL':game.stage===2?'HARD':'FEVER');$('#hearts').textContent='♥ '.repeat(game.hp)+'♡ '.repeat(3-game.hp);$('#hearts').setAttribute('aria-label','체력 '+game.hp);$('#clock').textContent=Math.floor(game.time/60)+':'+String(Math.floor(game.time%60)).padStart(2,'0');$('#combo').innerHTML='<b>'+game.combo+'</b> COMBO';$('#pitchcount').textContent=game.pitchCount?game.pitchCount+'번째 투구':'첫 번째 승부';$('#hits').textContent='PERFECT '+game.perfects;$('#ready').textContent=game.cooldown>0?'배트 회수 중':'스윙 준비';$('#cool').style.width=(1-game.cooldown/(game.getSwingCooldown?game.getSwingCooldown():.38))*100+'%'}
function nextUpgradeText(key){const d=BaseballGame.UPGRADE_DATA[key],current=game.meta[key]||0,next=d.levels[current];return next?'다음 Lv.'+next.level+' · '+d.stat+' '+next.value:'최대 레벨 · '+d.stat+' '+d.levels[d.levels.length-1].value}
function showStartMenu(){
 GameMusic.stop();
 clearInput();
 if(game.state==='playing'||game.state==='paused')game.state='ready';
 clearOverlayPanelMode();
 const panel=$('#overlay .panel');
 panel.classList.add('start-panel');
 panel.innerHTML=`<div class="panel-body"><div class="menu-art" role="img" aria-label="희동이 보스 클로즈업"></div><span class="eyebrow">BEAT HEEDONG</span><h1>희동이를 이겨라</h1><button type="button" id="title-chip" class="title-chip" aria-label="칭호 없음 · 도감 열기"><span class="title-chip-text">칭호 없음 · 탭해서 고르기</span><span class="title-chip-chevron" aria-hidden="true">›</span></button><p class="sub">“내 공, 하나라도 제대로 쳐봐.”</p><div class="rules"><p><b>01</b><span>드래그해서 <strong>공 앞에 자리 잡기</strong></span></p><p><b>02</b><span>초록 원에 오면 <strong>손 떼서 스윙</strong></span></p><p><b>03</b><span><strong class="red">불꽃 마구</strong>는 옆으로 피하기</span></p></div><div id="personal-records"></div><div id="daily-match"></div><button type="button" class="ranking-open" id="ranking-start">공용 랭킹 보기</button><button type="button" id="intro-replay" class="intro-replay">오프닝 다시 보기</button><button type="button" class="gesture-opts-open" id="gesture-opts-start">제스처 옵션</button></div><div class="panel-cta"><button class="primary" id="start" disabled>구장 준비 중…</button><p id="loadnote" class="keyboard">PC: 방향키 / WASD 이동 · <kbd>SPACE</kbd> 스윙</p></div>`;
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
 const gstart=$('#gesture-opts-start');
 if(gstart)gstart.onclick=()=>openGestureOptions('start');
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
function inningStopHtml(){
 return `<div class="panel-body inning-stop-body">
  <div class="inning-stop-eyebrow" aria-hidden="true"><span class="inning-stop-rule"></span><span class="inning-stop-mark">⚾</span><span class="inning-stop-label">이닝 종료</span><span class="inning-stop-rule"></span></div>
  <h1 class="inning-stop-q">한 이닝 더 할까?</h1>
  <p class="inning-stop-tag">· INNING BREAK ·</p>
  <div class="inning-stop-cta">
   <button type="button" class="inning-stop-quit" id="inning-quit">그만</button>
   <button type="button" class="inning-stop-more" id="inning-more">한 이닝 더</button>
  </div>
 </div>`;
}
let firstFireIntroToastTimer=0;
function hideFirstFireIntroToast(){
 if(firstFireIntroToastTimer){clearTimeout(firstFireIntroToastTimer);firstFireIntroToastTimer=0}
 const el=$('#first-fire-intro-toast');
 if(!el)return;
 el.classList.remove('show','pop','hold','fade');
 el.hidden=true;
}
function showFirstFireIntroToast(){
 hideFirstFireIntroToast();
 let el=$('#first-fire-intro-toast');
 const host=$('#game');
 if(!el){
  el=document.createElement('div');
  el.id='first-fire-intro-toast';
  el.className='first-fire-intro-toast';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  host.append(el);
 }
 el.innerHTML='<div class="first-fire-intro-toast-card"><span class="first-fire-intro-toast-badge" aria-hidden="true">🔥</span><div class="first-fire-intro-toast-l1">불꽃 마구 등장!</div><div class="first-fire-intro-toast-l2"><span class="first-fire-intro-toast-chev" aria-hidden="true">«</span><span>손가락을 옆으로 밀어 회피</span><span class="first-fire-intro-toast-chev" aria-hidden="true">»</span></div><div class="first-fire-intro-toast-rule" aria-hidden="true"></div><div class="first-fire-intro-toast-l3">이번만 안내</div></div>';
 el.hidden=false;
 el.classList.remove('show','pop','hold','fade');
 void el.offsetWidth;
 el.classList.add('show','pop');
 const reduced=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}})();
 const popMs=reduced?0:150, holdMs=1400, fadeMs=reduced?0:200;
 firstFireIntroToastTimer=setTimeout(()=>{
  el.classList.add('hold');
  firstFireIntroToastTimer=setTimeout(()=>{
   el.classList.remove('pop','hold');
   el.classList.add('fade');
   firstFireIntroToastTimer=setTimeout(()=>{el.hidden=true;el.classList.remove('show','fade');firstFireIntroToastTimer=0},fadeMs);
  },holdMs);
 },popMs);
}
let titleUnlockToastTimer=0;
function hideTitleUnlockToast(){
 if(titleUnlockToastTimer){clearTimeout(titleUnlockToastTimer);titleUnlockToastTimer=0}
 const el=$('#title-unlock-toast');
 if(!el)return;
 el.classList.remove('show','pop','hold','fade');
 el.hidden=true;
}
function showTitleUnlockToast(){
 // Visual only — only when a NEW unlock note exists after end/noteRun
 const list=(typeof TitleBook!=='undefined'&&TitleBook.lastNewUnlocks)||[];
 if(!list.length){hideTitleUnlockToast();return}
 const name=list[0]?.name||'';
 if(!name){hideTitleUnlockToast();return}
 hideTitleUnlockToast();
 let el=$('#title-unlock-toast');
 const host=$('#overlay')||$('#game');
 if(!el){
  el=document.createElement('div');
  el.id='title-unlock-toast';
  el.className='title-unlock-toast';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  host.append(el);
 }
 el.innerHTML='<div class="title-unlock-toast-card"><span class="title-unlock-toast-badge" aria-hidden="true">★</span><div class="title-unlock-toast-l1">칭호 해금!</div><div class="title-unlock-toast-l2"></div><div class="title-unlock-toast-rule" aria-hidden="true"></div><div class="title-unlock-toast-l3">도감에서 확인</div></div>';
 el.querySelector('.title-unlock-toast-l2').textContent=name;
 el.hidden=false;
 el.classList.remove('show','pop','hold','fade');
 void el.offsetWidth;
 el.classList.add('show','pop');
 const reduced=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}})();
 const popMs=reduced?0:120, holdMs=1200, fadeMs=reduced?0:200;
 titleUnlockToastTimer=setTimeout(()=>{
  el.classList.add('hold');
  titleUnlockToastTimer=setTimeout(()=>{
   el.classList.remove('pop','hold');
   el.classList.add('fade');
   titleUnlockToastTimer=setTimeout(()=>{el.hidden=true;el.classList.remove('show','fade');titleUnlockToastTimer=0},fadeMs);
  },holdMs);
 },popMs);
}
function clearOverlayPanelMode(){
 hideTitleUnlockToast();
 const overlay=$('#overlay');
 const panel=$('#overlay .panel');
 overlay.classList.remove('inning-stop-overlay');
 panel.classList.remove('start-panel','inning-stop','gesture-opts');
 panel.onclick=null;
}
function showInningStopModal(){
 clearOverlayPanelMode();
 const overlay=$('#overlay');
 const panel=$('#overlay .panel');
 overlay.classList.add('inning-stop-overlay');
 panel.classList.add('inning-stop');
 panel.innerHTML=inningStopHtml();
 overlay.classList.remove('hidden');
 $('#inning-quit').onclick=()=>{DailyMatch.beginNormal();showStartMenu()};
 $('#inning-more').onclick=()=>showWinResult();
}
function showWinResult(){
 clearOverlayPanelMode();
 const choices=game.getUpgradeChoices();
 const upgradeHtml=choices.length
  ?'<p class="upgrade-title">강화 하나 선택 · 다음 승부에도 이어집니다</p><div class="upgrade-list">'+choices.map(key=>'<button class="upgrade" data-up="'+key+'"><b>'+BaseballGame.UPGRADE_DATA[key].name+' · Lv.'+(game.meta[key]||0)+'</b><small>'+nextUpgradeText(key)+'</small></button>').join('')+'</div>'
  :'<p class="upgrade-title">모든 강화를 완성했어요!</p><button class="primary" id="continue-max">다음 승부로 →</button>';
 const resultBody=`<div class="story-art scene-4 result-art" role="img" aria-label="공을 받아친 타자"></div><span class="eyebrow">YOU WIN THE DUEL</span><h1>희동이를 이겼다!</h1><p class="sub">다음 승부엔 더 강한 마구가 기다립니다.</p><div class="result-grid"><div><b>${game.perfects}</b><small>PERFECT</small></div><div><b>${game.bestCombo}</b><small>최대 콤보</small></div><div><b>${Math.floor(game.time)}s</b><small>승부 시간</small></div></div><p class="detail">타격 ${game.hits}회 · 헛스윙 ${game.misses}회<br>랠리 ${game.rallyCount}회 · 불꽃 마구 회피 ${game.dodges}회</p>${failLineCardHtml(true)}${recordsHtml(true)}${TitleBook.unlockNoteHtml()}${DailyMatch.resultNoteHtml()}${SharedRanking.resultHtml()}`;
 const menuBtn='<button type="button" class="secondary" id="to-menu">시작 화면</button>';
 $('#overlay').classList.remove('hidden');
 $('#overlay .panel').innerHTML=`<div class="panel-body">${resultBody}</div><div class="panel-cta">${upgradeHtml}${menuBtn}</div>`;
 SharedRanking.bindResult($('#overlay .panel'),{stage:game.stage,perfects:game.perfects,daily:DailyMatch.isActive()&&DailyMatch.state.cleared});
 showTitleUnlockToast();
 $('#to-menu').onclick=()=>{DailyMatch.beginNormal();showStartMenu()};
 document.querySelectorAll('.upgrade').forEach(b=>b.onclick=()=>{if(game.chooseUpgrade(b.dataset.up))start('continue')});
 if(!choices.length)$('#continue-max').onclick=()=>start('continue');
}
function showDefeatResult(){
 clearOverlayPanelMode();
 const resultBody=`<div class="story-art scene-5 result-art" role="img" aria-label="쌍둥이의 협공에 놀란 타자"></div><span class="eyebrow">STRIKE BACK NEXT TIME</span><h1>다시 도전할까?</h1><p class="sub">공을 끝까지 보고, 손을 떼보세요.</p><div class="result-grid"><div><b>${game.perfects}</b><small>PERFECT</small></div><div><b>${game.bestCombo}</b><small>최대 콤보</small></div><div><b>${Math.floor(game.time)}s</b><small>승부 시간</small></div></div><p class="detail">타격 ${game.hits}회 · 헛스윙 ${game.misses}회<br>랠리 ${game.rallyCount}회 · 불꽃 마구 회피 ${game.dodges}회</p>${failLineCardHtml(false)}${recordsHtml(true)}${TitleBook.unlockNoteHtml()}${DailyMatch.resultNoteHtml()}${SharedRanking.resultHtml()}`;
 const menuBtn='<button type="button" class="secondary" id="to-menu">시작 화면</button>';
 $('#overlay').classList.remove('hidden');
 const panel=$('#overlay .panel');
 panel.innerHTML=`<div class="panel-body">${resultBody}</div><div class="panel-cta"><button class="primary" id="retry">다시 승부하기 <span>↻</span></button>${menuBtn}</div>`;
 SharedRanking.bindResult(panel,{stage:game.stage,perfects:game.perfects,daily:DailyMatch.isActive()&&DailyMatch.state.cleared});
 showTitleUnlockToast();
 $('#to-menu').onclick=()=>{DailyMatch.beginNormal();showStartMenu()};
 defeatRetryAt=performance.now()+250;
 const onRetry=e=>{if(e){e.preventDefault();e.stopPropagation()}tryDefeatRetry('btn')};
 $('#retry').onclick=onRetry;
 // Tap anywhere on panel/CTA except menu/secondary/upgrade areas
 panel.onclick=e=>{
  const block=e.target.closest('button,a,input,textarea,select,label,summary,form,.upgrade,.share-record');
  if(block&&block.id!=='retry')return;
  tryDefeatRetry('panel');
 };
}
function end(){
 clearInput();
 beatWarpQ=[];
 camPunch=0;camPunchLife=0;
 hideFirstFireIntroToast();
 GameMusic.stop();
 records.update(game.stage,game.perfects);
 TitleBook.noteRun({dodges:game.dodges,stage:game.stage,perfects:game.perfects});
 if(DailyMatch.isActive())DailyMatch.noteRun({stage:game.stage,perfects:game.perfects,won:game.state==='won'});
 // Soft exit: win first shows compact inning-stop CTA (records already committed).
 if(game.state==='won'){spawnFriendCheer(240,190,{power:.7});showInningStopModal();return}
 showDefeatResult();
}
function gestureOptsHtml(){
 const hold=holdLockOn(),ftue=ftueGuidePrefOn(),sil=easySilhouetteOn();
 const row=(id,label,on)=>`<div class="gesture-opt-row"><div class="gesture-opt-label">${label}</div><button type="button" class="gesture-toggle${on?' is-on':''}" id="${id}" role="switch" aria-checked="${on?'true':'false'}" aria-label="${label}"><span class="gesture-toggle-knob" aria-hidden="true"></span><span class="gesture-toggle-text">${on?'ON':'OFF'}</span></button></div>`;
 return `<div class="panel-body gesture-opts-body"><div class="gesture-opts-head"><span class="gesture-opts-icon" aria-hidden="true">☝</span><div><span class="eyebrow">GESTURE OPT</span><h1 class="gesture-opts-title">제스처 옵션</h1></div><button type="button" class="gesture-opts-close" id="gesture-opts-close" aria-label="닫기">×</button></div><div class="gesture-opt-list">${row('opt-hold-lock','홀드 록 (조준 고정)',hold)}${row('opt-ftue-guide','FTUE 손 가이드',ftue)}${row('opt-easy-sil','쉬운 구 실루엣',sil)}</div><p class="gesture-opts-hint">홀드 록 ON: 민트 조준선 · 손 떼면 스윙 · 쉬운 구 실루엣 ON: 민트 아우라·조금 큰 공</p></div><div class="panel-cta"><button type="button" class="primary" id="gesture-opts-done">확인 <span>→</span></button></div>`;
}
function bindGestureOptToggles(){
 const hold=$('#opt-hold-lock'),ftue=$('#opt-ftue-guide'),sil=$('#opt-easy-sil');
 const sync=(btn,on)=>{btn.classList.toggle('is-on',on);btn.setAttribute('aria-checked',on?'true':'false');const t=btn.querySelector('.gesture-toggle-text');if(t)t.textContent=on?'ON':'OFF'};
 if(hold)hold.onclick=()=>{const n=!holdLockOn();setOptFlag(OPT_HOLD_LOCK,n);sync(hold,n)};
 if(ftue)ftue.onclick=()=>{const n=!ftueGuidePrefOn();setFtueGuidePref(n);sync(ftue,n)};
 if(sil)sil.onclick=()=>{const n=!easySilhouetteOn();setOptFlag(OPT_EASY_SIL,n);sync(sil,n)};
}
function closeGestureOptions(){
 const ret=gestureOptsReturn;gestureOptsReturn=null;
 if(ret==='pause'&&(game.state==='paused'||game.state==='playing')){game.state='paused';showPauseMenu();return}
 showStartMenu();
}
function openGestureOptions(from){
 gestureOptsReturn=from||'start';
 if(from==='pause'&&game.state==='playing'){game.state='paused';clearInput();GameMusic.stop()}
 clearOverlayPanelMode();
 const panel=$('#overlay .panel');
 panel.classList.add('gesture-opts');
 panel.innerHTML=gestureOptsHtml();
 $('#overlay').classList.remove('hidden');
 bindGestureOptToggles();
 const done=()=>closeGestureOptions();
 $('#gesture-opts-done').onclick=done;
 $('#gesture-opts-close').onclick=done;
}
function showPauseMenu(){
 clearOverlayPanelMode();
 $('#overlay').classList.remove('hidden');
 $('#overlay .panel').innerHTML='<div class="panel-body"><span class="eyebrow">TIME OUT</span><h1>잠깐 타임!</h1><p class="detail">다음 공도 받아칠 준비 됐나요?</p></div><div class="panel-cta"><button class="primary" id="resume">승부 계속하기 <span>→</span></button><button type="button" class="secondary" id="gesture-opts">제스처 옵션</button><button type="button" class="secondary" id="to-menu">시작 화면</button></div>';
 $('#resume').onclick=()=>{game.state='playing';document.activeElement?.blur();previous=performance.now();GameMusic.activate();GameMusic.setMuted(muted);GameMusic.startPlay();$('#overlay').classList.add('hidden')};
 $('#gesture-opts').onclick=()=>openGestureOptions('pause');
 $('#to-menu').onclick=()=>{DailyMatch.beginNormal();showStartMenu()};
}
function pause(){if(!$('#cinematic').classList.contains('hidden'))return;if($('#overlay .panel')?.classList.contains('gesture-opts')){closeGestureOptions();return}if(game.state==='playing'){game.state='paused';clearInput();GameMusic.stop();showPauseMenu()}else if(game.state==='paused'){const r=$('#resume');if(r)r.click()}}
$('#start').onclick=()=>{DailyMatch.beginNormal();start('new')};$('#pause').onclick=pause;$('#cinematic-skip').onclick=finishCinematic;$('#intro-replay').onclick=()=>playCinematic(true);const _gos=$('#gesture-opts-start');if(_gos)_gos.onclick=()=>openGestureOptions('start');$('#sound').onclick=()=>{muted=!muted;$('#sound').textContent=muted?'×':'♪';$('#sound').setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');$('#sound').setAttribute('aria-pressed',String(!muted));GameMusic.setMuted(muted);if(!muted){activateAudio();GameMusic.activate();if(!$('#cinematic').classList.contains('hidden'))GameMusic.startOpening();else if(game.state==='playing')GameMusic.startPlay()}};
// Touch latency compensate (pointerup only): rewind in-flight balls for hit-test, then restore.
// Keyboard Space keeps lag≈0 (direct game.swing). Does not widen zones or change engine timing.
const TOUCH_LAG_CAP_MS=45;
function ballPosAt(b,t){const q=t/b.duration,sx=b.sx??240,sy=b.sy??290;return{x:sx+(b.tx-sx)*q+(b.curve||0)*Math.sin(Math.PI*Math.min(1,q)),y:sy+(650-sy)*q}}
function rewindBallsForHitTest(lagSec){if(!(lagSec>0))return[];const snaps=[];for(const b of game.balls){if(b.resolved)continue;snaps.push({b,t:b.t,x:b.x,y:b.y});const t=b.t-lagSec;b.t=t;if(t>=0){const p=ballPosAt(b,t);b.x=p.x;b.y=p.y}}return snaps}
function restoreBalls(snaps){for(const s of snaps){s.b.t=s.t;s.b.x=s.x;s.b.y=s.y}}
function swingWithTouchLatency(e){const stamp=typeof e?.timeStamp==='number'?e.timeStamp:performance.now();const lagMs=Math.max(0,Math.min(TOUCH_LAG_CAP_MS,performance.now()-stamp));const snaps=rewindBallsForHitTest(lagMs/1000);try{game.swing()}finally{restoreBalls(snaps)}}
canvas.addEventListener('pointerdown',e=>{if(game.state!=='playing'||pointer)return;e.preventDefault();activateAudio();canvas.setPointerCapture(e.pointerId);pointer={id:e.pointerId,x:e.clientX,y:e.clientY};aim={x:0,y:0};fingerGuideClient={x:e.clientX,y:e.clientY};syncFingerGuideThumb();fingerGuideFade=1});canvas.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;const sx=W/canvas.clientWidth,sy=H/canvas.clientHeight;aim={x:(e.clientX-pointer.x)*sx,y:(e.clientY-pointer.y)*sy};const l=Math.hypot(aim.x,aim.y);if(l>48){pointer.x=e.clientX-aim.x/l*48/sx;pointer.y=e.clientY-aim.y/l*48/sy}fingerGuideClient={x:e.clientX,y:e.clientY};syncFingerGuideThumb();fingerGuideFade=1});canvas.addEventListener('pointerup',e=>{if(!pointer||e.pointerId!==pointer.id)return;const armed=holdLockOn();clearInput();swingWithTouchLatency(e);if(armed&&game.swingAnim>0){ghostBatFade=1;ghostBatSpark=.32}processEvents()});function cancel(e){if(pointer?.id===e.pointerId)clearInput()}canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);
addEventListener('keydown',e=>{if(!$('#cinematic').classList.contains('hidden')||e.target?.closest?.('input,textarea,dialog,button'))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.code==='Space'&&!e.repeat){if(tryDefeatRetry('space'))return;activateAudio();game.swing();processEvents()}if(e.key==='Escape'&&!e.repeat)pause()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>{if(game.state==='playing')pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='playing')pause()});
function processEvents(){for(const e of game.events.splice(0)){// Beatwarp: Perfect/Good impact SFX deferred — judgment/bat remain immediate
 if(e.type!=='perfect'&&e.type!=='hit')sound(e.type,e);if(e.type==='perfect'){dismissFtue();perfectStreak++;records.update(game.stage,game.perfects);say('PERFECT!','#fff2a5');const hx=e.x??game.zone.x,hy=e.y??game.zone.y;const n=perfectStreak>=4?16:perfectStreak>=2?12:8;burst(hx,hy,'#FFD25B',n);if(perfectStreak>=4)burst(hx,hy,'#C3A4FF',4);spawnFriendCheer(hx,hy,{power:1});queueBeatWarpImpact('perfect',hx,hy);triggerCamPunch()}else if(e.type==='hit'){dismissFtue();perfectStreak=0;say('NICE HIT','#b5f3d2');const hx=e.x??game.zone.x,hy=e.y??game.zone.y;burst(hx,hy,'#b5f3d2',6);queueBeatWarpImpact('good',hx,hy)}else if(e.type==='whiff'){perfectStreak=0;const near=isNearMissWhiff();spawnSmoke(game.zone.x,game.zone.y);if(near)spawnNearMissJuice();else say('헛스윙','#b8cccc',.45);/* miss hitstop 0ms */}else if(e.type==='lastStand'){say('끝까지 버티기! · 체력 1','#a7ffe3',1.3);burst(game.player.x,game.player.y,'#a7ffe3',24)}else if(e.type==='damage'){perfectStreak=0;say('피격!','#ff9a84');flash=.18;shake=.16;burst(e.x,e.y,'#ff997d');}else if(e.type==='windup'){const aimBait=e.pattern==='aimLockFire'||e.aimLockFire;const msg=aimBait?'⚠ 고정 조준 · 피하세요':({double:'연속 직구 · 두 번 받아치세요',changeFast:'체인지업 → 직구 · 기다렸다 두 번!',slider:'슬라이더 · 휘는 공을 따라가세요',fakeFire:'직구 · 받아치세요'}[e.pattern]||(e.pitch==='fire'?'⚠ 불꽃 마구 · 회피':e.pitch==='slow'?'체인지업 · 기다리세요':'직구 · 받아치세요'));$('#pitchcall').innerHTML='<span>'+msg+'</span>';$('#pitchcall').style.color=aimBait?'#FFC9A8':e.pitch==='fire'?'#FFC9A8':e.pitch==='slow'?'#a5e7ff':'#f4eacb';callTime=4;if(aimBait){const lx=game.windup?.tx??game.player.x,ly=game.zone?.y??game.player.y-42;spawnRing(lx,ly,'#9BFFE6',.15,6,40);burst(lx,ly,'#9BFFE6',6)}if(e.pitch==='fire'&&!e.fakeFire&&!fireCoachShown){fireCoachShown=true;showFirstFireIntroToast()}}else if(e.type==='fakeFireReveal'){$('#pitchcall').innerHTML='<span>⚠ 불꽃!</span>';$('#pitchcall').style.color='#ffab88';callTime=4;if(!fireCoachShown){fireCoachShown=true;showFirstFireIntroToast()}}else if(e.type==='pitch'){pitchPoseTime=.55;if(ftueActive){ftuePitchCount++;if(ftuePitchCount>=4)dismissFtue()}}else if(e.type==='twin'){say('희원이의 도움!','#d9b5ff',1.1);burst(240,250,'#d59cff',22)}else if(e.type==='impact'){bossImpact=.2;burst(240,280,e.perfect?'#ffdb82':'#c3efd3',18)}else if(e.type==='rally'){say('RALLY x'+e.count+' · 홈런 찬스!','#ffe38c',1.1);burst(240,280,'#ffb84d',32);spawnFriendCheer(240,300,{power:.42});applyFreeze(.06,.24)}else if(e.type==='reaction'){say(pickHeedongTaunt(e.line),'#d3e8ff',1.15)}else if(e.type==='vulnerable'){spawnFireDodgeJuice(game.zone.x,game.zone.y);vulnToastDelay=.75;burst(240,280,'#FFE09A',16);burst(240,290,'#fff8e0',10)}else if(e.type==='fury')say('승부는 지금부터!','#ffd18b',1.2);else if(e.type==='end')end()}hud()}
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
function drawPitchTipping(){
 // Orthogonal windup glove tip (visual only). Cream/leather — never #FF3B3B.
 // Independent of Soft Heat, fakeout mint telegraph, and fire 3-stage lane colors.
 if(!game.windup)return;
 const w=game.windup;
 const dur=w.duration||w.t||1;
 const remain=Math.max(0,w.t)/dur;
 // Fire tip when type==='fire' (real fire from start; fakeFire snaps after reveal)
 const isFire=w.type==='fire';
 const cream='#F5E6C8',leather='#C4A574',accent='#FFD25B';
 ctx.save();
 if(isFire){
  const open=0.35+0.65*remain; // early big → late subtle
  const gx=268,gy=252+8*(1-open);
  const rw=16+14*open,rh=11+7*open;
  ctx.fillStyle=cream;ctx.strokeStyle=leather;ctx.lineWidth=1.6;
  ctx.shadowColor=leather;ctx.shadowBlur=6;
  ctx.beginPath();ctx.ellipse(gx,gy,rw,rh,-.18,0,7);ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;ctx.globalAlpha=.9;
  for(let i=-2;i<=2;i++){
   const a=-.55+i*.28;
   const fx=gx+Math.cos(a-Math.PI/2)*(rw*.55);
   const fy=gy+Math.sin(a-Math.PI/2)*(rh*.85)-3*open;
   ctx.fillStyle=cream;
   ctx.beginPath();ctx.ellipse(fx,fy,3+2.4*open,5+3.2*open,a,0,7);ctx.fill();
   ctx.strokeStyle=leather;ctx.lineWidth=1;ctx.stroke();
  }
  ctx.globalAlpha=.5*open;ctx.fillStyle=accent;
  ctx.beginPath();ctx.arc(gx,gy+2,3.2,0,7);ctx.fill();
 }else{
  // Normal / fakeFire warm-up: tight mitt at belt height
  const gx=262,gy=348;
  ctx.fillStyle=cream;ctx.strokeStyle=leather;ctx.lineWidth=1.5;
  ctx.shadowColor=leather;ctx.shadowBlur=4;
  ctx.beginPath();ctx.ellipse(gx,gy,11,8,.12,0,7);ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;
  ctx.beginPath();ctx.ellipse(gx-1,gy-5,6.5,4.5,.08,0,7);ctx.fill();ctx.stroke();
 }
 ctx.restore();
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
 if(game.vulnerable>0){
  // vulnerable-window-glow-v1: strong white-gold at open → weak gold as it fades (no red)
  const remain=Math.min(1,game.vulnerable/2);
  const strong=remain>0.55; // peak after dodge
  const pulse=.5+.5*Math.sin(visualTime*(strong?10:6));
  const coreA=(strong?.32:.18)*pulse;
  const midA=(strong?.34:.22)*pulse;
  const grd=ctx.createRadialGradient(240,268,10,240,268,strong?92:70);
  grd.addColorStop(0,`rgba(255,255,255,${strong?coreA*.9:coreA*.35})`);
  grd.addColorStop(.25,`rgba(255,248,231,${coreA})`); // #FFF8E7
  grd.addColorStop(.55,`rgba(255,224,154,${midA})`); // #FFE09A
  grd.addColorStop(1,'rgba(255,224,154,0)');
  ctx.fillStyle=grd;ctx.beginPath();ctx.arc(240,268,strong?92:70,0,7);ctx.fill();
  // chest rim light
  ctx.strokeStyle=strong?`rgba(255,255,255,${.5*pulse})`:`rgba(255,224,154,${.45*pulse})`;
  ctx.lineWidth=strong?2.8:2;ctx.shadowColor=strong?'#FFFFFF':'#FFE09A';ctx.shadowBlur=strong?18:12;
  ctx.beginPath();ctx.arc(240,268,(strong?40:34)+pulse*6,0,7);ctx.stroke();
  ctx.shadowBlur=0;
  if(strong){
   ctx.strokeStyle=`rgba(255,248,231,${.4*pulse})`;ctx.lineWidth=1.4;
   ctx.beginPath();ctx.arc(240,268,26+pulse*5,0,7);ctx.stroke();
  }
 }
 if(game.windup)drawPitchTipping();
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

function windupStrengthTier(dur){
 // Display-only length cue from windup duration (judgment untouched).
 if(dur>=1.05)return 'weak';
 if(dur>=0.75)return 'mid';
 return 'strong';
}
function drawWindupStrengthBar(cx,cy,color,tier){
 // Design telegraph-shape-lang v1: 약/중/강 length bars under mound cue
 const fill={weak:.35,mid:.65,strong:.95}[tier]||.65;
 const bw=38,bh=4.5,x=cx-bw/2,y=cy+26;
 ctx.save();
 ctx.globalAlpha=.28;ctx.fillStyle=color;
 ctx.beginPath();ctx.moveTo(x+2,y);ctx.arcTo(x+bw,y,x+bw,y+bh,2);ctx.arcTo(x+bw,y+bh,x,y+bh,2);ctx.arcTo(x,y+bh,x,y,2);ctx.arcTo(x,y,x+bw,y,2);ctx.closePath();ctx.fill();
 ctx.globalAlpha=.88;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=6;
 const fw=Math.max(4,bw*fill);
 ctx.beginPath();ctx.moveTo(x+2,y);ctx.arcTo(x+fw,y,x+fw,y+bh,2);ctx.arcTo(x+fw,y+bh,x,y+bh,2);ctx.arcTo(x,y+bh,x,y,2);ctx.arcTo(x,y,x+fw,y,2);ctx.closePath();ctx.fill();
 ctx.shadowBlur=0;ctx.globalAlpha=.7;ctx.fillStyle=color;ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.textBaseline='top';
 ctx.fillText({weak:'약',mid:'중',strong:'강'}[tier]||'',cx,y+bh+2);
 ctx.restore();
}
function drawTelegraphLane(cx,cy,remain,pulse){
 // LANE · mint vertical corridor + dashed guides (slider)
 const col='#9BFFE6';
 const h=28+(1-remain)*18,w=12+(1-remain)*4;
 ctx.save();
 ctx.strokeStyle=col;ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=10;
 ctx.globalAlpha=.22+pulse*.25;
 ctx.beginPath();
 const x=cx-w/2,y=cy-h/2,r=w/2;
 ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
 ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
 ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
 ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();ctx.fill();
 ctx.globalAlpha=.7+Math.sin(visualTime*14)*.15;ctx.lineWidth=2.2;ctx.stroke();
 ctx.shadowBlur=0;ctx.setLineDash([5,5]);ctx.lineWidth=1.4;ctx.globalAlpha=.55+pulse*.2;
 const guide=18+(1-remain)*6;
 ctx.beginPath();ctx.moveTo(cx-guide,cy-h*.55);ctx.lineTo(cx-guide,cy+h*.55);ctx.stroke();
 ctx.beginPath();ctx.moveTo(cx+guide,cy-h*.55);ctx.lineTo(cx+guide,cy+h*.55);ctx.stroke();
 ctx.setLineDash([]);ctx.restore();
 return col;
}
function drawFakeFireWarmup(cx,cy,remain,pulse){
 // fakeout warm-up: mint lane/telegraph #9BFFE6 @ ~70% strength (not fire)
 const col='#9BFFE6';
 const R=14+(1-remain)*12;
 ctx.save();
 ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=10;
 ctx.globalAlpha=(.45+Math.sin(visualTime*16)*.18)*.7;ctx.lineWidth=3;
 ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
 ctx.shadowBlur=0;ctx.globalAlpha=(.2+pulse*.2)*.7;ctx.fillStyle=col;
 ctx.beginPath();ctx.arc(cx,cy,R*.42,0,7);ctx.fill();
 ctx.restore();
 return col;
}
function drawTelegraphCircle(cx,cy,remain,pulse){
 // CIRCLE · soft coral ring (fast / default non-fire); distinct from fire #FF7A45
 const col='#FF986E';
 const R=14+(1-remain)*12;
 ctx.save();
 ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=12;
 ctx.globalAlpha=.45+Math.sin(visualTime*16)*.18;ctx.lineWidth=3.2;
 ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
 ctx.shadowBlur=0;ctx.globalAlpha=.2+pulse*.2;ctx.fillStyle=col;
 ctx.beginPath();ctx.arc(cx,cy,R*.42,0,7);ctx.fill();
 ctx.restore();
 return col;
}
function drawTelegraphPulse(cx,cy,remain,pulse){
 // PULSE · purple expanding arcs (slow / changeup-like)
 const col='#C3A4FF';
 const base=10+(1-remain)*10;
 ctx.save();
 ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.lineCap='round';
 for(let i=0;i<3;i++){
  const R=base+i*9+Math.sin(visualTime*10+i)*.8;
  const a=.55+pulse*.35-i*.12;
  ctx.globalAlpha=Math.max(.15,a);ctx.lineWidth=2.4-i*.35;
  // Left expanding wave
  ctx.beginPath();ctx.arc(cx,cy,R,Math.PI*.55,Math.PI*1.45);ctx.stroke();
  // Right expanding wave
  ctx.beginPath();ctx.arc(cx,cy,R,-Math.PI*.45,Math.PI*.45);ctx.stroke();
 }
 ctx.shadowBlur=0;ctx.globalAlpha=.5+pulse*.3;ctx.fillStyle=col;
 ctx.beginPath();ctx.arc(cx,cy,4.5,0,7);ctx.fill();
 ctx.restore();
 return col;
}

function draw(){
 ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
 ctx.fillStyle='#102336';ctx.fillRect(0,0,W,H);ctx.save();
 if(shake>0)ctx.translate((Math.random()-.5)*5,(Math.random()-.5)*5);
 if(camPunchLife>0){
  const p=camPunchLife/CAM_PUNCH_LIFE;
  const kick=1+0.045*p;
  ctx.translate(W/2,H/2);ctx.scale(kick,kick);ctx.translate(-W/2,-H/2);
  ctx.translate(0,6*p); // punch toward contact
 }
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
  if(game.windup.fakeFire&&!game.windup.revealed){
   // Warm-up 70%: mint #9BFFE6 (looks like normal fast, NOT fire). No #FF3B3B.
   const cx=240,cy=290;
   const col=drawFakeFireWarmup(cx,cy,remain,pulse);
   drawWindupStrengthBar(cx,cy,col,windupStrengthTier(dur));
   ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.textBaseline='alphabetic';
  }else if(game.windup.type==='fire'){
   // Fire 3-stage path. fakeFire snap uses design channel early #FFAB88 → late #FF986E (flight #FF5A2A on ball).
   // Normal fire keeps peach/coral #FFC9A8 / #FF7A45. No #FF3B3B dodge-only cue.
   const cx=240,cy=290;
   const earlyCol=game.windup.fakeFire?'#FFAB88':'#FFC9A8';
   const lateCol=game.windup.fakeFire?'#FF986E':'#FF7A45';
   // fakeFire reveals at ~30% remaining — keep early peach until ~15% so snap reads #FFAB88
   const earlyCut=game.windup.fakeFire?0.15:0.45;
   if(remain>earlyCut){
    // Early windup: soft peach ring
    const R=15+(1-remain)*8;
    ctx.strokeStyle=earlyCol;ctx.shadowColor=earlyCol;ctx.shadowBlur=10;
    ctx.globalAlpha=.4+Math.sin(visualTime*12)*.15;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
    ctx.shadowBlur=0;ctx.fillStyle=earlyCol+'55';ctx.globalAlpha=pulse*.55;
    ctx.beginPath();ctx.arc(cx,cy,R*.5,0,7);ctx.fill();
   }else{
    // Late windup: thicker ring + warning triangle
    const R=20+(earlyCut-remain)*22;
    ctx.strokeStyle=lateCol;ctx.shadowColor=lateCol;ctx.shadowBlur=14;
    ctx.globalAlpha=.65+Math.sin(visualTime*18)*.2;ctx.lineWidth=4.5;
    ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=lateCol+'44';ctx.globalAlpha=.4+Math.sin(visualTime*16)*.15;
    ctx.beginPath();ctx.arc(cx,cy,R*1.2,0,7);ctx.fill();
    // Warning triangle + core highlight
    const s=14+(earlyCut-remain)*10;
    ctx.globalAlpha=.85+Math.sin(visualTime*22)*.15;
    ctx.fillStyle=lateCol;ctx.beginPath();
    ctx.moveTo(cx,cy-s);ctx.lineTo(cx+s*.9,cy+s*.7);ctx.lineTo(cx-s*.9,cy+s*.7);ctx.closePath();ctx.fill();
    ctx.fillStyle='#FFD25B';ctx.beginPath();
    ctx.moveTo(cx,cy-s*.55);ctx.lineTo(cx+s*.45,cy+s*.35);ctx.lineTo(cx-s*.45,cy+s*.35);ctx.closePath();ctx.fill();
    ctx.fillStyle='#1a1020';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('!',cx,cy+2);
   }
   ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.textBaseline='alphabetic';
  }else{
   // Telegraph shape lang v1 (visual only): slider→LANE, slow→PULSE, fast/default→CIRCLE
   const cx=240,cy=290;
   const wType=game.windup.type||'fast';
   const wPat=game.windup.pattern||'';
   let col='#FF986E';
   if(wType==='slider'||wPat==='slider')col=drawTelegraphLane(cx,cy,remain,pulse);
   else if(wType==='slow'||wPat==='changeFast')col=drawTelegraphPulse(cx,cy,remain,pulse);
   else col=drawTelegraphCircle(cx,cy,remain,pulse);
   drawWindupStrengthBar(cx,cy,col,windupStrengthTier(dur));
   ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.textBaseline='alphabetic';
  }
 }
 drawBatter();
 for(const b of game.balls){
 if(b.t<0)continue;
 const fire=b.type==='fire',easy=easySilhouetteOn();
 let color=fire?'#FF7A45':b.twin?'#e4a6ff':b.type==='slider'?'#82ffd0':b.type==='slow'?'#b5e8ff':'#fff4df';
 if(easy&&!fire)color=b.twin?'#dcc4ff':b.type==='slider'?'#9BFFE6':b.type==='slow'?'#c5f0ff':'#E8FFF6';
 const rBase=8+Math.min(1,b.t/b.duration)*5;
 const r=easy?rBase*1.2:rBase; // visual-only size; hitbox unchanged
 // Motion trail: OFF softens/skips non-fire trail; fire keeps telegraph cue
 if(fire||!easy){
  ctx.strokeStyle=fire?'#FF5A2A66':b.type==='slow'?'#a8d9ff60':'#fff1cc60';ctx.lineWidth=fire?14:4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b.x-(b.tx-240)*.05,b.y-(fire?63:28));ctx.lineTo(b.x,b.y);ctx.stroke();
 }else{
  // Easy silhouette: faint mint whisper trail (no sharp motion blur)
  ctx.strokeStyle='#9BFFE622';ctx.lineWidth=2;ctx.lineCap='round';ctx.globalAlpha=.45;
  ctx.beginPath();ctx.moveTo(b.x-(b.tx-240)*.03,b.y-14);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;
 }
 if(easy){
  // Soft mint #9BFFE6 clarity halo under/around ball (draw-only)
  ctx.save();
  ctx.globalAlpha=.28;ctx.fillStyle='#9BFFE6';ctx.shadowColor='#9BFFE6';ctx.shadowBlur=22;
  ctx.beginPath();ctx.arc(b.x,b.y,r*1.75,0,7);ctx.fill();
  ctx.shadowBlur=12;ctx.globalAlpha=.42;ctx.beginPath();ctx.arc(b.x,b.y,r*1.35,0,7);ctx.fill();
  ctx.restore();
 }
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
 drawGhostBat();
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
 for(const e of effects){ctx.globalAlpha=Math.min(1,e.t*3);ctx.fillStyle=e.color;ctx.fillRect(e.x,e.y,3,3)}ctx.globalAlpha=1;drawJuice();drawCheers();
 if(pointer){const r=canvas.getBoundingClientRect(),x=(pointer.x-r.left)/r.width*W,y=(pointer.y-r.top)/r.height*H;ctx.strokeStyle='#d0f2dd44';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,25,0,7);ctx.stroke();const l=Math.hypot(aim.x,aim.y)||1;ctx.fillStyle='#deefd766';ctx.beginPath();ctx.arc(x+aim.x/l*Math.min(18,l),y+aim.y/l*Math.min(18,l),8,0,7);ctx.fill()}
 drawAboveFingerGuide();drawHoldLockAim();drawFtueGuide();ctx.restore();if(flash>0){ctx.fillStyle='#ff765329';ctx.fillRect(0,0,W,H)}
 if(camPunchLife>0){
  const p=camPunchLife/CAM_PUNCH_LIFE;
  ctx.save();
  ctx.strokeStyle=`rgba(255,224,154,${.55+.4*p})`; // #FFE09A
  ctx.lineWidth=3+2*p;ctx.shadowColor='#FFD25B';ctx.shadowBlur=10+8*p;
  ctx.strokeRect(5,5,W-10,H-10);
  ctx.strokeStyle=`rgba(255,210,91,${.3+.4*p})`; // #FFD25B
  ctx.lineWidth=1.5;ctx.shadowBlur=0;
  ctx.strokeRect(9,9,W-18,H-18);
  ctx.restore();
 }
 drawNearMissVignette();
}
function frame(now){let dt=Math.min(.06,(now-previous)/1000||0);previous=now;visualTime+=dt;if(ftueFade>0)ftueFade=Math.max(0,ftueFade-dt);if(ghostBatFade>0)ghostBatFade=Math.max(0,ghostBatFade-dt/.28);if(ghostBatSpark>0)ghostBatSpark=Math.max(0,ghostBatSpark-dt);if(pointer&&fingerGuideClient){syncFingerGuideThumb();fingerGuideFade=1}else if(fingerGuideFade>0)fingerGuideFade=Math.max(0,fingerGuideFade-dt/.12);if(game.state==='playing'){updateBeatWarpQ(dt);if(ftueActive){ftuePlayTime+=dt;if(ftuePlayTime>=30)dismissFtue()}let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);if(pointer){dx=aim.x;dy=aim.y;if(Math.hypot(dx,dy)<5)dx=dy=0}if(typeof game.setAimBaitSense==='function')game.setAimBaitSense({held:!!pointer,holdLock:holdLockOn(),lockX:game.player.x});if(freeze>0)freeze-=dt;else {let remaining=dt;while(remaining>0){const step=Math.min(1/120,remaining);game.update(step,dx,dy);remaining-=step}}processEvents();feedbackTime-=dt;if(feedbackTime<=0)$('#feedback').textContent='';if(vulnToastDelay>0){vulnToastDelay-=dt;if(vulnToastDelay<=0){vulnToastDelay=0;say('약점 노출! · PERFECT ×1.2','#FFE09A',1.1)}}if(phaseBannerTime>0){phaseBannerTime-=dt;if(phaseBannerTime<=0)hidePhaseBanner()}callTime-=dt;if(callTime<=0)$('#pitchcall').textContent='';pitchPoseTime=Math.max(0,pitchPoseTime-dt);bossImpact=Math.max(0,bossImpact-dt);shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt);if(camPunchLife>0){camPunchLife=Math.max(0,camPunchLife-dt);if(camPunchLife<=0)camPunch=0}for(const e of effects){e.x+=e.vx*dt;e.y+=e.vy*dt;e.t-=dt}effects=effects.filter(e=>e.t>0);updateJuice(dt)}else {if(beatWarpQ.length)updateBeatWarpQ(dt);if(juiceFx.length||nearMissEdge>0)updateJuice(dt)}if(cheers.length)updateCheers(dt);draw();requestAnimationFrame(frame)}hud();requestAnimationFrame(frame);
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
 loadAssetSoft(batterPoses.follow,'assets/batter/batter-follow.png'),
 loadAssetSoft(ghostBatImg,'assets/ghost-bat.png')
];
Promise.all([Promise.all(coreAssets),Promise.all(poseAssets)]).then(([_,flags])=>{
 pitchPosesReady=flags.slice(0,5).filter(Boolean).length;
 batterPosesReady=flags.slice(5,10).filter(Boolean).length;
 ghostBatReady=!!flags[10];
 assetsReady=true;$('#start').disabled=false;$('#start').innerHTML='플레이 볼 <span>→</span>';DailyMatch.setAssetsReady(true);playCinematic();
 if(pitchPosesReady<5)console.warn('pitch poses partial',flags.slice(0,5));
 if(batterPosesReady<5)console.warn('batter poses partial',flags.slice(5,10));
}).catch(()=>{$('#start').disabled=false;$('#start').textContent='다시 불러오기';$('#start').onclick=()=>location.reload();$('#loadnote').textContent='이미지를 불러오지 못했어요. 다시 시도해 주세요.'});
