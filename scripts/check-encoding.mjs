import {readFile,readdir} from 'node:fs/promises';
import {extname,join} from 'node:path';
const decoder=new TextDecoder('utf-8',{fatal:true});
const mojibake=/\uFFFD|\u00c3[\u0080-\u00bf]|\u00c2[\u0080-\u00bf]|\u00e2[\u0080-\u00bf]|\u00f0\u0178/;
async function inspect(path){
 const content=decoder.decode(await readFile(path));
 if(mojibake.test(content))throw Error(`Texto corrompido: ${path}`);
 if(extname(path)==='.html'&&!/<meta\s+charset=["']UTF-8["']/i.test(content))throw Error(`HTML sem charset UTF-8: ${path}`);
}
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){const path=join(dir,item.name);if(item.isDirectory())await walk(path);else if(/\.(tsx?|mjs|css|html|md|json|txt|ps1)$/.test(path))await inspect(path);}}
for(const dir of ['src','tools','scripts','public'])await walk(dir);
for(const path of ['index.html','readme.md','ASSET_LICENSES.md','package.json','tsconfig.json'])await inspect(path);
console.log('UTF-8 válido; HTML com charset; nenhum padrão de texto corrompido.');
