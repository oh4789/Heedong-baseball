'use strict';
const SharedRanking=(()=>{
 const dialog=document.createElement('dialog');
 dialog.className='ranking-dialog';
 dialog.innerHTML='<div class="ranking-heading"><h2>친구들과 기록 대결</h2><button type="button" aria-label="랭킹 닫기">닫기</button></div><p>도달 스테이지순 · 동점이면 PERFECT순</p><p>등록한 승부별 기록 · TOP 20</p><div class="ranking-content" aria-live="polite"></div><button type="button" class="ranking-refresh">새로고침</button>';
 document.body.append(dialog);
 dialog.querySelector('.ranking-heading button').onclick=()=>dialog.close();
 async function api(options){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  try{const response=await fetch('/api/leaderboard',{...options,signal:controller.signal});const data=await response.json();if(!response.ok)throw Error(data.error||'랭킹을 불러오지 못했어요.');return data}
  finally{clearTimeout(timeout)}
 }
 async function load(){
  const content=dialog.querySelector('.ranking-content');content.textContent='기록을 불러오는 중…';
  try{
   const {entries}=await api();
   if(!entries.length){content.textContent='아직 등록된 기록이 없어요. 첫 기록을 남겨보세요!';return}
   const table=document.createElement('table');
   table.innerHTML='<thead><tr><th>순위</th><th>닉네임</th><th>도달</th><th>PERFECT</th></tr></thead>';
   const body=document.createElement('tbody');
   entries.forEach(entry=>{const row=document.createElement('tr');[entry.rank,entry.nickname,entry.stage,entry.perfects].forEach(value=>{const cell=document.createElement('td');cell.textContent=String(value);row.append(cell)});body.append(row)});
   table.append(body);content.replaceChildren(table);
  }catch(error){content.textContent=error.name==='AbortError'?'연결이 지연되고 있어요. 새로고침해 주세요.':error.message}
 }
 function open(){if(!dialog.open)dialog.showModal();load()}
 dialog.querySelector('.ranking-refresh').onclick=load;
 function resultHtml(){return '<details class="share-record"><summary>랭킹에 이름 남기기 <small>선택</small></summary><form class="ranking-form"><label>닉네임<input name="nickname" maxlength="12" placeholder="1~12자" autocomplete="off" required></label><p>등록하면 닉네임과 이번 승부 기록이 모두에게 공개돼요.</p><div class="ranking-actions"><button type="submit">기록 등록</button><button type="button" class="ranking-skip">건너뛰기</button></div><p class="ranking-status" role="status"></p></form></details><button type="button" class="ranking-open">공용 랭킹 보기</button>'}
 function bindResult(panel,score){
  panel.querySelector('.ranking-open').onclick=open;
  const form=panel.querySelector('.ranking-form'),input=form.elements.nickname,status=form.querySelector('.ranking-status');
  try{input.value=localStorage.getItem('baseball.nickname')||''}catch{}
  form.querySelector('.ranking-skip').onclick=()=>panel.querySelector('.share-record').open=false;
  let sending=false,submitted=false;
  const snapshot={id:crypto.randomUUID(),stage:score.stage,perfects:score.perfects};
  form.onsubmit=async event=>{
   event.preventDefault();if(sending||submitted)return;
   const nickname=input.value.trim();if(!nickname){status.textContent='닉네임을 입력해 주세요.';return}
   sending=true;const button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='등록 중…';
   try{
    const data=await api({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...snapshot,nickname})});
    submitted=true;input.disabled=true;button.textContent='등록 완료';status.textContent=data.nickname+' · 현재 '+data.rank+'위에 등록됐어요!';
    try{localStorage.setItem('baseball.nickname',nickname)}catch{}
   }catch(error){status.textContent=error.name==='AbortError'?'응답이 늦어지고 있어요. 다시 등록해도 중복되지 않아요.':error.message}
   finally{sending=false;button.disabled=submitted}
  };
 }
 return {open,resultHtml,bindResult};
})();
document.querySelector('#ranking-start').onclick=SharedRanking.open;
