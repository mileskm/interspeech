import assert from 'node:assert/strict';
import {Game} from '../js/game.js';
import {animals} from '../js/animals.js';
for(let seed=1;seed<=60;seed++){
 let n=seed; const random=()=>((n=(n*1664525+1013904223)>>>0)/4294967296);const g=new Game(animals,random);
 assert.equal(new Set(g.order.map(a=>a.id)).size,10);assert.equal(g.next(),false);
 for(let i=0;i<10;i++){assert.equal(g.choices.length,4);assert.equal(new Set(g.choices.map(a=>a.id)).size,4);assert.ok(g.choices.some(a=>a.id===g.current.id));const id=i%2===0?g.current.id:g.choices.find(a=>a.id!==g.current.id).id;assert.ok(g.answer(id));assert.equal(g.answer(id),false);assert.equal(g.next(),i===9?'finished':true);}
 assert.equal(g.score,5);g.restart();assert.equal(g.score,0);assert.equal(g.index,0);assert.equal(g.results.length,0);
}
console.log('PASS: 600 rounds; choices, mapping, single scoring, progress and restart');
