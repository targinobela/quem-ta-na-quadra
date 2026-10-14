// @vitest-environment jsdom
import React, {act} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import App from './App';
import {catalog} from './catalog';
import {newGame,play} from './game';
import {STORAGE_KEY} from './persistence';
let root:Root;let host:HTMLDivElement;let failImage=false;
async function mount(){host=document.createElement('div');document.body.append(host);root=createRoot(host);await act(async()=>{root.render(<App/>);});}
async function click(button:Element){await act(async()=>{button.dispatchEvent(new MouseEvent('click',{bubbles:true}));});}
async function type(value:string){const input=host.querySelector('input')!;await act(async()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));});}
async function key(value:string){await act(async()=>{host.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown',{key:value,bubbles:true}));});}
async function submit(){await act(async()=>{host.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});}
function button(label:string){return [...host.querySelectorAll('button')].find(b=>b.textContent?.includes(label))!;}
beforeEach(()=>{
 vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-14T15:00:00Z'));localStorage.clear();failImage=false;
 vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT',true);
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({drawImage:vi.fn(),imageSmoothingEnabled:true} as unknown as CanvasRenderingContext2D);
 vi.stubGlobal('Image',class {naturalWidth=1000;naturalHeight=1500;onload:(()=>void)|null=null;onerror:(()=>void)|null=null;set src(_value:string){Promise.resolve().then(()=>failImage?this.onerror?.():this.onload?.());}});
 HTMLDialogElement.prototype.showModal=function(){this.open=true;};HTMLDialogElement.prototype.close=function(){this.open=false;};
});
afterEach(async()=>{if(root)await act(async()=>root.unmount());host?.remove();vi.restoreAllMocks();vi.unstubAllGlobals();vi.useRealTimers();});
describe('interface',()=>{
 it('mantém a resposta fora do texto e rótulos durante a partida',async()=>{await mount();expect(host.querySelector('canvas')?.getAttribute('aria-label')).toBe('Fotografia pixelada do atleta de hoje');expect(host.textContent).not.toContain(newGame('2026-10-14').athlete.name);expect(host.textContent).toContain('Tentativa 1 de 6');});
 it('não consome uma oportunidade com texto não selecionado',async()=>{await mount();await type('nome inventado');await submit();expect(host.textContent).toContain('Selecione um atleta da lista');expect(host.textContent).toContain('Tentativa 1 de 6');});
 it('autocomplete usa setas e Enter, seleciona sem enviar e permite vitória',async()=>{await mount();const answer=newGame('2026-10-14').athlete;await type(answer.name);expect(host.querySelector('[role=listbox]')).not.toBeNull();await key('ArrowDown');expect(host.querySelector('input')?.getAttribute('aria-activedescendant')).toBe(`option-${answer.id}`);await key('Enter');expect(host.textContent).toContain('Tentativa 1 de 6');expect(host.querySelector('[role=listbox]')).toBeNull();await submit();expect(host.textContent).toContain('Acertei em 1 de 6');expect(host.querySelector('input')).toBeNull();expect(host.querySelector('canvas')?.getAttribute('aria-label')).toBe(`Fotografia de ${answer.name}`);expect(button('Compartilhar')).toBeDefined();});
 it('Escape fecha sugestões e repetição não consome tentativa',async()=>{await mount();const wrong=catalog.find(a=>a.id!==newGame('2026-10-14').athleteId)!;await type(wrong.name);await key('Escape');expect(host.querySelector('[role=listbox]')).toBeNull();await type(wrong.name);await key('ArrowDown');await key('Enter');await submit();expect(host.textContent).toContain('Tentativa 2 de 6');await type(wrong.name);await key('ArrowDown');await key('Enter');await submit();expect(host.textContent).toContain('Você já tentou esse atleta');expect(host.textContent).toContain('Tentativa 2 de 6');});
 it('seis pulos encerram a partida e o recarregamento restaura a conclusão',async()=>{await mount();for(let i=0;i<6;i++)await click(button('Pular'));expect(host.textContent).toContain('Partida concluída');expect(host.querySelector('input')).toBeNull();expect(host.querySelectorAll('.history li')).toHaveLength(6);await act(async()=>root.unmount());root=createRoot(host);await act(async()=>root.render(<App/>));expect(host.textContent).toContain('Partida concluída');expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).results).toHaveLength(1);});
 it('restaura a tentativa após recarregar no meio da partida',async()=>{await mount();await click(button('Pular'));await act(async()=>root.unmount());root=createRoot(host);await act(async()=>root.render(<App/>));expect(host.textContent).toContain('Tentativa 2 de 6');expect(host.querySelectorAll('.history li')).toHaveLength(1);});
 it('falha técnica bloqueia controles sem consumir tentativa',async()=>{failImage=true;await mount();expect(host.textContent).toContain('A fotografia não carregou');expect(button('Confirmar').disabled).toBe(true);expect(button('Pular').disabled).toBe(true);expect(host.textContent).toContain('Tentativa 1 de 6');failImage=false;await click(button('Tentar carregar'));expect(button('Confirmar').disabled).toBe(false);});
 it('créditos estão disponíveis e incluem todos os arquivos e licenças',async()=>{await mount();await click(button('Créditos'));expect(host.querySelector('dialog')?.open).toBe(true);expect(host.querySelectorAll('.credit')).toHaveLength(16);expect(host.querySelectorAll('.credit a')).toHaveLength(31);expect(host.textContent).toContain('pode revelar a resposta');});
 it('atravessa meia-noite mantendo a data e oferece o novo desafio depois',async()=>{await mount();await click(button('Pular'));vi.setSystemTime(new Date('2026-10-15T03:00:01Z'));await act(async()=>{vi.advanceTimersByTime(1000);});expect(host.textContent).toContain('Um novo dia começou');for(let i=0;i<5;i++)await click(button('Pular'));expect(host.textContent).toContain('Jogar o desafio de hoje');expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).results[0].date).toBe('2026-10-14');await click(button('Jogar o desafio de hoje'));expect(host.textContent).toContain('#002');expect(host.textContent).toContain('Tentativa 1 de 6');});
 it('oferece cópia manual se compartilhamento e clipboard falharem',async()=>{const g=newGame('2026-10-14');localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,game:play(g,g.athleteId).game,results:[]}));await mount();Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error())}});await click(button('Compartilhar'));const text=host.querySelector('textarea')?.value;expect(text).toContain('Acertei em 1/6');expect(text).not.toContain(g.athlete.name);});
});
