import { catalog, type Athlete } from './catalog';
export const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function search(query:string, items:Athlete[]=catalog){
 const q=normalize(query);if(q.length<2)return [];
 return items.filter(a=>[a.name,a.fullName,...a.aliases].some(n=>normalize(n).includes(q))).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}
