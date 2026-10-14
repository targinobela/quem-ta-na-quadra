import { catalog } from '../src/catalog';
import { drawPhoto } from '../src/pixel';
import { LEVELS, VISUAL_VERSION } from '../src/visual';

if (!import.meta.env.DEV) throw new Error('Esta ferramenta é exclusiva do desenvolvimento local.');
const review = document.querySelector<HTMLDivElement>('#review')!;
const notes: Record<string, string> = {
  bruno: 'Fonte de 400 × 300 px: já corta um pouco o topo do cabelo. Mantida porque o rosto é frontal, os ombros aparecem e as últimas tentativas se aproximam da definição da fonte.',
  jaqueline: 'Fonte estreita de 282 px, em três quartos. Não há detalhe para ampliar a nitidez além do original; o rosto maior torna a primeira tentativa mais fácil que a média.',
  thaisa: 'Retrato pequeno, com foco naturalmente suave. Identificável pelo cabelo, rosto e ombros; a última tentativa não pode recuperar detalhes ausentes na fonte.',
  giba: 'Rosto de perfil e foto granulada. Corpo inteiro excluído do recorte. Cabelo e contorno facial disponíveis desde o primeiro nível.',
  saori: 'Foto de ação: rosto menor na fonte. Recorte apertado preserva cabeça, cabelo e ombros; braços e corpo inteiro foram excluídos.',
};
for (const athlete of catalog) {
  const section = document.createElement('section');
  const title = document.createElement('h2'); title.textContent = athlete.name;
  const note = document.createElement('p'); note.className='note';
  note.textContent = notes[athlete.id] || 'Revisado na prancha: cabeça e ombros preservados; cabelo e contorno facial reconhecíveis no nível 32, com boa definição nos níveis 150 e 220.';
  const strip = document.createElement('div'); strip.className='strip';
  const image = new Image();
  image.onload = () => {
    for (const [i, resolution] of [...LEVELS, null].entries()) {
      const figure=document.createElement('figure');const canvas=document.createElement('canvas');
      const caption=document.createElement('figcaption');
      caption.textContent=resolution===null?'Original · mesmo recorte':`Tentativa ${i+1} · ${resolution} × ${resolution}`;
      drawPhoto(canvas,image,athlete,resolution);figure.append(canvas,caption);strip.append(figure);
    }
  };
  image.onerror=()=>{note.textContent='FOTO INDISPONÍVEL: não aprovar este atleta.';};
  image.src=import.meta.env.BASE_URL+athlete.photo;
  const credits=document.createElement('p');credits.className='credits';
  credits.textContent=`${athlete.author} · ${athlete.license} · ${VISUAL_VERSION} · crop ${athlete.crop.join(', ')}`;
  const link=document.createElement('a');link.href=athlete.identitySource;link.textContent='Arquivo original';link.target='_blank';link.rel='noreferrer';
  section.append(title,note,strip,credits,link);review.append(section);
}
document.querySelector<HTMLSelectElement>('#size')!.addEventListener('change',event=>{
  document.documentElement.style.setProperty('--photo-size',`${(event.target as HTMLSelectElement).value}px`);
});
