import { catalog, CATALOG_VERSION } from './catalog';
export const EPOCH = '2026-10-14';
export const dayIndex = (date: string) => Math.floor(Date.parse(date+'T00:00:00Z')/86400000);
export function localDate(now = new Date()): string {
 const p = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 return ['year','month','day'].map(k=>p.find(x=>x.type===k)!.value).join('-');
}
function hash(s:string){let h=2166136261; for(const c of s) h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
// A seeded permutation of a sorted ID list; cycle rotation prevents boundary repeats.
export function cycleOrder(cycle:number, ids=catalog.map(a=>a.id), version=CATALOG_VERSION):string[]{
 const base=[...ids].sort(); let seed=hash(version);
 for(let i=base.length-1;i>0;i--){ seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[base[i],base[j]]=[base[j],base[i]]; }
 if(base.length<3) return base;
 // For three or more items, advancing one position cannot repeat the final ID.
 const offset=((cycle%base.length)+base.length)%base.length;
 return base.slice(offset).concat(base.slice(0,offset));
}
export function challenge(date=localDate(), ids=catalog.map(a=>a.id), version=CATALOG_VERSION){
 const index=Math.max(0,dayIndex(date)-dayIndex(EPOCH));
 return {date,number:index+1,athleteId:cycleOrder(Math.floor(index/ids.length),ids,version)[index%ids.length],catalogVersion:version};
}
export function countdown(now=new Date()){
 const date=localDate(now);const next=new Date((dayIndex(date)+1)*86400000+3*3600000);
 const seconds=Math.max(0,Math.ceil((+next-+now)/1000));
 return [Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
}
