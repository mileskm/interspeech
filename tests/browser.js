import {animals} from '../js/animals.js';
const log=document.querySelector('#log'),frame=document.querySelector('#app');
const report=s=>{log.textContent+='\n'+s;};const assert=(ok,msg)=>{if(!ok)throw Error(msg);};const wait=ms=>new Promise(r=>setTimeout(r,ms));
document.querySelector('#run').onclick=async()=>{log.textContent='Running…';try{
 const ctx=new AudioContext();
 for(const a of animals){const response=await fetch('../'+a.audio);assert(response.ok,'Audio HTTP '+a.id);const decoded=await ctx.decodeAudioData(await response.arrayBuffer());assert(decoded.duration>=1.5&&decoded.duration<8.2,'Duration '+a.id);const im=new Image();im.src='../'+a.image;await im.decode();assert(im.naturalWidth>500,'Image '+a.id);report('PASS media: '+a.name+' · '+decoded.duration.toFixed(2)+' s · '+im.naturalWidth+' px');}await ctx.close();
 let d=frame.contentDocument;d.querySelector('#start').click();let score=0;let order=[];
 for(let i=0;i<10;i++){
  const current=animals.find(a=>d.querySelector('#stimulus').src.endsWith('/audio/'+a.id+'.mp3'));assert(current,'Audio mapping');order.push(current.id);
  const buttons=[...d.querySelectorAll('.choice')];assert(buttons.length===4,'Four choices');assert(new Set(buttons.map(b=>b.dataset.id)).size===4,'Unique choices');assert(buttons.some(b=>b.dataset.id===current.id),'Correct answer offered');
  const selected=i%2===0?current.id:buttons.find(b=>b.dataset.id!==current.id).dataset.id;buttons.find(b=>b.dataset.id===selected).click();if(i%2===0)score++;
  assert(d.querySelector('.reveal h1').textContent===current.name,'Reveal matches stimulus');assert(d.querySelector('.score').textContent==='Score: '+score,'Score');d.querySelector('#next').click();
 }
 assert(new Set(order).size===10,'No repeated rounds');assert(d.querySelector('.score-big').textContent==='5 / 10','Final score');d.querySelector('#restart').click();assert(d.querySelector('.score').textContent==='Score: 0','Restart resets score');report('PASS full ten-round game, audio-answer mapping, correct/incorrect reveals, scoring and restart');
 d.querySelector('#credits-open').click();assert(d.querySelector('#credits').open,'Credits open');assert(d.querySelectorAll('.credit').length===10,'All credits');d.querySelector('#credits-close').click();assert(!d.querySelector('#credits').open,'Credits close');report('PASS credits open, close and all 20 attributions');
 for(const [width,height] of [[1024,768],[1180,820],[1366,1024],[768,1024],[390,844]]){frame.style.width=width+'px';frame.style.height=height+'px';await wait(100);assert(d.documentElement.scrollWidth<=width,'Horizontal overflow at '+width);if(width>=1024)assert([...d.querySelectorAll('.choice')].every(b=>b.getBoundingClientRect().bottom<height),'Choices offscreen at '+width);report('PASS responsive layout '+width+' × '+height);}
 frame.style.width='1180px';frame.style.height='820px';report('ALL CHECKS PASSED. User-gesture playback should also be checked in the game.');
 }catch(e){report('FAIL: '+e.stack);}};
