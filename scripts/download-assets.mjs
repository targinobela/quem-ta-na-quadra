import { writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import {catalog} from '../src/catalog.ts';
const files = catalog.map(a=>[a.photo,a.file]);
await mkdir('public/photos',{recursive:true});
for(const [path,name] of files){
 try {await access('public/'+path);continue;}catch{}
 const hash=createHash('md5').update(name.replaceAll(' ','_')).digest('hex');
 const url=`https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0,2)}/${encodeURIComponent(name.replaceAll(' ','_'))}`;
 const res=await fetch(url,{headers:{'User-Agent':'QuemTaNaQuadra/1.0 (local educational game; asset verification)'}});
 if(!res.ok) { console.log(path, res.status); continue; }
 await writeFile(`public/${path}`,new Uint8Array(await res.arrayBuffer()));
 console.log(path, 'downloaded');
 await new Promise(resolve=>setTimeout(resolve,10000));
}
for(const [name,url] of [['BarlowCondensed-Bold.ttf','https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/BarlowCondensed-Bold.ttf'],['OFL.txt','https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/OFL.txt']]){
 const res=await fetch(url); if(!res.ok) throw new Error('font '+res.status); await writeFile(`public/fonts/${name}`,new Uint8Array(await res.arrayBuffer()));
}

