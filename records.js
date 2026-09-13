'use strict';
class BaseballRecords {
 constructor(storage){this.storage=storage;this.key='one-more-at-bat.records.v1';this.data={stage:0,perfects:0};this.saved=true;try{this.merge(JSON.parse(storage.getItem(this.key)))}catch{this.saved=false}}
 merge(value){for(const key of ['stage','perfects'])if(Number.isSafeInteger(value?.[key])&&value[key]>=0)this.data[key]=Math.max(this.data[key],value[key])}
 update(stage,perfects){
 const before=JSON.stringify(this.data);
 try{this.merge(JSON.parse(this.storage.getItem(this.key)))}catch{}
 this.merge({stage,perfects});
 if(JSON.stringify(this.data)!==before||!this.saved){try{this.storage.setItem(this.key,JSON.stringify(this.data));this.saved=true}catch{this.saved=false}}
 }
}
if(typeof module!=='undefined')module.exports=BaseballRecords;
