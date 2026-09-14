'use strict';
const DailyMatch=(()=>{
 const DAY_KEY='beat-heedong.daily.v1';
 const BOARD_KEY='beat-heedong.daily-board.v1';
 const GOALS=[
  {id:'perfect_3',kind:'perfect',target:3,label:'PERFECT 3회'},
  {id:'perfect_5',kind:'perfect',target:5,label:'PERFECT 5회'},
  {id:'stage_2',kind:'stage',target:2,label:'스테이지 2 도달'},
  {id:'stage_3',kind:'stage',target:3,label:'스테이지 3 도달'}
 ];
 let dayState={day:'',cleared:false,bestPerfects:0,bestStage:0,runs:0};
 let activeDaily=false;
 let sessionPerfects=0;
 let lastResultNote='';
 let startFn=null;
 let assetsReady=false;
 let testToday=null;

 function todayKST(){
  if(testToday)return testToday;
  try{
   return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  }catch{
   const d=new Date(Date.now()+9*60*60*1000);
   return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0');
  }
 }
 function seedHash(str){
  let h=2166136261>>>0;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
 }
 function goalForDay(day){
  const i=seedHash(day+'|beat-heedong-daily')%GOALS.length;
  return GOALS[i];
 }
 function seedLabel(day){
  const parts=day.split('-');
  if(parts.length===3)return parts[1]+'.'+parts[2];
  return day;
 }
 function readDay(){
  const today=todayKST();
  try{
   const raw=JSON.parse(localStorage.getItem(DAY_KEY)||'null');
   if(raw&&typeof raw==='object'&&raw.day===today){
    dayState={
     day:today,
     cleared:!!raw.cleared,
     bestPerfects:Math.max(0,Number(raw.bestPerfects)||0),
     bestStage:Math.max(0,Number(raw.bestStage)||0),
     runs:Math.max(0,Number(raw.runs)||0)
    };
    return dayState;
   }
  }catch{}
  dayState={day:today,cleared:false,bestPerfects:0,bestStage:0,runs:0};
  writeDay();
  return dayState;
 }
 function writeDay(){
  try{localStorage.setItem(DAY_KEY,JSON.stringify(dayState))}catch{}
 }
 function readBoard(){
  try{
   const raw=JSON.parse(localStorage.getItem(BOARD_KEY)||'[]');
   return Array.isArray(raw)?raw:[];
  }catch{return []}
 }
 function writeBoard(entries){
  try{localStorage.setItem(BOARD_KEY,JSON.stringify(entries.slice(-50)))}catch{}
 }
 function todayBoard(){
  const today=todayKST();
  const goal=goalForDay(today);
  return readBoard()
   .filter(e=>e&&e.day===today)
   .sort((a,b)=>{
    if(goal.kind==='perfect')return (b.perfects||0)-(a.perfects||0)||(b.stage||0)-(a.stage||0)||(a.created||0)-(b.created||0);
    return (b.stage||0)-(a.stage||0)||(b.perfects||0)-(a.perfects||0)||(a.created||0)-(b.created||0);
   })
   .slice(0,20)
   .map((e,i)=>({...e,rank:i+1,goalLabel:e.goalLabel||goal.label}));
 }
 function meetsGoal(goal,stats){
  if(goal.kind==='perfect')return (Number(stats.perfects)||0)>=goal.target;
  return (Number(stats.stage)||0)>=goal.target;
 }
 function shortfallNote(goal,stats){
  if(goal.kind==='perfect'){
   const need=Math.max(0,goal.target-(Number(stats.perfects)||0));
   return '오늘의 목표까지 PERFECT '+need+'회 부족';
  }
  const need=Math.max(0,goal.target-(Number(stats.stage)||0));
  return '오늘의 목표까지 스테이지 '+need+' 부족';
 }
 function ensureHost(){
  let host=document.querySelector('#daily-match');
  if(!host){
   const records=document.querySelector('#personal-records');
   const ranking=document.querySelector('#ranking-start');
   if(records&&ranking){
    host=document.createElement('div');
    host.id='daily-match';
    ranking.parentNode.insertBefore(host,ranking);
   }
  }
  return host;
 }
 function startDailyPlay(){
  activeDaily=true;
  sessionPerfects=0;
  lastResultNote='';
 }
 function renderCard(){
  const host=ensureHost();
  if(!host)return;
  readDay();
  const today=dayState.day;
  const goal=goalForDay(today);
  const cleared=dayState.cleared;
  host.innerHTML=
   '<article class="daily-card" aria-label="오늘의 승부">'+
    '<div class="daily-card-head"><span class="daily-eyebrow">TODAY\'S MATCH</span><span class="daily-seed">시드 · '+seedLabel(today)+'</span></div>'+
    '<h3 class="daily-title">오늘의 승부</h3>'+
    '<p class="daily-goal">목표 · '+goal.label+'</p>'+
    '<span class="daily-reward">보상 · 「일일 타자」 칭호</span>'+
    '<button type="button" class="daily-play'+(cleared?' cleared':'')+'" '+(cleared||!assetsReady?'disabled':'')+'>'+(cleared?'오늘 클리어 ✓':(assetsReady?'오늘 한 판':'구장 준비 중…'))+'</button>'+
    '<p class="daily-help">매일 자정(KST) 시드 갱신 · 랭킹 「오늘」에 기록</p>'+
   '</article>';
  const btn=host.querySelector('.daily-play');
  if(btn&&!cleared){
   btn.onclick=()=>{
    if(!assetsReady||typeof startFn!=='function')return;
    startDailyPlay();
    startFn();
   };
  }
 }
 function setAssetsReady(ready){
  assetsReady=!!ready;
  renderCard();
 }
 function beginNormal(){
  activeDaily=false;
  lastResultNote='';
  sessionPerfects=0;
 }
 function isActive(){return activeDaily}
 function todayGoal(){return goalForDay(readDay().day)}
 function noteRun(stats){
  if(!activeDaily){lastResultNote='';return null}
  readDay();
  const goal=goalForDay(dayState.day);
  const segmentPerfects=Math.max(0,Number(stats?.perfects)||0);
  const stage=Math.max(0,Number(stats?.stage)||0);
  sessionPerfects+=segmentPerfects;
  const perfects=sessionPerfects;
  dayState.runs+=1;
  dayState.bestPerfects=Math.max(dayState.bestPerfects,perfects);
  dayState.bestStage=Math.max(dayState.bestStage,stage);
  const clearedNow=meetsGoal(goal,{perfects,stage});
  let newlyCleared=false;
  if(clearedNow&&!dayState.cleared){
   dayState.cleared=true;
   newlyCleared=true;
   if(typeof TitleBook!=='undefined'&&TitleBook.noteDailyClear)TitleBook.noteDailyClear();
  }
  writeDay();
  if(clearedNow)lastResultNote='오늘의 승부 클리어! · 칭호 해금';
  else lastResultNote=shortfallNote(goal,{perfects,stage});
  renderCard();
  return {cleared:clearedNow,newlyCleared,goal,lastResultNote,sessionPerfects:perfects};
 }
 function resultNoteHtml(){
  if(!activeDaily||!lastResultNote)return '';
  const ok=lastResultNote.indexOf('클리어')>=0;
  return '<p class="daily-result-note'+(ok?' ok':' fail')+'">'+lastResultNote+'</p>';
 }
 function recordBoardEntry(entry){
  readDay();
  if(!dayState.cleared)return false;
  const today=dayState.day;
  const goal=goalForDay(today);
  const nickname=String(entry?.nickname||'').trim().slice(0,12);
  if(!nickname)return false;
  const row={
   id:entry.id||(typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():String(Date.now())),
   nickname,
   day:today,
   goalLabel:goal.label,
   perfects:Math.max(0,Number(entry.perfects)||0),
   stage:Math.max(0,Number(entry.stage)||0),
   created:Date.now()
  };
  const board=readBoard().filter(e=>!(e.id===row.id&&e.day===today));
  board.push(row);
  writeBoard(board);
  return true;
 }
 function init(opts){
  if(opts?.start)startFn=opts.start;
  if(opts?.assetsReady!=null)assetsReady=!!opts.assetsReady;
  readDay();
  renderCard();
 }
 return {
  init,renderCard,setAssetsReady,beginNormal,isActive,todayGoal,todayKST,
  noteRun,resultNoteHtml,todayBoard,recordBoardEntry,goalForDay,
  startDailyPlay,
  get state(){return dayState},
  get sessionPerfects(){return sessionPerfects},
  __setTestToday(day){testToday=day||null},
  GOALS
 };
})();
if(typeof module!=='undefined')module.exports=DailyMatch;
