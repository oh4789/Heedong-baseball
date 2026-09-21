'use strict';
const UPGRADE_DATA={
 wideBat:{name:'넓은 배트',stat:'타격 범위',levels:[{level:1,value:'60px',reach:1.14},{level:2,value:'68px',reach:1.28},{level:3,value:'75px',reach:1.42},{level:4,value:'83px',reach:1.56},{level:5,value:'90px',reach:1.70}]},
 slugger:{name:'집중 타자',stat:'PERFECT 피해',levels:[{level:1,value:'30',damage:30},{level:2,value:'40',damage:40},{level:3,value:'50',damage:50},{level:4,value:'60',damage:60},{level:5,value:'70',damage:70}]},
 steady:{name:'침착한 타자',stat:'스윙 회수',levels:[{level:1,value:'0.335초',cooldown:.335},{level:2,value:'0.290초',cooldown:.29},{level:3,value:'0.245초',cooldown:.245},{level:4,value:'0.200초',cooldown:.20},{level:5,value:'0.155초',cooldown:.155}]},
 tenacity:{name:'끈질긴 타자',stat:'승부당 헛스윙 콤보 보호',levels:[{value:'1회',charges:1},{value:'2회',charges:2},{value:'3회',charges:3}]},
 homer:{name:'홈런 타자',stat:'랠리 추가 피해',levels:[{value:'+40 (기본 +25 포함)',bonus:40},{value:'+55 (기본 +25 포함)',bonus:55},{value:'+70 (기본 +25 포함)',bonus:70}]},
 vision:{name:'선구안',stat:'PERFECT 판정 반경',levels:[{value:'+15%',scale:1.15},{value:'+30%',scale:1.3},{value:'+45%',scale:1.45}]},
 survivor:{name:'끝까지 버티기',stat:'승부당 치명적인 피격 방어',levels:[{value:'1회 · 체력 1 유지',charges:1}]}
};
for(const data of Object.values(UPGRADE_DATA))data.levels.forEach((row,i)=>row.level=i+1);
class BaseballGame {
 constructor(random=Math.random){this.random=random;this.meta={};this.reset();this.state='ready'}
 reset(){this.state='playing';this.player={x:240,y:650};this.hp=3;this.stage=this.stage||1;this.bossMax=135+35*(this.stage-1);this.boss=this.bossMax;this.balls=[];this.returns=[];this.time=0;this.cooldown=0;this.swingAnim=0;this.inv=0;this.combo=0;this.bestCombo=0;this.perfects=0;this.hits=0;this.misses=0;this.dodges=0;this.pitchCount=0;this.nextPitch=1.6;this.windup=null;this.events=[];this.fury=false;this.rallyReady=false;this.rallyCount=0;this.lastPitchReaction='';this.offers=null;this.comboGuards=this.upgradeValue('tenacity','charges',0);this.lastStands=this.upgradeValue('survivor','charges',0);this.vulnerable=0}
 emit(type,data={}){this.events.push({type,...data})}
 get zone(){return {x:this.player.x,y:this.player.y-42}}
 move(dx,dy,dt){const l=Math.hypot(dx,dy);if(!l)return;this.player.x=Math.max(80,Math.min(420,this.player.x+dx/l*245*dt));this.player.y=Math.max(565,Math.min(670,this.player.y+dy/l*245*dt))}
 prepare(){
 this.pitchCount++;const n=this.pitchCount;
 const pool=this.stage>=2?['double','changeFast','slider','fireTwin','twin','fast','slow']:['double','changeFast','slider','fast','slow','fire'];
 const pattern=n<=4?['fast','slow','fast','fire'][n-1]:pool[Math.floor(this.random()*pool.length)];
 const type={double:'fast',changeFast:'slow',fireTwin:'fire',twin:'fast'}[pattern]||pattern;
 const early=n<=4;
 const windupT=early?(type==='fire'?1.25:1.05):(this.fury?.65:.8);
 const aimSpan=early?120:40;
 this.windup={pattern,type,t:windupT,duration:windupT,early,tx:Math.max(85,Math.min(395,this.player.x+(this.random()-.5)*aimSpan))};
 this.emit('windup',{pitch:type,pattern});
 }
 throwBall(){
 const w=this.windup,scale=Math.max(.68,1-(this.stage-1)*.08)*(w.early?1.15:1),duration=type=>(type==='slow'?2:type==='slider'?1.65:1.32)*scale;
 const add=(type,delay=0,twin=false)=>{
 const sx=twin?300:240,sy=twin?245:290;
 this.balls.push({type,x:sx,y:sy,sx,sy,tx:w.tx,t:-delay,duration:duration(type),resolved:false,twin,announced:delay===0,curve:type==='slider'?(this.random()<.5?-85:85):0});
 return delay+duration(type)*1.4;
 };
 let finish=add(w.type);
 const pattern=w.pattern||w.type;
 if(pattern==='double')finish=Math.max(finish,add('fast',.6));
 if(pattern==='changeFast')finish=Math.max(finish,add('fast',(duration('slow')-duration('fast'))*.95+.65));
 if(pattern==='twin')finish=Math.max(finish,add('fast',.65,true));
 if(pattern==='fireTwin')finish=Math.max(finish,add('fast',.9,true));
 this.windup=null;this.nextPitch=finish+(this.fury?.2:.5);this.emit('pitch',{pitch:w.type});
 }
 upgradeValue(key,field,base){const rows=UPGRADE_DATA[key].levels,level=Math.min(rows.length,this.meta[key]||0);return level?rows[level-1][field]:base}
 getPerfectZone(){const scale=this.upgradeValue('vision','scale',1);return {x:34*scale,y:19*scale}}
 getUpgradeChoices(){
 if(this.state!=='won')return [];
 if(this.offers===null){const pool=Object.keys(UPGRADE_DATA).filter(k=>(this.meta[k]||0)<UPGRADE_DATA[k].levels.length);
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 this.offers=pool.slice(0,3)}
 return [...this.offers];
 }
 chooseUpgrade(key){if(this.state!=='won'||!this.getUpgradeChoices().includes(key)||(this.meta[key]||0)>=UPGRADE_DATA[key].levels.length)return false;this.meta[key]=(this.meta[key]||0)+1;this.offers=[];return true}
 getSwingCooldown(){const l=Math.min(UPGRADE_DATA.steady.levels.length,this.meta.steady||0);return l?UPGRADE_DATA.steady.levels[l-1].cooldown:.38}
getWideReach(){const l=Math.min(UPGRADE_DATA.wideBat.levels.length,this.meta.wideBat||0);return 53*(l?UPGRADE_DATA.wideBat.levels[l-1].reach:1)}
getPerfectDamage(){const l=Math.min(UPGRADE_DATA.slugger.levels.length,this.meta.slugger||0);return l?UPGRADE_DATA.slugger.levels[l-1].damage:20}
swing(){if(this.state!=='playing'||this.cooldown>0)return false;this.cooldown=this.getSwingCooldown();this.swingAnim=.21;const z=this.zone;const reach=this.getWideReach();const candidates=this.balls.filter(b=>!b.resolved&&b.t>=0&&b.type!=='fire'&&((b.x-z.x)/reach)**2+((b.y-z.y)/48)**2<=1).sort((a,b)=>Math.abs(a.y-z.y)-Math.abs(b.y-z.y));const ball=candidates[0];if(ball){ball.resolved=true;const perfectZone=this.getPerfectZone();const perfect=((ball.x-z.x)/perfectZone.x)**2+((ball.y-z.y)/perfectZone.y)**2<=1;this.hits++;this.combo++;this.bestCombo=Math.max(this.bestCombo,this.combo);if(perfect)this.perfects++;let rally=false;let damage=perfect?(this.meta.slugger?this.getPerfectDamage():20):10;if(perfect&&this.vulnerable>0)damage*=1.2;if(this.combo>=3&&!this.rallyReady){this.rallyCount++;this.rallyReady=true;rally=true;damage+=this.upgradeValue('homer','bonus',25);this.emit('rally',{count:this.combo,damage});this.combo=0;}this.returns.push({x:ball.x,y:ball.y,sx:ball.x,sy:ball.y,t:0,damage,perfect,rally});this.emit(perfect?'perfect':'hit',{x:ball.x,y:ball.y,combo:this.combo})}else{const guarded=this.combo>0&&this.comboGuards>0;if(guarded)this.comboGuards--;else this.combo=0;this.misses++;this.emit('whiff');this.emit('reaction',{line:guarded?'콤보 보호! · 남은 '+this.comboGuards+'회':'벌써 휘둘렀어?'})}return true}
 update(dt,dx=0,dy=0){if(this.state!=='playing')return;this.time+=dt;this.cooldown=Math.max(0,this.cooldown-dt);this.swingAnim=Math.max(0,this.swingAnim-dt);this.inv=Math.max(0,this.inv-dt);this.vulnerable=Math.max(0,this.vulnerable-dt);this.move(dx,dy,dt);if(this.windup){this.windup.t-=dt;if(this.windup.t<=0)this.throwBall()}else{this.nextPitch-=dt;if(this.nextPitch<=0)this.prepare()}
 for(const b of this.balls){if(b.resolved)continue;b.t+=dt;if(b.t<0)continue;if(b.announced===false){b.announced=true;this.emit(b.twin?'twin':'pitch',{pitch:b.type})}const q=b.t/b.duration,sx=b.sx??240,sy=b.sy??290;b.x=sx+(b.tx-sx)*q+(b.curve||0)*Math.sin(Math.PI*Math.min(1,q));b.y=sy+(650-sy)*q;if(Math.hypot(b.x-this.player.x,b.y-this.player.y)<21){b.resolved=true;this.combo=0;this.emit('reaction',{line:'이번 공은 내 거야.'});if(this.inv<=0){this.inv=1.4;if(this.hp===1&&this.lastStands>0){this.lastStands--;this.emit('lastStand')}else{this.hp--;this.emit('damage',{x:this.player.x,y:this.player.y})}if(this.hp<=0){this.state='lost';this.emit('end');break}}}else if(b.y>785){b.resolved=true;if(b.type==='fire'){this.dodges++;this.vulnerable=2;this.emit('vulnerable',{t:2})}else this.combo=0}}
 this.balls=this.balls.filter(b=>!b.resolved);if(this.state!=='playing')return;for(const r of this.returns){r.t+=dt;const q=Math.min(1,r.t/.38);r.x=r.sx+(240-r.sx)*q;r.y=r.sy+(290-r.sy)*q;if(q>=1){this.boss=Math.max(0,this.boss-r.damage);this.emit('impact',{damage:r.damage,perfect:r.perfect});if(this.vulnerable>0)this.vulnerable=0;if(r.rally)this.rallyReady=false;r.done=true;if(this.boss<=0){this.state='won';this.emit('end');break}}}this.returns=this.returns.filter(r=>!r.done);if(this.boss<=this.bossMax*.5&&!this.fury&&this.state==='playing'){this.fury=true;this.emit('fury');this.emit('reaction',{line:'이제 진짜 던진다!'})}}
newRun(){this.meta={};this.stage=1;this.reset()}
continueRun(){this.stage++;this.reset()}
}
BaseballGame.UPGRADE_DATA=UPGRADE_DATA;
if(typeof module!=='undefined')module.exports=BaseballGame;
