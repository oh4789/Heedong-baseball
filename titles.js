'use strict';
const TitleBook=(()=>{
 const KEY='beat-heedong.titles.v1';
 const TITLES=[
  {id:'first_perfect',name:'첫 퍼펙트',condition:'첫 PERFECT 1회',done:'달성 · 첫 PERFECT',color:'#FFE09A',check:s=>s.perfects>=1},
  {id:'fire_dodge_5',name:'불꽃 회피왕',condition:'불꽃 마구 5회 회피',done:'달성 · 불꽃 회피 5회',color:'#FF986E',check:s=>s.lifetimeDodges>=5},
  {id:'stage_3',name:'3회 연장전',condition:'스테이지 3 도달',done:'달성 · 스테이지 3',color:'#C3A4FF',check:s=>s.stage>=3},
  {id:'daily_batter',name:'일일 타자',condition:'오늘의 승부 1회 클리어',done:'달성 · 오늘의 승부',color:'#C3A4FF',check:s=>s.dailyClears>=1}
 ];
 let state={unlocked:[],equipped:null,lifetimeDodges:0,dailyClears:0,seen:[]};
 let getRecords=()=>({stage:0,perfects:0});
 let sayFn=null;
 let lastNewUnlocks=[];

 const dialog=document.createElement('dialog');
 dialog.className='ranking-dialog titles-dialog';
 dialog.innerHTML='<div class="ranking-heading"><h2>칭호 도감</h2><button type="button" class="titles-close" aria-label="칭호 도감 닫기">닫기</button></div><p class="titles-sub"></p><div class="titles-grid" role="list"></div>';
 document.body.append(dialog);
 dialog.querySelector('.titles-close').onclick=()=>closeCatalog();
 dialog.addEventListener('close',()=>{refreshChip();refreshHeaderDot()});

 function readState(){
  try{
   const raw=JSON.parse(localStorage.getItem(KEY)||'null');
   if(!raw||typeof raw!=='object')return;
   state.unlocked=Array.isArray(raw.unlocked)?raw.unlocked.filter(id=>TITLES.some(t=>t.id===id)):[];
   state.equipped=TITLES.some(t=>t.id===raw.equipped)?raw.equipped:null;
   state.lifetimeDodges=Number.isSafeInteger(raw.lifetimeDodges)&&raw.lifetimeDodges>=0?raw.lifetimeDodges:0;
   state.dailyClears=Number.isSafeInteger(raw.dailyClears)&&raw.dailyClears>=0?raw.dailyClears:0;
   state.seen=Array.isArray(raw.seen)?raw.seen.filter(id=>TITLES.some(t=>t.id===id)):[];
   if(state.equipped&&!state.unlocked.includes(state.equipped))state.equipped=null;
  }catch{}
 }
 function writeState(){
  try{localStorage.setItem(KEY,JSON.stringify({unlocked:state.unlocked,equipped:state.equipped,lifetimeDodges:state.lifetimeDodges,dailyClears:state.dailyClears,seen:state.seen}))}catch{}
 }
 function snapshot(){
  const r=getRecords()||{};
  return {stage:Number(r.stage)||0,perfects:Number(r.perfects)||0,lifetimeDodges:state.lifetimeDodges,dailyClears:state.dailyClears};
 }
 function evaluate(){
  const snap=snapshot();
  const newly=[];
  for(const t of TITLES){
   if(state.unlocked.includes(t.id))continue;
   if(t.check(snap)){state.unlocked.push(t.id);newly.push(t)}
  }
  if(state.equipped&&!state.unlocked.includes(state.equipped))state.equipped=null;
  writeState();
  lastNewUnlocks=newly;
  return newly;
 }
 function noteRun(run){
  const dodges=Math.max(0,Number(run?.dodges)||0);
  state.lifetimeDodges+=dodges;
  writeState();
  return evaluate();
 }
 function titleById(id){return TITLES.find(t=>t.id===id)||null}
 function hasUnseen(){return state.unlocked.some(id=>!state.seen.includes(id))}
 function markAllSeen(){
  let changed=false;
  for(const id of state.unlocked){
   if(!state.seen.includes(id)){state.seen.push(id);changed=true}
  }
  if(changed)writeState();
 }
 function equip(id){
  if(!state.unlocked.includes(id))return false;
  state.equipped=id;
  writeState();
  refreshChip();
  renderCatalog();
  return true;
 }
 function unequip(){
  state.equipped=null;
  writeState();
  refreshChip();
  renderCatalog();
 }
 function chipLabel(){
  if(state.equipped){
   const t=titleById(state.equipped);
   return t?'장착 중 · 「'+t.name+'」':'칭호 없음 · 탭해서 고르기';
  }
  return '칭호 없음 · 탭해서 고르기';
 }
 function refreshChip(){
  const chip=document.querySelector('#title-chip');
  if(!chip)return;
  const equipped=!!state.equipped;
  chip.classList.toggle('equipped',equipped);
  chip.classList.toggle('has-new',hasUnseen());
  chip.innerHTML='<span class="title-chip-text">'+chipLabel()+'</span><span class="title-chip-chevron" aria-hidden="true">›</span>'+(hasUnseen()?'<i class="title-new-dot" aria-hidden="true"></i>':'');
  chip.setAttribute('aria-label',equipped?'장착 칭호 · 도감 열기':'칭호 없음 · 도감 열기');
 }
 function refreshHeaderDot(){
  const btn=document.querySelector('#titles-open');
  if(!btn)return;
  btn.classList.toggle('has-new',hasUnseen());
  let dot=btn.querySelector('.title-new-dot');
  if(hasUnseen()){
   if(!dot){dot=document.createElement('i');dot.className='title-new-dot';dot.setAttribute('aria-hidden','true');btn.append(dot)}
  }else if(dot)dot.remove();
 }
 function renderCatalog(){
  const sub=dialog.querySelector('.titles-sub');
  const grid=dialog.querySelector('.titles-grid');
  const n=state.unlocked.length,m=TITLES.length;
  sub.textContent='해금 '+n+' / 전체 '+m+' · 장착은 치장만 (효과 없음)';
  grid.replaceChildren();
  for(const t of TITLES){
   const unlocked=state.unlocked.includes(t.id);
   const equipped=state.equipped===t.id;
   const unseen=unlocked&&!state.seen.includes(t.id);
   const card=document.createElement('article');
   card.className='title-card'+(unlocked?' unlocked':' locked')+(equipped?' equipped':'')+(unseen?' is-new':'');
   card.setAttribute('role','listitem');
   card.dataset.id=t.id;
   const icon=document.createElement('span');
   icon.className='title-card-icon';
   icon.style.color=unlocked?t.color:'#7A8FA8';
   icon.textContent=unlocked?(t.id==='fire_dodge_5'?'🔥':t.id==='stage_3'?'③':t.id==='daily_batter'?'📅':'🏆'):'🔒';
   const name=document.createElement('div');
   name.className='title-card-name';
   name.textContent=unlocked?t.name:'???';
   const cond=document.createElement('div');
   cond.className='title-card-cond';
   cond.textContent=unlocked?t.done:t.condition;
   card.append(icon,name,cond);
   if(equipped){
    const badge=document.createElement('span');
    badge.className='title-equipped-badge';
    badge.textContent='장착';
    card.append(badge);
   }
   if(unseen){
    const neo=document.createElement('i');
    neo.className='title-new-dot';
    neo.setAttribute('aria-hidden','true');
    card.append(neo);
   }
   if(unlocked){
    const act=document.createElement('button');
    act.type='button';
    act.className='title-card-action';
    act.textContent=equipped?'해제':'장착';
    act.onclick=e=>{e.stopPropagation();equipped?unequip():equip(t.id)};
    card.append(act);
   }else{
    card.tabIndex=0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label','잠긴 칭호');
    const tip=()=>{if(typeof sayFn==='function')sayFn('아직 잠겨 있어요','#AABED8',1.2)};
    card.onclick=tip;
    card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tip()}};
   }
   grid.append(card);
  }
 }
 function open(){
  evaluate();
  renderCatalog();
  markAllSeen();
  refreshHeaderDot();
  if(!dialog.open)dialog.showModal();
 }
 function closeCatalog(){
  if(dialog.open)dialog.close();
  refreshChip();
  refreshHeaderDot();
 }
 function bindUi(){
  const chip=document.querySelector('#title-chip');
  if(chip)chip.onclick=open;
  const btn=document.querySelector('#titles-open');
  if(btn)btn.onclick=open;
 }
 function init(opts){
  if(opts?.getRecords)getRecords=opts.getRecords;
  if(opts?.say)sayFn=opts.say;
  readState();
  evaluate();
  bindUi();
  refreshChip();
  refreshHeaderDot();
 }
 function noteDailyClear(){
  state.dailyClears=Math.max(0,Number(state.dailyClears)||0)+1;
  writeState();
  return evaluate();
 }
 function unlockNoteHtml(){
  if(!lastNewUnlocks.length)return '';
  const names=lastNewUnlocks.map(t=>'「'+t.name+'」').join(' · ');
  return '<p class="title-unlock-note">칭호 해금! '+names+'</p>';
 }

 return {init,noteRun,noteDailyClear,evaluate,open,equip,unequip,refreshChip,unlockNoteHtml,get state(){return state},TITLES};
})();
if(typeof module!=='undefined')module.exports=TitleBook;
