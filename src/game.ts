import { catalog, type Athlete } from './catalog';
import { challenge } from './daily';
import { VISUAL_VERSION } from './visual';
export { LEVELS } from './visual';
export type Guess={id:string|null;name:string;kind:'wrong'|'skip'|'correct'};
export type Game=ReturnType<typeof challenge>&{visualVersion:string;athlete:Athlete;guesses:Guess[];status:'playing'|'won'|'lost'};
export function newGame(date?:string):Game{const c=challenge(date);return {...c,visualVersion:VISUAL_VERSION,athlete:structuredClone(catalog.find(a=>a.id===c.athleteId)!),guesses:[],status:'playing'};}
export function play(game:Game,id:string|null):{game:Game;message:string}{
 if(game.status!=='playing')return {game,message:'Este desafio já terminou.'};
 const a=id===game.athleteId?game.athlete:catalog.find(a=>a.id===id);
 if(id!==null&&!a)return {game,message:'Selecione um atleta da lista.'};
 if(id!==null&&game.guesses.some(g=>g.id===id))return {game,message:'Você já tentou esse atleta. Escolha outro nome.'};
 const kind=id===game.athleteId?'correct':id===null?'skip':'wrong';
 const guesses=[...game.guesses,{id,name:a?.name??'Tentativa pulada',kind}] as Guess[];
 const status=kind==='correct'?'won':guesses.length===6?'lost':'playing';
 return {game:{...game,guesses,status},message:status==='won'?'Boa! Você acertou.':status==='lost'?'Por hoje, é isso. Amanhã tem mais.':kind==='skip'?'Tentativa pulada. A imagem ficou mais definida.':'Não foi dessa vez.'};
}
