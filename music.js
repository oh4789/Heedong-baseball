'use strict';
/** Procedural BGM for opening + gameplay (no external files). */
const GameMusic=(()=>{
 let ctx=null, master=null, nodes=[], mode=null, muted=false;
 function ensure(){
  if(ctx)return true;
  try{
   ctx=new(window.AudioContext||window.webkitAudioContext)();
   master=ctx.createGain();
   master.gain.value=muted?0:.07;
   master.connect(ctx.destination);
   return true;
  }catch{return false}
 }
 function clear(){
  for(const n of nodes){try{n.stop?.()}catch{}try{n.disconnect?.()}catch{}}
  nodes=[];
  mode=null;
 }
 function tone(type,freq,delay,dur,gain=0.04){
  if(!ctx||!master)return;
  const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+delay;
  o.type=type;o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(gain,t+.08);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(master);
  o.start(t);o.stop(t+dur+.05);
  nodes.push(o,g);
 }
 function loopPad(freqs,interval,type='sine',gain=.018){
  if(!ctx||!master)return;
  let i=0;
  const tick=()=>{
   if(muted||!mode)return;
   const f=freqs[i++%freqs.length];
   tone(type,f,0,interval*1.2,gain);
  };
  tick();
  const id=setInterval(tick,interval*1000);
  nodes.push({stop(){clearInterval(id)}});
 }
 function startOpening(){
  if(muted||!ensure())return;
  ctx.resume();
  if(mode==='opening')return;
  clear();mode='opening';
  master.gain.setTargetAtTime(.08,ctx.currentTime,.05);
  // soft dusk pad + light motif
  loopPad([196,247,294,392],2.4,'sine',.022);
  loopPad([147,185],4.8,'triangle',.012);
 }
 function startPlay(){
  if(muted||!ensure())return;
  ctx.resume();
  if(mode==='play')return;
  clear();mode='play';
  master.gain.setTargetAtTime(.06,ctx.currentTime,.05);
  // night-game pulse
  loopPad([130.8,164.8,196,246.9],1.8,'sine',.02);
  loopPad([98,123.5],3.6,'triangle',.01);
  // soft kick-ish click every bar via low sine
  const beat=()=>{
   if(muted||mode!=='play')return;
   tone('sine',55,0,.25,.03);
  };
  beat();
  const id=setInterval(beat,1800);
  nodes.push({stop(){clearInterval(id)}});
 }
 function stop(){
  if(!ctx||!master){clear();return}
  master.gain.setTargetAtTime(0,ctx.currentTime,.08);
  setTimeout(clear,120);
 }
 function setMuted(v){
  muted=!!v;
  if(!ensure())return;
  master.gain.setTargetAtTime(muted?0:(mode==='opening'?.08:.06),ctx.currentTime,.05);
  if(muted)stop();
 }
 return {startOpening,startPlay,stop,setMuted,activate:()=>{ensure()&&ctx.resume()}};
})();
