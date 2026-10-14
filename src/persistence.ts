import { newGame, type Game } from './game';
import { localDate } from './daily';
import { catalog } from './catalog';
import { VISUAL_VERSION } from './visual';
export const STORAGE_KEY='quadra:v1';
export type Result={date:string;number:number;won:boolean;attempts:number};
export type Saved={version:1;game:Game;results:Result[]};
export type StorageLike=Pick<Storage,'getItem'|'setItem'>;
export function validGame(g:Game){
 if(!g||!/^\d{4}-\d{2}-\d{2}$/.test(g.date)||!Number.isFinite(Date.parse(g.date))||!Number.isInteger(g.number)||g.number<1||typeof g.catalogVersion!=='string'||!g.athlete||g.athlete.id!==g.athleteId||typeof g.athlete.name!=='string'||typeof g.athlete.photo!=='string'||!Array.isArray(g.athlete.crop)||g.athlete.crop.length!==3||!g.athlete.crop.every(Number.isFinite)||!Array.isArray(g.guesses)||g.guesses.length>6)return false;
 const ids=new Set<string>();
 for(const [i,a] of g.guesses.entries()){
  if(!a||typeof a.name!=='string'||!['wrong','correct','skip'].includes(a.kind))return false;
  if(a.kind==='skip'){if(a.id!==null)return false;}
  else {if(typeof a.id!=='string'||ids.has(a.id))return false;ids.add(a.id);if((a.kind==='correct')!==(a.id===g.athleteId))return false;}
  if(a.kind==='correct'&&i!==g.guesses.length-1)return false;
 }
 const expected=g.guesses.at(-1)?.kind==='correct'?'won':g.guesses.length===6?'lost':'playing';
 return g.status===expected;
}
export function load(storage:StorageLike,date=localDate()):{saved:Saved;warning:string}{
 try{
  const raw=storage.getItem(STORAGE_KEY); if(!raw)return {saved:{version:1,game:newGame(date),results:[]},warning:''};
  const parsed=JSON.parse(raw) as Saved;
  if(parsed.version!==1||!validGame(parsed.game)||!Array.isArray(parsed.results)||!parsed.results.every(r=>r&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&typeof r.won==='boolean'&&Number.isInteger(r.attempts)&&r.attempts>=1&&r.attempts<=6&&Number.isInteger(r.number)))throw Error();
  parsed.results=parsed.results.filter((r,i,arr)=>arr.findIndex(x=>x.date===r.date)===i);
  let warning='';
  if(parsed.game.visualVersion!==VISUAL_VERSION){
   // This explicit visual upgrade keeps the same athlete, date and all actions.
   // A replacement photograph carries its own complete credits into the snapshot.
   const current=catalog.find(a=>a.id===parsed.game.athleteId);
   if(current)parsed.game.athlete=structuredClone(current);
   parsed.game.visualVersion=VISUAL_VERSION;
   warning='Enquadramento atualizado. Seus palpites e resultados foram preservados.';
  }
  // Keep the snapshot of an unfinished game, even across catalog updates and midnight.
  if(parsed.game.status!=='playing'&&parsed.game.date!==date)parsed.game=newGame(date);
  return {saved:parsed,warning};
 }catch{return {saved:{version:1,game:newGame(date),results:[]},warning:'Não foi possível restaurar o progresso. Esta partida será iniciada novamente.'};}
}
export function record(saved:Saved):Saved{
 const g=saved.game;if(g.status==='playing'||saved.results.some(r=>r.date===g.date))return saved;
 return {...saved,results:[...saved.results,{date:g.date,number:g.number,won:g.status==='won',attempts:g.guesses.length}]};
}
export function save(storage:StorageLike,data:Saved){try{storage.setItem(STORAGE_KEY,JSON.stringify(record(data)));return true;}catch{return false;}}
