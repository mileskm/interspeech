import { animals } from './animals.js';
import { Game } from './game.js';
const main = document.querySelector('#main');
const game = new Game(animals);
const player = new Audio(); player.preload = 'auto'; player.id = 'stimulus'; player.hidden = true; player.setAttribute('aria-hidden', 'true'); document.body.append(player);
let screen = 'landing'; let played = false; let playbackToken = 0;
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img = (a, extra='') => `<img src="${a.image}" alt="${escapeHTML(a.name)}" ${extra}>`;
const playButton = () => `<button class="play" id="play" aria-pressed="false"><span class="play-icon" aria-hidden="true">▶</span><span class="play-label">PLAY SOUND</span></button>`;
function stopAudio() { playbackToken++; player.pause(); player.currentTime = 0; }
function focusMain() { main.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
function landing() {
  stopAudio(); screen = 'landing';
  main.innerHTML = `<section class="landing"><div><p class="eyebrow">A listening challenge</p><h1>Guess the<br>Australian<br><em>animal.</em></h1><p class="lead">How well do you know the sounds of Australia?</p><button class="primary large" id="start">START <span aria-hidden="true">↗</span></button><p class="small-note">${animals.length} animals · Four choices · Listen as often as you like</p></div><figure class="landing-photo">${img(animals[0],'fetchpriority="high"')}<figcaption><span>The bush has a voice.</span><span>Can you place it?</span></figcaption></figure></section>`;
  document.querySelector('#start').onclick = () => { game.restart(); trial(); };
}
function heading() { return `<div class="round-head"><p class="eyebrow">ANIMAL ${game.index + 1} / ${animals.length}</p><span class="score">Score: ${game.score}</span></div><div class="progress" role="progressbar" aria-label="Animals answered" aria-valuemin="0" aria-valuemax="${animals.length}" aria-valuenow="${game.results.length}"><span style="width:${game.results.length / animals.length * 100}%"></span></div>`; }
function trial() {
  stopAudio(); screen = 'trial'; played = false;
  player.src = game.current.audio;
  main.innerHTML = `${heading()}<section class="game-layout"><div class="question"><p class="eyebrow">LISTEN CLOSELY</p><h1>What Australian animal made this sound?</h1>${playButton()}<p class="listen-help" id="audio-status" role="status">Play the sound, then choose an animal. You can replay it any time.</p></div><div class="choices" aria-label="Choose one of four animals">${game.choices.map((a,i)=>`<button class="choice" data-id="${a.id}">${img(a,'aria-hidden="true"')}<span class="choice-label"><span class="key" aria-hidden="true">${i+1}</span>${escapeHTML(a.name)}</span></button>`).join('')}</div></section>`;
  wirePlay(); main.querySelectorAll('.choice').forEach(b => b.onclick = () => answer(b.dataset.id)); focusMain();
}
function answer(id) {
  if (!game.answer(id)) return;
  stopAudio(); screen = 'reveal'; const a = game.current; const correct = game.selected === a.id;
  main.innerHTML = `${heading()}<section class="reveal"><figure class="reveal-photo">${img(a)}<figcaption>Photo: ${escapeHTML(a.credits.image.creator)} · ${escapeHTML(a.credits.image.license)}</figcaption></figure><div><p class="feedback ${correct?'':'wrong'}" role="status">${correct?'✓ Correct. Well heard!':`✕ Not quite. You chose ${escapeHTML(animals.find(a=>a.id===id).name)}.`}</p><p class="eyebrow">${correct?'THE SOUND BELONGS TO':'THE CORRECT ANSWER IS'}</p><h1>${escapeHTML(a.name)}</h1><p class="scientific">${escapeHTML(a.scientific)}</p><p class="fact">${escapeHTML(a.fact)}</p><div class="reveal-actions"><button class="primary" id="next">${game.index === animals.length-1?'SEE YOUR SCORE':'NEXT ANIMAL'} <span aria-hidden="true">→</span></button>${playButton()}</div><p id="audio-status" class="listen-help" role="status">Listen again, now that you know.</p></div></section>`;
  player.src = a.audio; wirePlay(); document.querySelector('#next').onclick = () => { const result=game.next(); result === 'finished' ? finish() : trial(); }; focusMain();
}
function finish() {
  stopAudio(); screen = 'finish'; const score=game.score;
  main.innerHTML = `<section class="finish"><p class="eyebrow">THE SOUNDS OF AUSTRALIA</p><div class="score-big">${score}<span> / ${animals.length}</span></div><h1>${score>=8?'An ear for the Australian wild.':score>=5?'A good ear. A few surprises.':'A whole new world of sound.'}</h1><p>${score===animals.length?'Every animal, recognised. Ready for another round?':'From melodic calls to unexpected mimicry, there’s always more to hear.'}</p><div class="results" aria-label="Your answers">${game.results.map((r,i)=>`<span class="result-dot ${r.correct?'yes':'no'}" title="${escapeHTML(animals.find(a=>a.id===r.id).name)}" aria-label="Animal ${i+1}: ${r.correct?'correct':'incorrect'}">${r.correct?'✓':'✕'}</span>`).join('')}</div><button class="primary large" id="restart">PLAY AGAIN <span aria-hidden="true">↗</span></button></section>`;
  document.querySelector('#restart').onclick = () => {game.restart();trial();}; focusMain();
}
function playbackState(active) {
  const b=document.querySelector('#play');if(!b)return;
  b.setAttribute('aria-pressed',String(active));b.querySelector('.play-icon').textContent=active?'■':'▶';b.querySelector('.play-label').textContent=active?'STOP SOUND':played?'REPLAY SOUND':'PLAY SOUND';
}
function wirePlay() {
  document.querySelector('#play').onclick = async () => {
    if(!player.paused){stopAudio();playbackState(false);return;}
    const token=++playbackToken; player.currentTime=0;
    try { await player.play(); if(token!==playbackToken)return; played=true; playbackState(true); document.querySelector('#audio-status').textContent='Listening… Tap stop to end playback.'; }
    catch(e){ if(token!==playbackToken)return; playbackState(false); document.querySelector('#audio-status').textContent='Sound couldn’t play. Check your device volume and connection, then tap to try again.'; }
  };
}
player.addEventListener('ended',()=>{playbackState(false);const s=document.querySelector('#audio-status');if(s)s.textContent='Tap to listen again.';});
player.addEventListener('error',()=>{playbackState(false);const s=document.querySelector('#audio-status');if(s)s.textContent='Audio unavailable. Reconnect and reload to download this sound.';});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAudio();playbackState(false);}});
document.addEventListener('keydown',e=>{
  if(document.querySelector('#credits').open || e.altKey || e.ctrlKey || e.metaKey || /INPUT|TEXTAREA/.test(e.target.tagName))return;
  if(screen==='trial' && /^[1-4]$/.test(e.key)){e.preventDefault();answer(game.choices[Number(e.key)-1].id);}
});
const credits=document.querySelector('#credits');
document.querySelector('#credit-list').innerHTML=animals.map(a=>`<article class="credit"><h3>${escapeHTML(a.name)}</h3>${['audio','image'].map(type=>{const c=a.credits[type];return `<p><strong>${type==='audio'?'Sound':'Photograph'}:</strong> ${escapeHTML(c.creator)} · <a href="${c.sourceUrl}" target="_blank" rel="noopener">Original source</a> · <a href="${c.licenseUrl}" target="_blank" rel="noopener">${escapeHTML(c.license)}</a><br>${escapeHTML(c.attribution)} ${escapeHTML(c.changes)}</p>`;}).join('')}</article>`).join('');
document.querySelector('#credits-open').onclick=()=>{stopAudio();playbackState(false);credits.showModal();};
document.querySelector('#credits-close').onclick=()=>credits.close();
credits.addEventListener('click',e=>{if(e.target===credits){const r=credits.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)credits.close();}});
landing();
