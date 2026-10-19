import './style.css';
import readXlsxFile from 'read-excel-file';

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = (value) => { if (typeof value !== 'string' || !value.trim()) return ''; try { const url = new URL(value, location.origin); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
const sampleClasses = [
  ['09:00', 'Finding your frequency', 'An introduction to radio & making your first call', 'Radio tent', '45 min'],
  ['10:00', 'Signals in the wild', 'Discover Morse code and send a secret message', 'Discovery space', '60 min'],
  ['11:30', 'Behind the microphone', 'Tell your story and learn to present on air', 'Radio tent', '45 min'],
  ['14:00', 'Connect across the world', 'Meet other scouts through the magic of radio', 'Radio tent', '60 min'],
];
$('#app').innerHTML = `
<header class="header"><a class="brand" href="#home" aria-label="WB6BSA home"><span class="brand-icon">✳︎</span> WB6BSA<span class="brand-dot"></span></a><nav aria-label="Main navigation"><a href="#about">Our station</a><a href="#schedule">Class schedule</a><a href="#gallery">In the field</a></nav><a class="nav-listen" href="#listen">↗ Tune in</a></header>
<main><section class="hero" id="home"><div class="hero-copy"><div class="eyebrow"><span class="tiny-cross">✳︎</span> SMALL STATION. WORLDWIDE CONNECTIONS.</div><h1>Tune into<br>something<br><em>extraordinary.</em></h1><p>Adventures worth sharing.<br>Voices worth listening to. This is WB6BSA.</p><div class="hero-actions"><a class="button orange" href="#listen"><span>▶</span> Listen to the station</a><a class="text-link" href="#schedule">Explore the classes <span>↗</span></a></div><div class="hero-note"><span class="signal-bars"><i></i><i></i><i></i><i></i></span> Good things happen when we connect.</div></div><div class="hero-art" role="img" aria-label="Illustration of a radio antenna beneath a sun in a rolling green landscape"><div class="art-grid"></div><span class="art-label">OUT HERE,<br>WE’RE ALL CONNECTED.</span><div class="sun"></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div><div class="hill hill-back"></div><div class="hill hill-front"></div><div class="tower"><div class="antenna-top"></div><div class="tower-line line-one"></div><div class="tower-line line-two"></div><div class="tower-line line-three"></div></div><div class="art-caption"><span>EST. IN THE SPIRIT OF ADVENTURE</span><span>↗</span></div><div class="frequency-badge">CQ CQ<br><span>CALLING ALL EXPLORERS</span></div></div></section>
<div class="ticker" aria-hidden="true"><span>STAY CURIOUS</span> ✳︎ <span>MAKE CONNECTIONS</span> ✳︎ <span>FIND YOUR VOICE</span> ✳︎ <span>GO FURTHER TOGETHER</span> ✳︎</div>
<section class="about section" id="about"><div class="section-kicker">01 / OUR STATION</div><div><h2>A little curiosity.<br>A world of connection.</h2><p id="introduction"></p><div class="values"><span>↗ Learn by doing</span><span>✳︎ Share your story</span><span>◎ Reach the world</span></div></div></section>
<section class="listen section" id="listen"><div><div class="section-kicker">02 / ON THE AIR</div><h2>Your next adventure.<br>Just press play.</h2><p>Pull up a chair. Turn up the curiosity.</p></div><div class="player"><div class="player-top"><span class="status-label" id="stream-status">STATION PLAYER</span><span>WB6BSA ↗</span></div><div class="player-main"><button class="play-button" id="play" aria-label="Play radio" disabled>▶</button><div><h3>Voices from the field</h3><p id="player-message" role="status">Stream link coming soon</p></div><div class="wave" aria-hidden="true">${Array.from({length:16},(_,i)=>`<i style="--height:${12+(i*17)%43}px;--delay:${i*0.08}s"></i>`).join('')}</div></div><div class="player-bottom"><label for="volume">Volume</label><input id="volume" type="range" min="0" max="1" step="0.01" value="0.7"><span>Listen. Discover. Connect.</span></div><audio id="audio" preload="none"></audio></div></section>
<section class="schedule section" id="schedule"><div class="section-heading"><div><div class="section-kicker">03 / LEARN SOMETHING NEW</div><h2>Make room for discovery.</h2><p>Hands-on classes for your next big “aha!” moment.</p></div><span class="outlined-label" id="schedule-status" role="status">SAMPLE PROGRAMME</span></div><div class="schedule-table"><div class="table-head"><span>TIME</span><span>THE ADVENTURE</span><span>MEET US AT</span><span>DURATION</span></div><div id="classes"></div></div><p class="small-note" id="schedule-note">An example of what’s possible. The confirmed schedule will appear here when the station connects its Excel sheet.</p><button class="text-link refresh" id="refresh">Refresh schedule ↻</button></section>
<section class="gallery section" id="gallery"><div class="section-heading"><div><div class="section-kicker">04 / IN THE FIELD</div><h2>Good times. Great company.</h2></div><a class="text-link" id="album-link" hidden target="_blank" rel="noopener noreferrer">Explore the album ↗</a></div><div class="photo-grid" id="photos"><div class="photo-placeholder one"><span>✳︎</span><p>A little adventure<br>goes a long way.</p><small>YOUR STATION PHOTOS, COMING SOON</small></div><div class="photo-placeholder two"><span>◎</span><p>Different voices.<br>One shared world.</p><small>MOMENTS FROM THE FIELD</small></div><div class="photo-placeholder three"><span>↗</span><p>Collect moments.<br>Make connections.</p><small>SPACE FOR YOUR NEXT STORY</small></div></div><p class="small-note" id="gallery-note">The station’s photo album will appear here once connected.</p></section>
<section class="contact section" id="contact"><div><div class="section-kicker">05 / SAY HELLO</div><h2>Every connection starts<br>with a <em>hello.</em></h2><p>Have a question, a story, or an idea for the airwaves?<br>We’d love to hear from you.</p><div id="contact-details">Public contact details coming soon.</div></div><div class="contact-symbol" aria-hidden="true">✳︎</div></section></main><footer><a class="brand" href="#home">✳︎ WB6BSA</a><span>Made for curious minds & open skies.</span><a href="#home">Back to the top ↑</a></footer>`;

let config = {};
function renderClasses(rows) {
  $('#classes').innerHTML = rows.map(row => `<article class="class-row"><span class="class-time">${escapeHtml(row[0])}</span><div><h3>${escapeHtml(row[1])}</h3><p>${escapeHtml(row[2])}</p></div><span class="class-location">${escapeHtml(row[3])}</span><span class="class-duration">${escapeHtml(row[4])}</span></article>`).join('');
}
async function fetchResource(url) {
  const response = await fetch(url, {signal: AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response;
}
async function loadSchedule() {
  if (!config.scheduleUrl) { renderClasses(sampleClasses); return; }
  $('#schedule-status').textContent = 'UPDATING…';
  $('#refresh').disabled = true;
  try {
    const url = safeUrl(config.scheduleUrl); if (!url) throw new Error('Invalid sheet URL');
    const response = await fetchResource(url);
    const rows = await readXlsxFile(await response.blob());
    const headers = (rows.shift() || []).map(x => String(x ?? '').trim().toLowerCase());
    const required = ['time', 'title', 'description', 'location', 'duration'];
    if (!required.every(h => headers.includes(h))) throw new Error('Missing required column');
    const classes = rows.filter(r => r[headers.indexOf('title')]).map(r => required.map(h => {
      const value = r[headers.indexOf(h)];
      return value instanceof Date ? value.toISOString().slice(11,16) : value ?? '';
    }));
    renderClasses(classes);
    $('#schedule-status').textContent = 'LATEST PROGRAMME';
    $('#schedule-note').textContent = classes.length ? 'Loaded from the station’s Excel sheet. Refresh for the latest updates.' : 'No classes are scheduled yet. Check back soon.';
  } catch {
    $('#schedule-status').textContent = 'SCHEDULE UNAVAILABLE';
    $('#schedule-note').textContent = 'We couldn’t load the Excel schedule. Please try again shortly.';
    $('#classes').replaceChildren();
  } finally { $('#refresh').disabled = false; }
}
function renderPhotos(photos) {
  const valid = photos.filter(p => p && safeUrl(p.url));
  if (!valid.length) return;
  $('#photos').innerHTML = valid.map(p => `<figure><img src="${escapeHtml(safeUrl(p.url))}" alt="${escapeHtml(p.caption || 'WB6BSA activities')}" loading="lazy"><figcaption>${escapeHtml(p.caption || 'In the field')}</figcaption></figure>`).join('');
  $('#gallery-note').textContent = 'Stories and snapshots from our scouting community.';
}
const audio = $('#audio');
audio.volume = 0.7;
$('#volume').addEventListener('input', e => { audio.volume = Number(e.target.value); });
$('#play').addEventListener('click', async () => {
  if (!audio.paused) { audio.pause(); return; }
  $('#player-message').textContent = 'Connecting to the station…';
  try { await audio.play(); } catch { $('#player-message').textContent = 'Unable to connect. Please try again.'; }
});
function playerState(playing) {
  $('#play').textContent = playing ? 'Ⅱ' : '▶';
  $('#play').setAttribute('aria-label', playing ? 'Pause radio' : 'Play radio');
  $('.player').classList.toggle('playing', playing);
  $('#stream-status').textContent = playing ? '● NOW PLAYING' : 'STATION PLAYER';
  $('#player-message').textContent = playing ? 'You’re listening to WB6BSA' : 'Ready when you are';
}
audio.addEventListener('playing', () => playerState(true));
audio.addEventListener('pause', () => playerState(false));
audio.addEventListener('error', () => { playerState(false); $('#player-message').textContent = 'The stream is unavailable. Please try again later.'; });
$('#refresh').addEventListener('click', loadSchedule);
async function init() {
  try { config = await (await fetchResource(`${import.meta.env.BASE_URL}station.json`)).json(); } catch { $('#player-message').textContent = 'Station configuration unavailable'; }
  $('#introduction').textContent = config.introduction || 'We bring scouts together through stories, hands-on learning, and the joy of making a connection.';
  if (safeUrl(config.streamUrl) && config.streamUrl) { audio.src = safeUrl(config.streamUrl); $('#play').disabled = false; $('#player-message').textContent = 'Ready when you are'; }
  if (config.albumUrl && safeUrl(config.albumUrl)) { $('#album-link').href = safeUrl(config.albumUrl); $('#album-link').hidden = false; }
  renderPhotos(Array.isArray(config.photos) ? config.photos : []);
  if (config.albumFeedUrl && safeUrl(config.albumFeedUrl)) {
    try { const photos = await (await fetchResource(safeUrl(config.albumFeedUrl))).json(); if (!Array.isArray(photos)) throw new Error('Invalid album'); renderPhotos(photos); }
    catch { $('#gallery-note').textContent = 'The album couldn’t be refreshed. Please try again later or visit the original album.'; }
  }
  const details = $('#contact-details');
  if (config.email || config.location) {
    details.replaceChildren();
    if (config.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) { const a = document.createElement('a'); a.href = `mailto:${config.email}`; a.textContent = `${config.email} ↗`; details.append(a); }
    if (config.location) { const p = document.createElement('p'); p.textContent = config.location; details.append(p); }
  }
  await loadSchedule();
}
init();
