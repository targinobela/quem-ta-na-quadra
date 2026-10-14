import { dayIndex } from './daily';
import type { Result } from './persistence';
export function statistics(results:Result[],today:string){
 const sorted=[...results].sort((a,b)=>a.date.localeCompare(b.date));
 let streak=0,best=0,previous=-Infinity;
 const distribution=[0,0,0,0,0,0];
 for(const r of sorted){const d=dayIndex(r.date);streak=r.won?(previous===d-1?streak+1:1):0;best=Math.max(best,streak);previous=d;if(r.won)distribution[r.attempts-1]++;}
 const latest=sorted.at(-1);const current=latest&&dayIndex(latest.date)>=dayIndex(today)-1&&dayIndex(latest.date)<=dayIndex(today)?streak:0;
 const wins=sorted.filter(r=>r.won).length;
 return {total:sorted.length,wins,rate:sorted.length?Math.round(wins/sorted.length*100):0,current,best,distribution};
}
