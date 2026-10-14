import type { Athlete } from './catalog';
export function cropRect(w:number,h:number,crop:Athlete['crop']){
 const size=Math.min(w,h)*crop[2];return [Math.max(0,Math.min(w-size,w*crop[0]-size/2)),Math.max(0,Math.min(h-size,h*crop[1]-size/2)),size,size] as const;
}
export function drawPhoto(canvas:HTMLCanvasElement,image:HTMLImageElement,athlete:Athlete,resolution:number|null){
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas indisponível');
 canvas.width=canvas.height=800;
 const crop=cropRect(image.naturalWidth,image.naturalHeight,athlete.crop);
 // Completion draws the original directly, with the exact same square crop.
 if(resolution===null){ctx.imageSmoothingEnabled=true;ctx.drawImage(image,...crop,0,0,800,800);return;}
 const small=document.createElement('canvas');small.width=small.height=resolution;
 const sc=small.getContext('2d');if(!sc)throw Error('Canvas indisponível');
 sc.drawImage(image,...crop,0,0,resolution,resolution);
 canvas.width=canvas.height=800;ctx.imageSmoothingEnabled=false;ctx.drawImage(small,0,0,800,800);
}
