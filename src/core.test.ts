import { describe,it,expect,vi } from 'vitest';
import { catalog, CATALOG_VERSION } from './catalog';
import { challenge,cycleOrder,localDate,countdown } from './daily';
import { newGame,play,LEVELS } from './game';
import { normalize,search } from './search';
import { load,save,record,STORAGE_KEY,type Saved } from './persistence';
import { statistics } from './stats';
import { shareText } from './share';
import { cropRect,drawPhoto } from './pixel';
const date='2026-10-14';
function memory(){let value:string|null=null;return {getItem:()=>value,setItem:(_k:string,v:string)=>{value=v;}};}
describe('desafio diário',()=>{
 it('é determinístico e independente da ordem do catálogo',()=>{const ids=catalog.map(a=>a.id);expect(challenge(date,ids)).toEqual(challenge(date,ids.reverse()));expect(challenge(date)).toEqual(challenge(date));});
 it('não repete dentro do ciclo ou entre ciclos, incluindo o wraparound',()=>{for(let n=2;n<=25;n++){const ids=Array.from({length:n},(_,i)=>String(i));for(let cycle=0;cycle<100;cycle++){const order=cycleOrder(cycle,ids);expect(new Set(order).size).toBe(n);expect(order.at(-1)).not.toBe(cycleOrder(cycle+1,ids)[0]);}}});
 it('usa a versão do catálogo como semente',()=>{expect(cycleOrder(0,undefined,'a')).not.toEqual(cycleOrder(0,undefined,'b'));});
 it('vira o dia às 03:00 UTC em São Paulo',()=>{expect(localDate(new Date('2026-10-15T02:59:59Z'))).toBe(date);expect(localDate(new Date('2026-10-15T03:00:00Z'))).toBe('2026-10-15');});
 it('numera desde a data inicial e conta até meia-noite',()=>{expect(challenge(date).number).toBe(1);expect(challenge('2026-10-15').number).toBe(2);expect(countdown(new Date('2026-10-15T02:59:59Z'))).toBe('00:00:01');expect(countdown(new Date('2026-10-15T03:00:00Z'))).toBe('24:00:00');});
});
describe('partida',()=>{
 it('inicia vazia com seis resoluções crescentes',()=>{expect(newGame(date).guesses).toEqual([]);expect(LEVELS).toEqual([32,48,72,100,150,220]);});
 it('erro e pulo avançam uma tentativa e guardam apenas o nome',()=>{let g=newGame(date);const wrong=catalog.find(a=>a.id!==g.athleteId)!;g=play(g,wrong.id).game;expect(g.guesses[0]).toEqual({id:wrong.id,name:wrong.name,kind:'wrong'});g=play(g,null).game;expect(g.guesses[1].kind).toBe('skip');expect(g.status).toBe('playing');});
 it('palpite inválido ou repetido não consome oportunidade',()=>{let g=newGame(date);expect(play(g,'inexistente').game).toBe(g);g=play(g,catalog.find(a=>a.id!==g.athleteId)!.id).game;expect(play(g,g.guesses[0].id).game).toBe(g);});
 it('vence pelo ID e encerra novos palpites',()=>{const g=newGame(date);const win=play(g,g.athleteId).game;expect(win.status).toBe('won');expect(win.guesses.length).toBe(1);expect(play(win,null).game).toBe(win);});
 it('perde na sexta oportunidade e não permite a sétima',()=>{let g=newGame(date);for(let i=0;i<5;i++)g=play(g,null).game;expect(g.status).toBe('playing');g=play(g,null).game;expect(g.status).toBe('lost');expect(g.guesses).toHaveLength(6);expect(play(g,null).game).toBe(g);});
 it('ainda permite acertar na sexta chance',()=>{let g=newGame(date);for(let i=0;i<5;i++)g=play(g,null).game;g=play(g,g.athleteId).game;expect(g.status).toBe('won');expect(g.guesses).toHaveLength(6);});
 it('preserva o atleta removido do catálogo através do snapshot',()=>{const g=newGame(date);g.athleteId=g.athlete.id='snapshot';expect(play(g,'snapshot').game.status).toBe('won');});
});
describe('busca',()=>{
 it('ignora acentos, espaços e pontuação',()=>{expect(normalize('  Sérgio!  Santos ')).toBe('sergiosantos');expect(search('SÉRGIO')[0].id).toBe('serginho');expect(search('n gapeth')[0].id).toBe('ngapeth');});
 it('busca nomes completos e apelidos no catálogo inteiro',()=>{expect(search('bruninho')[0].id).toBe('bruno');expect(search('escadinha')[0].id).toBe('serginho');expect(search('Gilberto Amauri')[0].id).toBe('giba');expect(search('ga').length).toBeGreaterThan(1);});
 it('exige dois caracteres e não faz aproximação excessiva',()=>{expect(search('g')).toEqual([]);expect(search('gabbiiii')).toEqual([]);});
});
describe('persistência',()=>{
 it('restaura a partida sem alterar data e versão',()=>{const s=memory();const saved:Saved={version:1,game:play(newGame(date),null).game,results:[]};saved.game.catalogVersion='versão anterior';save(s,saved);expect(load(s,'2026-10-15').saved.game).toEqual(saved.game);});
 it('começa o dia novo quando o anterior já terminou',()=>{const s=memory();const g=newGame(date);save(s,{version:1,game:play(g,g.athleteId).game,results:[]});const data=load(s,'2026-10-15').saved;expect(data.game.date).toBe('2026-10-15');expect(data.results).toHaveLength(1);});
 it('mantém a conclusão ao recarregar no mesmo dia',()=>{const s=memory();const g=newGame(date);const won=play(g,g.athleteId).game;save(s,{version:1,game:won,results:[]});expect(load(s,date).saved.game.status).toBe('won');});
 it('não duplica o resultado',()=>{const g=newGame(date);const s:Saved={version:1,game:play(g,g.athleteId).game,results:[]};expect(record(record(s)).results).toHaveLength(1);});
 it.each(['{','null','{}','{"version":999}','{"version":1,"game":{},"results":[]}'])('tolera armazenamento inválido %s',raw=>{const s=memory();s.setItem(STORAGE_KEY,raw);expect(load(s,date).saved.game.status).toBe('playing');expect(load(s,date).warning).not.toBe('');});
 it('não aceita uma partida com estado inconsistente',()=>{const s=memory();const g=newGame(date);g.status='won';s.setItem(STORAGE_KEY,JSON.stringify({version:1,game:g,results:[]}));expect(load(s,date).warning).not.toBe('');});
 it('tolera armazenamento indisponível',()=>{const s={getItem:()=>{throw Error();},setItem:()=>{throw Error();}};expect(load(s,date).saved.game.status).toBe('playing');expect(save(s,{version:1,game:newGame(date),results:[]})).toBe(false);});
});
describe('estatísticas',()=>{
 const results=[{date,number:1,won:true,attempts:2},{date:'2026-10-15',number:2,won:true,attempts:4},{date:'2026-10-16',number:3,won:false,attempts:6},{date:'2026-10-18',number:5,won:true,attempts:1}];
 it('calcula resultados, taxa e distribuição',()=>{expect(statistics(results,'2026-10-18')).toEqual({total:4,wins:3,rate:75,current:1,best:2,distribution:[1,1,0,1,0,0]});});
 it('preserva ontem enquanto hoje está em andamento',()=>{expect(statistics(results.slice(0,2),'2026-10-16').current).toBe(2);});
 it('derrota e dia não jogado interrompem sequência',()=>{expect(statistics(results.slice(0,3),'2026-10-16').current).toBe(0);expect(statistics(results.slice(0,2),'2026-10-17').current).toBe(0);});
 it('começa com zero, sem dividir por zero',()=>{expect(statistics([],date).rate).toBe(0);});
});
describe('compartilhamento',()=>{
 it('vitória inclui apenas número, tentativas, marcadores e URL',()=>{const g=newGame(date);const text=shareText(play(g,g.athleteId).game,'https://example.com');expect(text).toContain('Acertei em 1/6');expect(text).toContain('🟩');expect(text).not.toContain(g.athlete.name);expect(text).not.toContain(g.athleteId);expect(text).toContain('https://example.com');});
 it('derrota mostra X/6 e seis marcadores sem spoilers',()=>{let g=newGame(date);for(let i=0;i<6;i++)g=play(g,null).game;expect(shareText(g,'https://example.com')).toContain('X/6\n⬜⬜⬜⬜⬜⬜');});
});
describe('pixelização',()=>{
 it('mantém um recorte quadrado dentro da foto',()=>{for(const a of catalog){const [x,y,w,h]=cropRect(900,1500,a.crop);expect(w).toBe(h);expect(x).toBeGreaterThanOrEqual(0);expect(y).toBeGreaterThanOrEqual(0);expect(x+w).toBeLessThanOrEqual(900);expect(y+h).toBeLessThanOrEqual(1500);}});
 it('desenha cada nível reduzido e amplia sem suavização',()=>{const sc={drawImage:vi.fn()};const ctx={drawImage:vi.fn(),imageSmoothingEnabled:true};const small={width:0,height:0,getContext:()=>sc};vi.stubGlobal('document',{createElement:()=>small});const canvas={width:0,height:0,getContext:()=>ctx};const image={naturalWidth:900,naturalHeight:1500};for(const res of [...LEVELS,800]){drawPhoto(canvas as unknown as HTMLCanvasElement,image as HTMLImageElement,catalog[0],res);expect(small.width).toBe(res);expect(small.height).toBe(res);expect(ctx.imageSmoothingEnabled).toBe(false);expect(ctx.drawImage).toHaveBeenLastCalledWith(small,0,0,800,800);}vi.unstubAllGlobals();});
 it('sinaliza falha técnica de canvas',()=>{expect(()=>drawPhoto({getContext:()=>null} as unknown as HTMLCanvasElement,{} as HTMLImageElement,catalog[0],8)).toThrow('Canvas indisponível');});
});
it('catálogo possui IDs únicos e créditos completos',()=>{expect(new Set(catalog.map(a=>a.id)).size).toBe(catalog.length);for(const a of catalog){expect(a.author.length).toBeGreaterThan(0);expect(a.licenseUrl).toMatch(/^https:\/\/creativecommons/);expect(a.verified).toBe(date);}expect(CATALOG_VERSION).toBe('2026-10-14.1');});
