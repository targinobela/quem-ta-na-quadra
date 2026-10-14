import {describe,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {catalog} from './catalog';
import {drawPhoto,cropRect} from './pixel';
import {LEVELS,VISUAL_VERSION} from './visual';
import {newGame,play} from './game';
import {load} from './persistence';

describe('reconhecimento visual',()=>{
 it('oferece seis níveis legíveis com definição crescente antes da conclusão',()=>{
  expect(LEVELS).toEqual([32,48,72,100,150,220]);
  expect(LEVELS[0]).toBeGreaterThanOrEqual(32);expect(LEVELS[4]).toBeGreaterThanOrEqual(150);
 });
 it('mantém o mesmo quadrado de origem em todos os níveis e na revelação',()=>{
  const sc={drawImage:vi.fn()};const ctx={drawImage:vi.fn(),imageSmoothingEnabled:false};
  const small={width:0,height:0,getContext:()=>sc};
  vi.stubGlobal('document',{createElement:()=>small});
  const canvas={width:0,height:0,getContext:()=>ctx};const image={naturalWidth:827,naturalHeight:1201};
  const crop=cropRect(827,1201,catalog[0].crop);
  for(const level of LEVELS){drawPhoto(canvas as unknown as HTMLCanvasElement,image as HTMLImageElement,catalog[0],level);expect(sc.drawImage).toHaveBeenLastCalledWith(image,...crop,0,0,level,level);expect(ctx.imageSmoothingEnabled).toBe(false);}
  drawPhoto(canvas as unknown as HTMLCanvasElement,image as HTMLImageElement,catalog[0],null);
  expect(ctx.drawImage).toHaveBeenLastCalledWith(image,...crop,0,0,800,800);expect(ctx.imageSmoothingEnabled).toBe(true);
  vi.unstubAllGlobals();
 });
 it('atualiza uma partida antiga sem apagar palpites, resultado ou identidade',()=>{
  const g=play(newGame('2026-10-14'),null).game;g.visualVersion='legacy';g.athlete.crop=[.5,.5,1];
  const original=structuredClone(g);
  const stored={version:1,game:g,results:[]};const result=load({getItem:()=>JSON.stringify(stored),setItem:()=>{}},'2026-10-14');
  expect(result.saved.game.visualVersion).toBe(VISUAL_VERSION);
  expect(result.saved.game.guesses).toEqual(original.guesses);expect(result.saved.game.date).toBe(original.date);
  expect(result.saved.game.athleteId).toBe(original.athleteId);expect(result.saved.game.athlete.crop).toEqual(catalog.find(a=>a.id===g.athleteId)!.crop);
  expect(result.warning).toContain('preservados');
 });
 it('não confunde a revisão visual com uma troca de atleta ou calendário',()=>{
  const g=newGame('2026-10-14');g.visualVersion='legacy';g.athleteId=g.athlete.id='removed-athlete';
  const restored=load({getItem:()=>JSON.stringify({version:1,game:g,results:[]}),setItem:()=>{}},'2026-10-15').saved.game;
  expect(restored.date).toBe('2026-10-14');expect(restored.athlete).toEqual(g.athlete);
 });
 it('confina a arte ao espaço externo, desativa-a abaixo de 768 e não usa fixed',()=>{
  const css=readFileSync('src/style.css','utf8');
  expect(css).toContain('@media(max-width:767px){.court-art{display:none}}');
  expect(css).toContain('calc((100% - var(--content-width))/2)');
  expect(css).toContain('pointer-events:none');expect(css).toContain('overflow-x:clip');
  expect(css).not.toContain('position:fixed');expect(css).not.toMatch(/filter\s*:\s*blur/);
  for(const width of [360,390,768,1280]){
   const rail=Math.max(0,(width-1120)/2);const shellLeft=(width-Math.min(width,1120))/2;
   expect(rail).toBeLessThanOrEqual(shellLeft);expect(rail*2).toBeLessThanOrEqual(width);
  }
 });
 it('HTML e fontes da interface mantêm acentos e setas Unicode corretos',()=>{
  const html=readFileSync('index.html','utf8');const app=readFileSync('src/App.tsx','utf8');
  expect(html).toContain('charset="UTF-8"');expect(app).toContain('Quem é o atleta de hoje?');
  expect(app).toContain('Estatísticas');expect(app).toContain('↗');expect(app).toContain('→');
  expect(app).not.toMatch(/\uFFFD|\u00c3[\u0080-\u00bf]|\u00e2[\u0080-\u00bf]/);
 });
});
