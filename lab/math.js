/* Pure, deterministic teaching algorithms; usable from Node tests and browser. */
(function(root){
'use strict';
const iou=(a,b)=>{const w=Math.max(0,Math.min(a[0]+a[2],b[0]+b[2])-Math.max(a[0],b[0])),h=Math.max(0,Math.min(a[1]+a[3],b[1]+b[3])-Math.max(a[1],b[1]));const u=a[2]*a[3]+b[2]*b[3]-w*h;return u?w*h/u:0};
const tiou=(a,b)=>{const inter=Math.max(0,Math.min(a[1],b[1])-Math.max(a[0],b[0]));const u=(a[1]-a[0])+(b[1]-b[0])-inter;return u>0?inter/u:0};
const smooth=(x,k=1)=>x.map((_,i)=>{const a=x.slice(Math.max(0,i-Math.floor(k/2)),Math.min(x.length,i+Math.floor(k/2)+1));return a.reduce((s,v)=>s+v,0)/a.length});
const segments=(scores,threshold,dt=1)=>{const result=[];let start=null;for(let i=0;i<=scores.length;i++){if(i<scores.length&&scores[i]>=threshold){if(start===null)start=i}else if(start!==null){result.push([start*dt,i*dt]);start=null}}return result};
const sample=(fps,offsetFrames=0,totalFrames=120,sourceFps=30)=>{const step=sourceFps/fps;return Array.from({length:Math.max(0,Math.ceil((totalFrames-offsetFrames)/step))},(_,i)=>offsetFrames+i*step).filter(n=>n<totalFrames)};
function nms(boxes,threshold){const kept=[],suppressed=[];for(const b of [...boxes].sort((a,b)=>b.score-a.score)){const match=kept.find(k=>iou(k.box,b.box)>threshold);if(match)suppressed.push({id:b.id,by:match.id,iou:iou(match.box,b.box)});else kept.push(b)}return{kept,suppressed}}
function assignment(cost){let best={cost:Infinity,cols:[]};const rec=(i,cols,used,total)=>{if(i===cost.length){if(total<best.cost)best={cost:total,cols:[...cols]};return}for(let j=0;j<cost[i].length;j++)if(!used.has(j)){used.add(j);rec(i+1,[...cols,j],used,total+cost[i][j]);used.delete(j)}};rec(0,[],new Set(),0);return best}
const api={iou,tiou,smooth,segments,sample,nms,assignment};root.LabMath=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
