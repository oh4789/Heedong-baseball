'use strict';
const SharedRanking=(()=>{
 const MOCK_KEY='baseball.leaderboard.mock.v1';
 const NICK_KEY='baseball.nickname';
 let tab='all';
 const dialog=document.createElement('dialog');
 dialog.className='ranking-dialog';
 dialog.innerHTML='<div class="ranking-heading"><h2>친구들과 기록 대결</h2><button type="button" aria-label="랭킹 닫기">닫기</button></div><div class="ranking-tabs" role="tablist" aria-label="랭킹 범위"><button type="button" class="ranking-tab active" data-tab="all" role="tab" aria-selected="true">전체</button><button type="button" class="ranking-tab" data-tab="today" role="tab" aria-selected="false">오늘</button></div><p class="ranking-subcopy">도달 스테이지순 · 동점이면 PERFECT순</p><p class="ranking-topline">등록한 승부별 기록 · TOP 20</p><p class="ranking-note" hidden></p><div class="ranking-content" aria-live="polite"></div><button type="button" class="ranking-refresh">새로고침</button>';
 document.body.append(dialog);
 dialog.querySelector('.ranking-heading button').onclick=()=>dialog.close();
 const note=dialog.querySelector('.ranking-note');
 const subcopy=dialog.querySelector('.ranking-subcopy');
 const topline=dialog.querySelector('.ranking-topline');

 function readMock(){
  try{const raw=JSON.parse(localStorage.getItem(MOCK_KEY)||'[]');return Array.isArray(raw)?raw:[]}catch{return[]}
 }
 function writeMock(entries){
  try{localStorage.setItem(MOCK_KEY,JSON.stringify(entries))}catch{}
 }
 function rankEntries(entries){
  return [...entries]
   .sort((a,b)=>b.stage-a.stage||b.perfects-a.perfects||(a.created||0)-(b.created||0))
   .slice(0,20)
   .map((entry,index)=>({...entry,rank:index+1}));
 }
 function setNote(text){
  if(text){note.hidden=false;note.textContent=text}
  else{note.hidden=true;note.textContent=''}
 }
 function updateChrome(){
  dialog.querySelectorAll('.ranking-tab').forEach(btn=>{
   const on=btn.dataset.tab===tab;
   btn.classList.toggle('active',on);
   btn.setAttribute('aria-selected',String(on));
  });
  if(tab==='today'){
   subcopy.textContent='오늘 시드 기준 · 목표 달성자만';
   topline.textContent='오늘의 승부 클리어 · TOP 20';
  }else{
   subcopy.textContent='도달 스테이지순 · 동점이면 PERFECT순';
   topline.textContent='등록한 승부별 기록 · TOP 20';
  }
 }
 function renderEntries(entries){
  const content=dialog.querySelector('.ranking-content');
  if(!entries.length){
   content.textContent=tab==='today'
    ?'아직 오늘의 기록이 없어요. 한 판 뛰고 이름을 남겨 보세요.'
    :'아직 등록된 기록이 없어요. 첫 기록을 남겨보세요!';
   return;
  }
  const table=document.createElement('table');
  if(tab==='today'){
   const goalKind=(typeof DailyMatch!=='undefined'&&DailyMatch.todayGoal)?DailyMatch.todayGoal().kind:'perfect';
   const third=goalKind==='stage'?'도달':'PERFECT';
   table.innerHTML='<thead><tr><th>순위</th><th>닉네임</th><th>목표</th><th>'+third+'</th></tr></thead>';
   const body=document.createElement('tbody');
   entries.forEach(entry=>{
    const row=document.createElement('tr');
    const thirdVal=goalKind==='stage'?(entry.stage??'-'):(entry.perfects??'-');
    [entry.rank,entry.nickname,entry.goalLabel||'-',thirdVal].forEach(value=>{
     const cell=document.createElement('td');cell.textContent=String(value);row.append(cell);
    });
    body.append(row);
   });
   table.append(body);content.replaceChildren(table);
  }else{
   table.innerHTML='<thead><tr><th>순위</th><th>닉네임</th><th>도달</th><th>PERFECT</th></tr></thead>';
   const body=document.createElement('tbody');
   entries.forEach(entry=>{
    const row=document.createElement('tr');
    [entry.rank,entry.nickname,entry.stage,entry.perfects].forEach(value=>{
     const cell=document.createElement('td');cell.textContent=String(value);row.append(cell);
    });
    body.append(row);
   });
   table.append(body);content.replaceChildren(table);
  }
 }

 async function api(options){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  try{
   const response=await fetch('/api/leaderboard',{...options,signal:controller.signal});
   const text=await response.text();
   let data;
   try{data=text?JSON.parse(text):{}}
   catch{const err=Error('랭킹 서버 응답을 읽지 못했어요.');err.code='bad_json';throw err}
   if(!response.ok){const err=Error(data.error||'랭킹을 불러오지 못했어요.');err.code='http';throw err}
   return data;
  }finally{clearTimeout(timeout)}
 }

 async function loadFromMock(){
  setNote('로컬 모드 · 이 기기 기록만 표시돼요');
  return rankEntries(readMock());
 }

 async function load(){
  const content=dialog.querySelector('.ranking-content');
  content.textContent='기록을 불러오는 중…';
  setNote('');
  updateChrome();
  if(tab==='today'){
   try{
    const entries=(typeof DailyMatch!=='undefined'&&DailyMatch.todayBoard)?DailyMatch.todayBoard():[];
    setNote('로컬 · 오늘 시드 클리어만');
    renderEntries(entries);
   }catch{content.textContent='오늘의 랭킹을 불러오지 못했어요.'}
   return;
  }
  try{
   const data=await api();
   setNote('');
   renderEntries(Array.isArray(data.entries)?data.entries:[]);
  }catch(error){
   if(error.name==='AbortError'){
    content.textContent='연결이 지연되고 있어요. 새로고침해 주세요.';
    return;
   }
   try{renderEntries(await loadFromMock())}
   catch{content.textContent='랭킹을 불러오지 못했어요.'}
  }
 }

 async function submitRecord(snapshot,nickname){
  const payload={...snapshot,nickname};
  try{
   const data=await api({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   return {nickname:data.nickname||nickname,rank:data.rank,source:'api'};
  }catch(error){
   if(error.name==='AbortError')throw error;
   const entries=readMock().filter(entry=>entry.id!==payload.id);
   entries.push({
    id:payload.id,
    nickname,
    stage:Number(payload.stage)||0,
    perfects:Number(payload.perfects)||0,
    created:Date.now()
   });
   writeMock(entries);
   const ranked=rankEntries(entries);
   const mine=ranked.find(entry=>entry.id===payload.id);
   return {nickname,rank:mine?mine.rank:ranked.length,source:'mock'};
  }
 }

 function setTab(next){
  if(next!=='all'&&next!=='today')return;
  tab=next;
  load();
 }
 dialog.querySelectorAll('.ranking-tab').forEach(btn=>{
  btn.onclick=()=>setTab(btn.dataset.tab);
 });

 function open(){if(!dialog.open)dialog.showModal();load()}
 dialog.querySelector('.ranking-refresh').onclick=load;

 function resultHtml(){
  return '<details class="share-record"><summary>랭킹에 이름 남기기 <small>선택</small></summary><form class="ranking-form"><label>닉네임<input name="nickname" maxlength="12" placeholder="1~12자" autocomplete="off" required></label><p>등록하면 닉네임과 이번 승부 기록이 모두에게 공개돼요.</p><div class="ranking-actions"><button type="submit">기록 등록</button><button type="button" class="ranking-skip">건너뛰기</button></div><p class="ranking-status" role="status"></p></form></details><button type="button" class="ranking-open">공용 랭킹 보기</button>';
 }

 function bindResult(panel,score){
  panel.querySelector('.ranking-open').onclick=open;
  const form=panel.querySelector('.ranking-form'),input=form.elements.nickname,status=form.querySelector('.ranking-status');
  try{input.value=localStorage.getItem(NICK_KEY)||''}catch{}
  form.querySelector('.ranking-skip').onclick=()=>panel.querySelector('.share-record').open=false;
  let sending=false,submitted=false;
  const snapshot={id:crypto.randomUUID(),stage:score.stage,perfects:score.perfects};
  form.onsubmit=async event=>{
   event.preventDefault();if(sending||submitted)return;
   const nickname=input.value.trim();if(!nickname){status.textContent='닉네임을 입력해 주세요.';return}
   sending=true;const button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='등록 중…';
   try{
    const data=await submitRecord(snapshot,nickname);
    submitted=true;input.disabled=true;button.textContent='등록 완료';
    if(score.daily&&typeof DailyMatch!=='undefined'&&DailyMatch.recordBoardEntry){
     DailyMatch.recordBoardEntry({id:snapshot.id,nickname,stage:snapshot.stage,perfects:snapshot.perfects});
    }
    status.textContent=data.source==='mock'
     ? data.nickname+' · 현재 '+data.rank+'위 (이 기기에만 저장)'
     : data.nickname+' · 현재 '+data.rank+'위에 등록됐어요!';
    try{localStorage.setItem(NICK_KEY,nickname)}catch{}
   }catch(error){
    status.textContent=error.name==='AbortError'
     ?'응답이 늦어지고 있어요. 다시 등록해도 중복되지 않아요.'
     : (error.message||'등록에 실패했어요. 다시 시도해 주세요.');
   }finally{sending=false;button.disabled=submitted}
  };
 }

 return {open,resultHtml,bindResult};
})();
document.querySelector('#ranking-start').onclick=SharedRanking.open;
