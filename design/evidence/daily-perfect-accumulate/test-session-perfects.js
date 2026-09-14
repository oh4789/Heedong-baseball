'use strict';
/**
 * Pure Node unit test: DailyMatch session PERFECT accumulation across continue segments.
 * Run: node design/evidence/daily-perfect-accumulate/test-session-perfects.js
 */
const path=require('path');
const fs=require('fs');
const assert=(cond,msg)=>{if(!cond)throw new Error(msg||'assert failed')};

const store=Object.create(null);
global.localStorage={
 getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null},
 setItem(k,v){store[k]=String(v)},
 removeItem(k){delete store[k]},
 clear(){for(const k of Object.keys(store))delete store[k]}
};
global.document={
 querySelector(){return null},
 createElement(){return {id:'',innerHTML:'',querySelector(){return null}}}
};
global.TitleBook={noteDailyClear(){}};

const DailyMatch=require(path.join(__dirname,'../../../daily.js'));

const PERFECT_DAY='2026-09-01'; // hashes to perfect_3
const STAGE_DAY='2026-09-14';  // hashes to stage_2 (real today)
assert(DailyMatch.goalForDay(PERFECT_DAY).id==='perfect_3','fixture day must be perfect_3');
assert(DailyMatch.goalForDay(STAGE_DAY).kind==='stage','stage fixture');

const results=[];
function step(name,fn){
 try{fn();results.push({name,ok:true});console.log('PASS',name)}
 catch(e){results.push({name,ok:false,error:String(e&&e.message||e)});console.error('FAIL',name,e.message);throw e}
}

step('startDailyPlay zeros session and activates',[()=>{
 DailyMatch.__setTestToday(PERFECT_DAY);
 localStorage.clear();
 DailyMatch.beginNormal();
 DailyMatch.startDailyPlay();
 assert(DailyMatch.isActive()===true,'active');
 assert(DailyMatch.sessionPerfects===0,'session zero');
 assert(DailyMatch.state.cleared===false||DailyMatch.state.day===PERFECT_DAY,'day ready');
}][0]);

step('segment 2 perfects does not clear perfect_3',[()=>{
 const r=DailyMatch.noteRun({perfects:2,stage:1,won:true});
 assert(r&&r.cleared===false,'not cleared yet');
 assert(r.sessionPerfects===2,'session=2');
 assert(DailyMatch.sessionPerfects===2);
 assert(DailyMatch.state.bestPerfects===2,'best mirrors session');
 assert(r.lastResultNote.indexOf('1회 부족')>=0,'shortfall 1');
}][0]);

step('continue segment +1 clears perfect_3 (session 3)',[()=>{
 const r=DailyMatch.noteRun({perfects:1,stage:2,won:true});
 assert(r&&r.cleared===true,'cleared');
 assert(r.newlyCleared===true,'newly cleared');
 assert(r.sessionPerfects===3,'session=3');
 assert(DailyMatch.state.cleared===true);
 assert(DailyMatch.state.bestPerfects===3);
 assert(r.lastResultNote.indexOf('클리어')>=0);
}][0]);

step('beginNormal resets session; noteRun without daily is noop',[()=>{
 DailyMatch.beginNormal();
 assert(DailyMatch.isActive()===false);
 assert(DailyMatch.sessionPerfects===0);
 const r=DailyMatch.noteRun({perfects:9,stage:9});
 assert(r===null,'inactive noteRun returns null');
 assert(DailyMatch.sessionPerfects===0,'still zero');
}][0]);

step('new daily start zeros accumulator again',[()=>{
 // day already cleared — wipe cleared for a fresh session sim
 localStorage.clear();
 DailyMatch.__setTestToday(PERFECT_DAY);
 DailyMatch.startDailyPlay();
 assert(DailyMatch.sessionPerfects===0);
 const r=DailyMatch.noteRun({perfects:2,stage:1});
 assert(r.cleared===false);
 assert(r.sessionPerfects===2);
 DailyMatch.startDailyPlay(); // new 「오늘 한 판」
 assert(DailyMatch.sessionPerfects===0,'fresh start zeros');
 const r2=DailyMatch.noteRun({perfects:1,stage:1});
 assert(r2.sessionPerfects===1,'starts from 1 not 3');
 assert(r2.cleared===false);
}][0]);

step('stage goals still use stage (session perfects irrelevant)',[()=>{
 localStorage.clear();
 DailyMatch.__setTestToday(STAGE_DAY);
 DailyMatch.beginNormal();
 DailyMatch.startDailyPlay();
 const g=DailyMatch.todayGoal();
 assert(g.kind==='stage'&&g.target===2,'stage_2');
 const r1=DailyMatch.noteRun({perfects:0,stage:1,won:true});
 assert(r1.cleared===false,'stage 1 short');
 assert(r1.lastResultNote.indexOf('스테이지')>=0);
 const r2=DailyMatch.noteRun({perfects:0,stage:2,won:true});
 assert(r2.cleared===true,'stage 2 clears');
 assert(DailyMatch.state.bestStage===2);
}][0]);

DailyMatch.__setTestToday(null);
DailyMatch.beginNormal();

const out={
 when:new Date().toISOString(),
 goal:'session PERFECT accumulate across continue (perfect_3: 2+1)',
 results,
 allPass:results.every(r=>r.ok)
};
fs.writeFileSync(path.join(__dirname,'RESULTS.json'),JSON.stringify(out,null,2));
fs.writeFileSync(path.join(__dirname,'README.txt'),
`daily PERFECT session accumulate — Node unit test
================================================
Run: node design/evidence/daily-perfect-accumulate/test-session-perfects.js

Cases:
1. startDailyPlay zeros session + activates
2. noteRun({perfects:2,stage:1}) → not cleared (session 2)
3. noteRun({perfects:1,stage:2}) → cleared (session 3) for perfect_3
4. beginNormal resets; inactive noteRun is noop
5. new startDailyPlay zeros again
6. stage_2 still clears via stage number

Fixture days: 2026-09-01 → perfect_3, 2026-09-14 → stage_2
`);
console.log('\nALL PASS',results.length);
process.exit(0);
