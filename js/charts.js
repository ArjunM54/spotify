// Chart.js helpers: every chart is built from aggregated or sampled dataset values
Chart.defaults.color='#b9b2d0';Chart.defaults.borderColor='rgba(255,255,255,.08)';Chart.defaults.font.family="'DM Sans',sans-serif";
const charts={};
function draw(id,cfg){const el=document.getElementById(id);if(!el)return;charts[id]?.destroy();cfg.options={responsive:true,maintainAspectRatio:false,...cfg.options};charts[id]=new Chart(el,cfg);}
const sample=(rows,n)=>{const s=Math.max(1,Math.floor(rows.length/n));return rows.filter((_,i)=>i%s===0);};
const chartCard=(title,id,cls='')=>`<div class="card"><h3>${title}</h3><div class="cv ${cls}"><canvas id="${id}" aria-label="${title}"></canvas></div></div>`;
function scatterChart(id,xf,yf,n=1500){
  const g=group(sample(DATA,n),'playlist_genre');
  draw(id,{type:'scatter',data:{datasets:GENRES.map(k=>({label:k,data:(g.get(k)||[]).map(r=>({x:r[xf],y:r[yf],t:r.track_name})),backgroundColor:colorOf(k)+'aa',pointRadius:2.5}))},
    options:{scales:{x:{title:{display:true,text:xf}},y:{title:{display:true,text:yf}}},plugins:{legend:{display:id!=='heroChart'},tooltip:{callbacks:{label:c=>`${c.raw.t}: ${c.raw.x}, ${c.raw.y}`}}}}});
}
function barChart(id,labels,vals,label,colors,horizontal){
  draw(id,{type:'bar',data:{labels,datasets:[{label,data:vals,backgroundColor:colors,borderRadius:6}]},options:{indexAxis:horizontal?'y':'x',plugins:{legend:{display:false}}}});
}
function histChart(id,f,bins=20,color='#ff4d8d'){
  let lo=Infinity,hi=-Infinity;for(const r of DATA){if(r[f]<lo)lo=r[f];if(r[f]>hi)hi=r[f];}
  const w=(hi-lo)/bins||1,c=new Array(bins).fill(0);
  for(const r of DATA)c[Math.min(bins-1,Math.floor((r[f]-lo)/w))]++;
  barChart(id,c.map((_,i)=>fmt(lo+i*w,f==='tempo'?0:2)),c,'Songs',color);
}
function radarChart(id,sets){
  draw(id,{type:'radar',data:{labels:FEATS,datasets:sets.map(s=>({borderWidth:2,pointRadius:2,...s}))},
    options:{scales:{r:{min:0,max:1,ticks:{backdropColor:'transparent'},grid:{color:'rgba(255,255,255,.1)'}}},plugins:{legend:{display:sets.length>1}}}});
}
