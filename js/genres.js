// Genres, subgenres, segmentation, playlists
function initGenres(){
  const g=group(DATA,'playlist_genre'),S=GENRES.map(k=>({k,...summarize(g.get(k))}));
  $('#genre-cards').innerHTML=S.map(s=>`<button class="gcard" data-g="${esc(s.k)}" style="--c:${colorOf(s.k)}"><h3>${esc(s.k)}</h3><p>${s.n.toLocaleString()} songs</p><small><span>Popularity ${fmt(s.track_popularity,1)}</span><span>Energy ${fmt(s.energy)}</span><span>Danceability ${fmt(s.danceability)}</span><span>Valence ${fmt(s.valence)}</span><span>Acousticness ${fmt(s.acousticness)}</span></small></button>`).join('');
  $('#genre-charts').innerHTML=chartCard('Songs by genre','gc1')+chartCard('Popularity by genre','gc2')+chartCard('Energy by genre','gc3')+chartCard('Danceability by genre','gc4');
  const cols=GENRES.map(colorOf);
  [['gc1','n'],['gc2','track_popularity'],['gc3','energy'],['gc4','danceability']].forEach(([id,f])=>barChart(id,GENRES,S.map(s=>+s[f].toFixed(3)),f,cols));
  $('#genre-cards').addEventListener('click',e=>{
    const b=e.target.closest('[data-g]');if(!b)return;const k=b.dataset.g,rows=g.get(k);
    const subs=[...group(rows,'playlist_subgenre')].map(([n,r])=>`<span>${esc(n)}: ${r.length.toLocaleString()}</span>`).join('');
    const top=[...rows].sort((a,b)=>b.track_popularity-a.track_popularity).slice(0,5).map(r=>`<li><button class="link" data-i="${r.i}">${esc(r.track_name)}</button>, ${esc(r.track_artist)} (${r.track_popularity})</li>`).join('');
    const d=$('#genre-detail');d.hidden=false;d.innerHTML=`<h3>${esc(k)} in detail</h3><div class="chips">${subs}</div><p class="muted">Most popular songs</p><ol>${top}</ol>`;
  });
  opts($('#sg-genre'),GENRES,'All genres');
  const upd=()=>{
    const gen=$('#sg-genre').value,m=$('#sg-metric').value;
    const L=[...group(DATA,'playlist_subgenre')].map(([n,r])=>({n,p:r[0].playlist_genre,...summarize(r)})).filter(s=>!gen||s.p===gen).sort((a,b)=>b[m]-a[m]);
    barChart('sgChart',L.map(s=>s.n),L.map(s=>+s[m].toFixed(3)),m,L.map(s=>colorOf(s.p)),true);
    $('#sg-rows').innerHTML=L.map(s=>`<tr><td>${esc(s.n)}</td><td>${esc(s.p)}</td><td>${s.n}</td><td>${fmt(s.track_popularity,1)}</td><td>${fmt(s.energy)}</td><td>${fmt(s.danceability)}</td></tr>`).join('');
  };
  $('#sg-genre').onchange=$('#sg-metric').onchange=upd;upd();
}
function initSegments(){
  const sub=[...group(DATA,'playlist_subgenre')].map(([name,r])=>({name,p:r[0].playlist_genre,count:r.length,...summarize(r)}));
  draw('bubble',{type:'bubble',data:{datasets:GENRES.map(k=>({label:k,data:sub.filter(s=>s.p===k).map(s=>({x:s.energy,y:s.danceability,r:5+Math.sqrt(s.count)/3,name:s.name,count:s.count})),backgroundColor:colorOf(k)+'99',borderColor:colorOf(k)}))},
    options:{scales:{x:{title:{display:true,text:'Average energy'}},y:{title:{display:true,text:'Average danceability'}}},plugins:{tooltip:{callbacks:{label:c=>`${c.raw.name}: ${c.raw.count} songs`}}}}});
  const g=group(DATA,'playlist_genre');
  radarChart('genreRadar',GENRES.map(k=>{const s=summarize(g.get(k));return{label:k,data:FEATS.map(f=>s[f]),borderColor:colorOf(k),backgroundColor:colorOf(k)+'22'};}));
}
function initPlaylists(){
  const L=[...group(DATA,'playlist_id')].map(([id,r])=>({id,name:r[0].playlist_name,genre:r[0].playlist_genre,rows:r,n:r.length,pop:avg(r.map(x=>x.track_popularity))})).sort((a,b)=>b.n-a.n);
  const render=()=>{
    const q=$('#pl-q').value.trim().toLowerCase(),M=L.filter(p=>!q||String(p.name).toLowerCase().includes(q));
    $('#pl-empty').hidden=M.length>0;
    $('#pl-rows').innerHTML=M.slice(0,25).map(p=>`<tr><td><button class="link" data-p="${esc(p.id)}">${esc(p.name)}</button></td><td>${esc(p.genre)}</td><td>${p.n}</td><td>${fmt(p.pop,1)}</td></tr>`).join('');
  };
  $('#pl-q').addEventListener('input',debounce(render));render();
  $('#pl-rows').addEventListener('click',e=>{
    const b=e.target.closest('[data-p]');if(!b)return;const p=L.find(x=>x.id===b.dataset.p),s=summarize(p.rows);
    const top=[...p.rows].sort((a,b)=>b.track_popularity-a.track_popularity).slice(0,10).map(r=>`<li><button class="link" data-i="${r.i}">${esc(r.track_name)}</button>, ${esc(r.track_artist)} (${r.track_popularity})</li>`).join('');
    const d=$('#pl-detail');d.hidden=false;d.innerHTML=`<h3>${esc(p.name)}</h3><div class="chips"><span>${p.n} songs</span><span>Popularity ${fmt(s.track_popularity,1)}</span><span>Energy ${fmt(s.energy)}</span><span>Danceability ${fmt(s.danceability)}</span><span>Valence ${fmt(s.valence)}</span></div><p class="muted">Top 10 songs</p><ol>${top}</ol>`;
    d.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
}
