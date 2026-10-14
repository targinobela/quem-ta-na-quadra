import React from 'react';
import {createRoot} from 'react-dom/client';
import App from '../src/App';
import {newGame,play} from '../src/game';
import {localDate} from '../src/daily';
import {record} from '../src/persistence';

if(!import.meta.env.DEV)throw Error('Fixture exclusivamente local.');
const scenario=new URLSearchParams(location.search).get('state')||'suggestions';
let game=newGame(localDate());
if(scenario==='won')game=play(game,game.athleteId).game;
if(scenario==='lost')for(let i=0;i<6;i++)game=play(game,null).game;
const saved=record({version:1,game,results:[]});
createRoot(document.querySelector('#root')!).render(<App review={{saved,query:scenario==='suggestions'?'ga':''}}/>);
// Inspect the actual rendered rectangles, including all content after the game grows.
function inspect(){
 const shell=document.querySelector('.shell')?.getBoundingClientRect();if(!shell)return;
 const decoration=document.querySelector<HTMLElement>('.court-art')!;
 const visible=getComputedStyle(decoration).display!=='none';
 const rails=[...document.querySelectorAll('.court-art svg')].map(svg=>svg.getBoundingClientRect());
 const marginsOnly=rails.every(rail=>rail.width<1||rail.right<=shell.left+.5||rail.left>=shell.right-.5);
 const scrollFree=document.documentElement.scrollWidth<=innerWidth;
 const noMobileArt=innerWidth>=768||!visible;
 const pointerSafe=getComputedStyle(decoration).pointerEvents==='none';
 const textClean=!/\uFFFD|\u00c3[\u0080-\u00bf]|\u00e2[\u0080-\u00bf]/.test(document.body.textContent||'');
 parent.postMessage({type:'quadra-layout-review',width:innerWidth,scenario,scrollFree,marginsOnly,noMobileArt,pointerSafe,textClean,height:document.documentElement.scrollHeight},location.origin);
}
const observer=new ResizeObserver(inspect);observer.observe(document.documentElement);
setTimeout(inspect,1000);
