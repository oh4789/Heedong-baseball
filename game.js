'use strict';
const $=s=>document.querySelector(s),canvas=$('#field'),ctx=canvas.getContext('2d'),game=new BaseballGame(),bg=new Image(),pitcher=new Image(),batter=new Image();const pitchPoses={idle:new Image(),windup:new Image(),arm_swing:new Image(),release:new Image(),follow:new Image()};let pitchPosesReady=false;const batterPoses={ready:new Image(),load:new Image(),swing:new Image(),contact:new Image(),follow:new Image()};let batterPosesReady=0;const W=480,H=850;let previous=0,visualTime=0,pointer=null,aim={x:0,y:0},keys={},effects=[],freeze=0,shake=0,feedbackTime=0,callTime=0,flash=0,muted=false,audio=null,pitchPoseTime=0,bossImpact=0,assetsReady=false;
let fireCoachShown=false;
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
function start(mode='new'){if(!assetsReady)return;document.activeElement?.blur();activateAudio();GameMusic.activate();GameMusic.setMuted(muted);GameMusic.startPlay();clearInput();matchRecordStart={...records.data};if(mode!=='continue')fireCoachShown=false;if(mode==='continue')game.continueRun();else game.newRun();records.update(game.stage,game.perfects);effects=[];freeze=shake=flash=pitchPoseTime=bossImpact=0;$('#overlay').classList.add('hidden');say('공이 원에 오면 손을 떼세요','#e1f7d3',2.8);$('#pitchcall').textContent='';previous=performance.now();hud()}
function say(t,c='#ffdda0',duration=.85){$('#feedback').textContent=t;$('#feedback').style.color=c;$('#feedback').style.fontSize=t.length>14?'18px':'30px';feedbackTime=duration}
function burst(x,y,color,n=15){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=45+Math.random()*180;effects.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.3+Math.random()*.3,color})}}
function hud(){$('#bossbar').style.width=Math.max(0,game.boss/game.bossMax*100)+'%';$('#bossvalue').textContent=game.boss+' / '+game.bossMax;$('#stage').textContent='STAGE '+game.stage+' · '+(game.stage===1?'NORMAL':game.stage===2?'HARD':'FEVER');$('#hearts').textContent='♥ '.repeat(game.hp)+'♡ '.repeat(3-game.hp);$('#hearts').setAttribute('aria-label','체력 '+game.hp);$('#clock').textContent=Math.floor(game.time/60)+':'+String(Math.floor(game.time%60)).padStart(2,'0');$('#combo').innerHTML='<b>'+game.combo+'</b> COMBO';$('#pitchcount').textContent=game.pitchCount?game.pitchCount+'번째 투구':'첫 번째 승부';$('#hits').textContent='PERFECT '+game.perfects;$('#ready').textContent=game.cooldown>0?'배트 회수 중':'스윙 준비';$('#cool').style.width=(1-game.cooldown/(game.getSwingCooldown?game.getSwingCooldown():.38))*100+'%'}
function nextUpgradeText(key){const d=BaseballGame.UPGRADE_DATA[key],current=game.meta[key]||0,next=d.levels[current];return next?'다음 Lv.'+next.level+' · '+d.stat+' '+next.value:'최대 레벨 · '+d.stat+' '+d.levels[d.levels.length-1].value}
function end(){clearInput();GameMusic.stop();records.update(game.stage,game.perfects);TitleBook.noteRun({dodges:game.dodges,stage:game.stage,perfects:game.perfects});if(DailyMatch.isActive())DailyMatch.noteRun({stage:game.stage,perfects:game.perfects,won:game.state==='won'});const won=game.state==='won';const choices=won?game.getUpgradeChoices():[];const upgradeHtml=choices.length?'<p class="upgrade-title">강화 하나 선택 · 다음 승부에도 이어집니다</p><div class="upgrade-list">'+choices.map(key=>'<button class="upgrade" data-up="'+key+'"><b>'+BaseballGame.UPGRADE_DATA[key].name+' · Lv.'+(game.meta[key]||0)+'</b><small>'+nextUpgradeText(key)+'</small></button>').join('')+'</div>':'<p class="upgrade-title">모든 강화를 완성했어요!</p><button class="primary" id="continue-max">다음 승부로 →</button>';$('#overlay').classList.remove('hidden');$('#overlay .panel').classList.remove('start-panel');const resultBody=`<div class="story-art ${won?'scene-4':'scene-5'} result-art" role="img" aria-label="${won?'공을 받아친 타자':'쌍둥이의 협공에 놀란 타자'}"></div><span class="eyebrow">${won?'YOU WIN THE DUEL':'STRIKE BACK NEXT TIME'}</span><h1>${won?'희동이를 이겼다!':'다시 도전할까?'}</h1><p class="sub">${won?'다음 승부엔 더 강한 마구가 기다립니다.':'공을 끝까지 보고, 손을 떼보세요.'}</p><div class="result-grid"><div><b>${game.perfects}</b><small>PERFECT</small></div><div><b>${game.bestCombo}</b><small>최대 콤보</small></div><div><b>${Math.floor(game.time)}s</b><small>승부 시간</small></div></div><p class="detail">타격 ${game.hits}회 · 헛스윙 ${game.misses}회<br>랠리 ${game.rallyCount}회 · 불꽃 마구 회피 ${game.dodges}회</p>${recordsHtml(true)}${TitleBook.unlockNoteHtml()}${DailyMatch.resultNoteHtml()}${SharedRanking.resultHtml()}`;const resultCta=won?upgradeHtml:'<button class="primary" id="retry">다시 승부하기 <span>↻</span></button>';$('#overlay .panel').innerHTML=`<div class="panel-body">${resultBody}</div><div class="panel-cta">${resultCta}</div>`;SharedRanking.bindResult($('#overlay .panel'),{stage:game.stage,perfects:game.perfects,daily:DailyMatch.isActive()&&DailyMatch.state.cleared});if(won){document.querySelectorAll('.upgrade').forEach(b=>b.onclick=()=>{if(game.chooseUpgrade(b.dataset.up))start('continue')});if(!choices.length)$('#continue-max').onclick=()=>start('continue')}else $('#retry').onclick=()=>{DailyMatch.beginNormal();start('new')}}
function pause(){if(!$('#cinematic').classList.contains('hidden'))return;if(game.state==='playing'){game.state='paused';clearInput();GameMusic.stop();$('#overlay').classList.remove('hidden');$('#overlay .panel').classList.remove('start-panel');$('#overlay .panel').innerHTML='<div class="panel-body"><span class="eyebrow">TIME OUT</span><h1>잠깐 타임!</h1><p class="detail">다음 공도 받아칠 준비 됐나요?</p></div><div class="panel-cta"><button class="primary" id="resume">승부 계속하기 <span>→</span></button></div>';$('#resume').onclick=()=>{game.state='playing';document.activeElement?.blur();previous=performance.now();GameMusic.activate();GameMusic.setMuted(muted);GameMusic.startPlay();$('#overlay').classList.add('hidden')}}else if(game.state==='paused')$('#resume').click()}
$('#start').onclick=()=>{DailyMatch.beginNormal();start('new')};$('#pause').onclick=pause;$('#cinematic-skip').onclick=finishCinematic;$('#intro-replay').onclick=()=>playCinematic(true);$('#sound').onclick=()=>{muted=!muted;$('#sound').textContent=muted?'×':'♪';$('#sound').setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');$('#sound').setAttribute('aria-pressed',String(!muted));GameMusic.setMuted(muted);if(!muted){activateAudio();GameMusic.activate();if(!$('#cinematic').classList.contains('hidden'))GameMusic.startOpening();else if(game.state==='playing')GameMusic.startPlay()}};
canvas.addEventListener('pointerdown',e=>{if(game.state!=='playing'||pointer)return;e.preventDefault();activateAudio();canvas.setPointerCapture(e.pointerId);pointer={id:e.pointerId,x:e.clientX,y:e.clientY};aim={x:0,y:0}});canvas.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;const sx=W/canvas.clientWidth,sy=H/canvas.clientHeight;aim={x:(e.clientX-pointer.x)*sx,y:(e.clientY-pointer.y)*sy};const l=Math.hypot(aim.x,aim.y);if(l>48){pointer.x=e.clientX-aim.x/l*48/sx;pointer.y=e.clientY-aim.y/l*48/sy}});canvas.addEventListener('pointerup',e=>{if(!pointer||e.pointerId!==pointer.id)return;clearInput();game.swing();processEvents()});function cancel(e){if(pointer?.id===e.pointerId)clearInput()}canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);
addEventListener('keydown',e=>{if(!$('#cinematic').classList.contains('hidden')||e.target?.closest?.('input,textarea,dialog,button'))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.code==='Space'&&!e.repeat){activateAudio();game.swing();processEvents()}if(e.key==='Escape'&&!e.repeat)pause()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>{if(game.state==='playing')pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='playing')pause()});
function processEvents(){for(const e of game.events.splice(0)){sound(e.type);if(e.type==='perfect'){records.update(game.stage,game.perfects);say('PERFECT!','#fff2a5');burst(e.x,e.y,'#ffe491',24);freeze=.045;shake=.12}else if(e.type==='hit'){say('NICE HIT','#b5f3d2');burst(e.x,e.y,'#b5f3d2',12)}else if(e.type==='whiff')say('헛스윙','#b8cccc',.45);else if(e.type==='lastStand'){say('끝까지 버티기! · 체력 1','#a7ffe3',1.3);burst(game.player.x,game.player.y,'#a7ffe3',24)}else if(e.type==='damage'){say('피격!','#ff9a84');flash=.18;shake=.16;burst(e.x,e.y,'#ff997d');}else if(e.type==='windup'){$('#pitchcall').innerHTML='<span>'+({double:'연속 직구 · 두 번 받아치세요',changeFast:'체인지업 → 직구 · 기다렸다 두 번!',slider:'슬라이더 · 휘는 공을 따라가세요'}[e.pattern]||(e.pitch==='fire'?'⚠ 불꽃 마구 · 회피':e.pitch==='slow'?'체인지업 · 기다리세요':'직구 · 받아치세요'))+'</span>';$('#pitchcall').style.color=e.pitch==='fire'?'#ffab88':e.pitch==='slow'?'#a5e7ff':'#f4eacb';callTime=4;if(e.pitch==='fire'&&!fireCoachShown){fireCoachShown=true;say('불꽃 마구! · 치지 말고 옆으로!','#ffab88',2.2)}}else if(e.type==='pitch'){pitchPoseTime=.55}else if(e.type==='twin'){say('희원이의 도움!','#d9b5ff',1.1);burst(240,250,'#d59cff',22)}else if(e.type==='impact'){bossImpact=.2;burst(240,280,e.perfect?'#ffdb82':'#c3efd3',18)}else if(e.type==='rally'){say('RALLY x'+e.count+' · 홈런 찬스!','#ffe38c',1.1);burst(240,280,'#ffb84d',32);freeze=.06;shake=.24}else if(e.type==='reaction'){say(e.line,'#d3e8ff',1.15)}else if(e.type==='fury')say('승부는 지금부터!','#ffd18b',1.2);else if(e.type==='end')end()}hud()}
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
 // Pose frames are crop-ready 941×592 with transparent side letterbox. Fill solid blue first so stadium does not show through.
 const pose=currentPitchPose();
 const frame=pitchPoses[pose];
 if(frame&&frame.naturalWidth){
  ctx.fillStyle='#154796';
  ctx.fillRect(0,116,480,302);
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
 const near=game.balls.some(b=>b.t>=0&&b.type!=='fire'&&((b.x-z.x)/game.getWideReach())**2+((b.y-z.y)/48)**2<=1);
 ctx.fillStyle=near?'#baffb722':'#a6fdda09';ctx.strokeStyle=game.cooldown>0?'#a4ccbf55':near?'#caffac':'#8afdcbbb';ctx.lineWidth=near?3:2;
 ctx.shadowColor='#6bffba';ctx.shadowBlur=near?17:7;
 ctx.beginPath();ctx.ellipse(z.x,z.y,game.getWideReach(),48,0,0,7);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
 ctx.strokeStyle='#c2ffd64a';ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.beginPath();ctx.ellipse(z.x,z.y,game.getPerfectZone().x,game.getPerfectZone().y,0,0,7);ctx.stroke();ctx.setLineDash([]);
 if(game.state==='ready'){ctx.fillStyle='#d1ffde';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText('PARRY',z.x,z.y-57)}
 if(game.windup){ctx.fillStyle=game.windup.type==='fire'?'#ff9c70':'#fff0b9';ctx.globalAlpha=.35+Math.sin(visualTime*20)*.15;ctx.beginPath();ctx.arc(240,290,9+(1-game.windup.t/.65)*9,0,7);ctx.fill();ctx.globalAlpha=1}
 drawBatter();
 for(const b of game.balls){
 if(b.t<0)continue;
 const fire=b.type==='fire',color=fire?'#ffae65':b.twin?'#e4a6ff':b.type==='slider'?'#82ffd0':b.type==='slow'?'#b5e8ff':'#fff4df';
 const r=8+Math.min(1,b.t/b.duration)*5;
 ctx.strokeStyle=fire?'#ff773a65':b.type==='slow'?'#a8d9ff60':'#fff1cc60';ctx.lineWidth=fire?14:4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b.x-(b.tx-240)*.05,b.y-(fire?63:28));ctx.lineTo(b.x,b.y);ctx.stroke();
 if(fire){for(let j=0;j<5;j++){const h=20+j*11;ctx.fillStyle=j%2?'#ffd25b99':'#ff753d88';ctx.beginPath();ctx.arc(b.x+Math.sin(visualTime*21+j)*j*1.4,b.y-h,Math.max(1,7-j),0,7);ctx.fill()}}
 ball(b.x,b.y,r,color,fire);
 if(fire&&b.y>420){ctx.strokeStyle='#ff9574';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x+27,b.y+7);ctx.lineTo(b.x+38,b.y+27);ctx.lineTo(b.x+16,b.y+27);ctx.closePath();ctx.stroke();ctx.fillStyle='#ffd7b9';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText('!',b.x+27,b.y+24)}
 }
 for(const r of game.returns){ctx.strokeStyle=r.perfect?'#ffe69acc':'#d1ffde99';ctx.shadowColor='#ffd25e';ctx.shadowBlur=r.perfect?13:3;ctx.lineWidth=r.perfect?6:3;ctx.beginPath();const q=Math.min(1,Math.max(0,r.t-.075)/.38);ctx.moveTo(r.sx+(240-r.sx)*q,r.sy+(290-r.sy)*q);ctx.lineTo(r.x,r.y);ctx.stroke();ctx.shadowBlur=0;ball(r.x,r.y,9,r.perfect?'#fff0b1':'#efffec')}
 if(game.swingAnim>0){const t=1-game.swingAnim/.21;
 ctx.save();ctx.globalAlpha=Math.sin(t*Math.PI);ctx.strokeStyle='#fff2c4bb';ctx.lineWidth=9;ctx.beginPath();ctx.arc(z.x,z.y,53,Math.PI*.0,Math.PI*.9);ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='#fbe4ad77';ctx.beginPath();ctx.arc(z.x,z.y,61,Math.PI*.05,Math.PI*.8);ctx.stroke();ctx.restore();
 // The moving bat meets the same point as the timing marker.
 ctx.strokeStyle='#6e431b';ctx.lineWidth=11;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(z.x-42,z.y+28);ctx.lineTo(z.x+Math.cos(t*Math.PI)*35,z.y-Math.sin(t*Math.PI)*15);ctx.stroke();ctx.strokeStyle='#ebc88b';ctx.lineWidth=7;ctx.stroke();
 }
 for(const e of effects){ctx.globalAlpha=Math.min(1,e.t*3);ctx.fillStyle=e.color;ctx.fillRect(e.x,e.y,3,3)}ctx.globalAlpha=1;
 if(pointer){const r=canvas.getBoundingClientRect(),x=(pointer.x-r.left)/r.width*W,y=(pointer.y-r.top)/r.height*H;ctx.strokeStyle='#d0f2dd44';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,25,0,7);ctx.stroke();const l=Math.hypot(aim.x,aim.y)||1;ctx.fillStyle='#deefd766';ctx.beginPath();ctx.arc(x+aim.x/l*Math.min(18,l),y+aim.y/l*Math.min(18,l),8,0,7);ctx.fill()}
 ctx.restore();if(flash>0){ctx.fillStyle='#ff765329';ctx.fillRect(0,0,W,H)}
}
function frame(now){let dt=Math.min(.06,(now-previous)/1000||0);previous=now;visualTime+=dt;if(game.state==='playing'){let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);if(pointer){dx=aim.x;dy=aim.y;if(Math.hypot(dx,dy)<5)dx=dy=0}if(freeze>0)freeze-=dt;else {let remaining=dt;while(remaining>0){const step=Math.min(1/120,remaining);game.update(step,dx,dy);remaining-=step}}processEvents();feedbackTime-=dt;if(feedbackTime<=0)$('#feedback').textContent='';callTime-=dt;if(callTime<=0)$('#pitchcall').textContent='';pitchPoseTime=Math.max(0,pitchPoseTime-dt);bossImpact=Math.max(0,bossImpact-dt);shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt);for(const e of effects){e.x+=e.vx*dt;e.y+=e.vy*dt;e.t-=dt}effects=effects.filter(e=>e.t>0)}draw();requestAnimationFrame(frame)}hud();requestAnimationFrame(frame);
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
