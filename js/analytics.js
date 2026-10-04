// Analytics dashboard and correlation heatmap
function initAnalytics(){
  const H=[['Popularity distribution','track_popularity',20,'#ff4d8d'],['Danceability distribution','danceability',20,'#4de1ff'],['Energy distribution','energy',20,'#ffb84d'],['Valence distribution','valence',20,'#5ef2a0'],['Acousticness distribution','acousticness',20,'#9d7bff'],['Tempo distribution (BPM)','tempo',24,'#ff7a59']];
  const X=[['energy','danceability'],['danceability','valence'],['energy','loudness'],['acousticness','energy'],['track_popularity','energy'],['track_popularity','danceability']];
  $('#an-grid').innerHTML=chartCard('Average popularity by genre','anPop')+H.map((h,i)=>chartCard(h[0],'h'+i)).join('')+X.map((x,i)=>chartCard(`${x[0]} vs ${x[1]}`,'x'+i)).join('');
  const g=group(DATA,'playlist_genre');
  barChart('anPop',GENRES,GENRES.map(k=>+avg((g.get(k)||[]).map(r=>r.track_popularity)).toFixed(2)),'Average popularity',GENRES.map(colorOf));
  H.forEach((h,i)=>histChart('h'+i,h[1],h[2],h[3]));
  X.forEach((x,i)=>scatterChart('x'+i,x[0],x[1],2000));
  const V=['danceability','energy','loudness','speechiness','acousticness','instrumentalness','liveness','valence','tempo','track_popularity','duration_ms'];
  const col=Object.fromEntries(V.map(v=>[v,DATA.map(r=>r[v])])),mean=Object.fromEntries(V.map(v=>[v,avg(col[v])]));
  const corr=(a,b)=>{let sxy=0,sxx=0,syy=0;for(let i=0;i<DATA.length;i++){const x=col[a][i]-mean[a],y=col[b][i]-mean[b];sxy+=x*y;sxx+=x*x;syy+=y*y;}return sxy/Math.sqrt(sxx*syy);};
  const short=v=>v.replace('track_','').replace('_ms','').slice(0,5);
  $('#heat').innerHTML=`<table class="heat" style="min-width:640px"><thead><tr><th></th>${V.map(v=>`<th title="${v}">${short(v)}</th>`).join('')}</tr></thead><tbody>${V.map(a=>`<tr><th title="${a}">${short(a)}</th>${V.map(b=>{const c=corr(a,b);return`<td title="${a} vs ${b}: ${fmt(c,3)}" style="background:${c>=0?'rgba(255,77,141,':'rgba(77,225,255,'}${Math.abs(c).toFixed(2)})">${fmt(c)}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
}
