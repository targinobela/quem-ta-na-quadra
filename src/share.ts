import type { Game } from './game';
export function shareText(game:Game,url:string){
 return `Quem Tá na Quadra? #${String(game.number).padStart(3,'0')}\n${game.status==='won'?`Acertei em ${game.guesses.length}/6`:'X/6'}\n${game.guesses.map(g=>g.kind==='correct'?'🟩':'⬜').join('')}\n${url}`;
}
