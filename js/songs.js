// Song explorer, song details, discover, top lists
const S={page:0,size:15,rows:[]};
const sortFns={track_popularity:(a,b)=>b.track_popularity-a.track_popularity,track_name:(a,b)=>String(a.track_name).localeCompare(String(b.track_name)),track_artist:(a,b)=>String(a.track_artist).localeCompare(String(b.track_artist)),energy:(a,b)=>b.energy-a.energy,danceability:(a,b)=>b.danceability-a.danceability};
function initSongs(){
  opts($('#f-genre'),GENRES,'All genres');
  const upd=()=>opts($('#f-sub'),[...new Set(DATA.filter(r=>!$('#f-genre').value||r.playlist_genre===$('#f-genre').value).map(r=>r.playlist_subgenre))].sort(),'All subgenres');
  const run=()=>{
    ['pop','energy','dance'].forEach(k=>$(`#f-${k}-o`).value=$(`#f-${k}`).value);
    const q=$('#q').value.trim().toLowerCase(),g=$('#f-genre').value,s=$('#f-sub').value,p=+$('#f-pop').value,e=+$('#f-energy').value,d=+$('#f-dance').value;
    S.rows=DATA.filter(r=>(!g||r.playlist_genre===g)&&(!s||r.playlist_subgenre===s)&&r.track_popularity>=p&&r.energy>=e&&r.danceability>=d&&(!q||String(r.track_name).toLowerCase().includes(q)||String(r.track_artist).toLowerCase().includes(q))).sort(sortFns[$('#sort').value]);
    S.page=0;renderSongs();
  };
  upd();
  $('#f-genre').addEventListener('change',()=>{upd();run();});
  ['f-sub','f-pop','f-energy','f-dance','sort'].forEach(id=>$('#'+id).addEventListener('input',run));
  $('#q').addEventListener('input',debounce(run));
  $('#reset').onclick=()=>{$('#q').value='';$('#f-genre').value='';upd();['f-pop','f-energy','f-dance'].forEach(id=>$('#'+id).value=0);$('#sort').value='track_popularity';run();};
  $('#prev').onclick=()=>{S.page--;renderSongs();};$('#next').onclick=()=>{S.page++;renderSongs();};
  run();
}
function renderSongs(){
  const pages=Math.max(1,Math.ceil(S.rows.length/S.size)),r=S.rows.slice(S.page*S.size,(S.page+1)*S.size);
  $('#rows').innerHTML=r.map(x=>`<tr><td><button class="link" data-i="${x.i}">${esc(x.track_name)}</button></td><td>${esc(x.track_artist)}</td><td>${esc(x.playlist_genre)}</td><td>${esc(x.playlist_subgenre)}</td><td>${x.track_popularity}</td><td>${x.danceability}</td><td>${x.energy}</td><td>${x.valence}</td><td>${fmt(x.tempo,0)}</td></tr>`).join('');
  $('#songs-empty').hidden=S.rows.length>0;$('#count').textContent=`${S.rows.length.toLocaleString()} matching entries`;
  $('#page').textContent=`Page ${S.page+1} of ${pages}`;$('#prev').disabled=S.page===0;$('#next').disabled=S.page>=pages-1;
}
function openSong(i){
  const r=DATA[i];if(!r)return;const sec=Math.floor((r.duration_ms||0)/1000);
  $('#d-title').textContent=r.track_name;
  $('#d-meta').innerHTML=[['Artist',r.track_artist],['Album',r.track_album_name],['Genre',r.playlist_genre],['Subgenre',r.playlist_subgenre],['Playlist',r.playlist_name],['Popularity',r.track_popularity],['Release date',r.track_album_release_date],['Tempo',fmt(r.tempo,0)+' BPM'],['Loudness',fmt(r.loudness,1)+' dB'],['Duration',Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')]].map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  $('#dlg').showModal();
  radarChart('songRadar',[{label:r.track_name,data:FEATS.map(f=>r[f]),borderColor:colorOf(r.playlist_genre),backgroundColor:colorOf(r.playlist_genre)+'55'}]);
}
function initDiscover(){
  opts($('#d-genre'),GENRES,'Any genre');
  ['energy','dance','valence','pop'].forEach(k=>opts($('#d-'+k),['Low','High'],'Any'));
  const test=(v,lvl,lo,hi)=>!lvl||(lvl==='Low'?v<lo:v>=hi);
  const run=()=>{
    const g=$('#d-genre').value,e=$('#d-energy').value,d=$('#d-dance').value,v=$('#d-valence').value,p=$('#d-pop').value,seen=new Set();
    const M=DATA.filter(r=>(!g||r.playlist_genre===g)&&test(r.energy,e,.4,.7)&&test(r.danceability,d,.4,.7)&&test(r.valence,v,.4,.7)&&test(r.track_popularity,p,30,70)).sort(sortFns.track_popularity).filter(r=>!seen.has(r.track_id)&&seen.add(r.track_id));
    $('#d-out').innerHTML=M.length?M.slice(0,12).map(r=>`<button class="song" data-i="${r.i}" style="--c:${colorOf(r.playlist_genre)}"><b>${esc(r.track_name)}</b><span>${esc(r.track_artist)}, ${esc(r.playlist_genre)}</span><span>Popularity ${r.track_popularity}, energy ${r.energy}, danceability ${r.danceability}</span></button>`).join(''):'<p class="muted">No songs match this mix. Set a filter back to Any.</p>';
  };
  ['genre','energy','dance','valence','pop'].forEach(k=>$('#d-'+k).addEventListener('change',run));run();
}
function initTop(){
  const seen=new Set(),top=[...DATA].sort(sortFns.track_popularity).filter(r=>!seen.has(r.track_id)&&seen.add(r.track_id)).slice(0,10);
  $('#top-songs').innerHTML=top.map(r=>`<tr><td><button class="link" data-i="${r.i}">${esc(r.track_name)}</button></td><td>${esc(r.track_artist)}</td><td>${esc(r.playlist_genre)}</td><td>${r.track_popularity}</td></tr>`).join('');
  const A=[...group(DATA,'track_artist')].map(([n,r])=>{const u=[...new Map(r.map(x=>[x.track_id,x])).values()];return{n,c:u.length,p:avg(u.map(x=>x.track_popularity))};}).filter(a=>a.c>=5).sort((a,b)=>b.p-a.p).slice(0,10);
  $('#top-artists').innerHTML=A.map(a=>`<tr><td>${esc(a.n)}</td><td>${a.c}</td><td>${fmt(a.p,1)}</td></tr>`).join('');
}
