// Boot, navigation, home stats
async function boot(src='data/spotify_dataset.csv'){
  $('#loader').hidden=false;$('#error').hidden=true;
  try{
    DATA=await parseCsv(src);if(!DATA.length)throw new Error('The CSV has no rows.');
    DATA.forEach((r,i)=>{
      r.i=i;
      r.track_name=String(r.track_name??'(untitled)');
      r.track_artist=String(r.track_artist??'(unknown)');
      r.track_album_name=String(r.track_album_name??'(unknown album)');
      r.playlist_name=String(r.playlist_name??'(unknown playlist)');
      r.playlist_genre=String(r.playlist_genre??'');
      r.playlist_subgenre=String(r.playlist_subgenre??'');
    });
    GENRES=[...new Set(DATA.map(r=>r.playlist_genre))].filter(Boolean).sort();
    initHome();initSongs();initDiscover();initTop();initGenres();initSegments();initPlaylists();initAnalytics();
  }catch(e){
    console.error(e);const el=$('#error');el.hidden=false;
    el.innerHTML=`<h3>Could not load the dataset</h3><p>Open this site through a local server such as VS Code Live Server, or choose the file here.</p><input id="pick" type="file" accept=".csv" aria-label="Choose spotify_dataset.csv">`;
    $('#pick').onchange=ev=>boot(ev.target.files[0]);
  }
  $('#loader').hidden=true;
}
function initHome(){
  const u=new Set(DATA.map(r=>r.track_id)).size,a=new Set(DATA.map(r=>r.track_artist)).size,p=new Set(DATA.map(r=>r.playlist_id)).size;
  const items=[[u,'Unique songs'],[a,'Artists'],[GENRES.length,'Genres'],[p,'Playlists'],[fmt(avg(DATA.map(r=>r.track_popularity)),1),'Average popularity']];
  $('#stats').innerHTML=items.map(([v,l])=>`<div class="card"><b>${typeof v==='number'?v.toLocaleString():v}</b><span>${l}</span></div>`).join('');
  $('#legend').innerHTML=GENRES.map(g=>`<span><i style="background:${colorOf(g)}"></i>${esc(g)}</span>`).join('');
  $('#rowcount').textContent=DATA.length.toLocaleString();
  scatterChart('heroChart','valence','energy',1200);
}
const burger=$('#burger'),menu=$('#menu');
burger.onclick=()=>burger.setAttribute('aria-expanded',menu.classList.toggle('open'));
menu.addEventListener('click',e=>{if(e.target.matches('a')){menu.classList.remove('open');burger.setAttribute('aria-expanded','false');}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)openSong(+b.dataset.i);});
$('#d-close').onclick=()=>$('#dlg').close();
const topBtn=$('#top-btn');topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>topBtn.hidden=scrollY<600,{passive:true});
boot();
