// CSV loading and shared helpers
const FEATS=['danceability','energy','acousticness','instrumentalness','liveness','valence','speechiness'];
const $=(s,r=document)=>r.querySelector(s);
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const fmt=(n,d=2)=>Number(n||0).toFixed(d);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const debounce=(fn,ms=250)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};};
const group=(rows,key)=>{const m=new Map();for(const r of rows){const k=r[key];if(!m.has(k))m.set(k,[]);m.get(k).push(r);}return m;};
const summarize=rows=>{const o={n:rows.length};for(const f of ['track_popularity','tempo',...FEATS])o[f]=avg(rows.map(r=>r[f]));return o;};
const opts=(sel,vals,all)=>{sel.innerHTML=(all?`<option value="">${all}</option>`:'')+vals.map(v=>`<option>${esc(v)}</option>`).join('');};
const GENRE_COLORS=['#ff4d8d','#ffb84d','#4de1ff','#9d7bff','#5ef2a0','#ff7a59'];
let DATA=[],GENRES=[];
const colorOf=g=>{const i=GENRES.indexOf(g);return i>=0?GENRE_COLORS[i%GENRE_COLORS.length]:'#ffffff';};
const parseCsv=src=>new Promise((res,rej)=>Papa.parse(src,{download:typeof src==='string',header:true,dynamicTyping:true,skipEmptyLines:true,complete:r=>res(r.data),error:rej}));

