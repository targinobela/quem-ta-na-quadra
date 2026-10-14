# Quem Tá na Quadra?

Um atleta de vôlei de quadra por dia. **A única pista é a fotografia.** Seis oportunidades, pixelização real e uma identidade gráfica preta e amarela com trajetórias em verde e azul. Sem dicas textuais, comparação de atributos, conta, ranking global ou backend.

## Executar

Node.js 22.12 ou superior (verificado com 24.13) e npm.

```powershell
cd C:\Users\isabe\Music\targinoworkspace\quem-ta-na-quadra
npm.cmd ci
npm.cmd run dev
```

Abra o endereço local informado pelo Vite. Dependências, fotografias e fonte já estão presentes no checkout local; `npm ci` prepara uma instalação nova.

```powershell
npm.cmd test
npm.cmd run build
```

O build estático fica em `dist/`. Fotos locais, sem hotlinks ou CORS externo. React 19, TypeScript, Vite e Vitest; jsdom é usado apenas para testes da interface.

## Regras e acessibilidade

Digite duas ou mais letras, selecione um nome no autocomplete e confirme. Selecionar não envia o palpite. Setas navegam; Enter seleciona a opção destacada, outro Enter ou o botão confirma. Escape fecha as sugestões. Busca ignora acentos, pontuação, caixa e espaços e considera nomes completos e apelidos de todo o catálogo ativo.

Erro e pulo consomem uma oportunidade e aumentam a resolução. Nome repetido, texto inválido ou falha de imagem/canvas não consomem tentativa. Não há cronômetro durante a partida. A foto nítida e o nome aparecem somente após acerto ou a sexta tentativa. Os créditos permanecem acessíveis, mesmo que o jogador escolha consultar possíveis spoilers.

O canvas reduz a foto para 32, 48, 72, 100, 150 e 220 pixels por lado e amplia sem suavização. O recorte permanece idêntico. Sem blur, animação que exponha o original ou ajuste pelo jogador. Labels, foco visível, navegação por teclado, diálogo modal e mensagens aria-live. A mecânica depende de reconhecimento visual e não oferece experiência equivalente para pessoas cegas.

## Catálogo e direitos

15 atletas e 15 fotografias verificadas nas páginas individuais do Wikimedia Commons em 14/10/2026: mulheres e homens, brasileiros e internacionais, atletas atuais e aposentados. Apenas vôlei de quadra. Catálogo em `src/catalog.ts`, originais em `public/photos/`, fonte Barlow Condensed local em `public/fonts/`. Veja [ASSET_LICENSES.md](ASSET_LICENSES.md) para todas as autorias, fontes, licenças e alterações. Licença MIT do código em `LICENSE`, separada das imagens e da fonte.

Para adicionar um atleta:

1. Abra a página individual da foto; confirme identidade, autoria, fonte e licença compatível com reprodução, hospedagem, distribuição e adaptações. Não basta creditar. Prefira CC0, CC BY ou CC BY-SA; preserve ShareAlike.
2. Acrescente a entrada em `src/catalog.ts`, com ID estável, nomes, aliases, autor, nome exato do arquivo e licença. O caminho é derivado do ID e extensão. Use `crop` como `[centroX, centroY, proporçãoDoLado]`, em coordenadas proporcionais.
3. Baixe o original autorizado. O script opcional `node scripts/download-assets.mjs` (Node 24 para importação de TypeScript) baixa arquivos faltantes sem substituir os presentes; observe limites do Commons e não execute downloads em paralelo.
4. Confira recorte e os seis níveis com fotos reais. Não use retratos artificiais. Não adicione nacionalidade, posição, idade ou clube ao jogo.
5. Atualize `CATALOG_VERSION`, execute `node scripts/asset-docs.mjs`, testes e build. A versão faz parte da seleção; mantenha IDs estáveis. Partidas iniciadas guardam um snapshot do atleta e da versão anterior.

## Desafio e armazenamento

Época: 14/10/2026, desafio #001. A data usa `America/Sao_Paulo`; muda à meia-noite. IDs ordenados, versão do catálogo e PRNG com semente definem uma permutação; cada ciclo percorre todos os atletas sem repetição e roda a ordem para evitar repetição na fronteira. Não usa `Math.random`. Reordenar o arquivo não muda o resultado. Uma aplicação estática depende do relógio do dispositivo; dados e resposta podem ser inspecionados pelo cliente, sem proteção contra trapaça.

`localStorage`, chave `quadra:v1`, guarda versão, data, número, ID, catálogo, snapshot do atleta, palpites, pulos, conclusão e resultados. Tentativa e nível são derivados da quantidade de ações, evitando campos redundantes inconsistentes. Armazenamento corrompido ou indisponível gera aviso e não quebra o jogo. Conclusões não são contadas duas vezes. Uma partida em andamento atravessa a meia-noite com a data original; depois oferece o desafio novo.

Estatísticas: desafios concluídos, vitórias, taxa de acerto, sequência atual, melhor sequência e distribuição de acertos. Derrota ou dia ausente interrompe a sequência; partida em andamento mantém a sequência de ontem. A contagem regressiva aparece somente ao concluir.

## Compartilhamento e hospedagem estática

Configure `VITE_PUBLIC_URL` num `.env.local` antes do build para definir o link público. Sem configuração, usa o endereço atual. O texto contém número, tentativas e quadrados, sem atleta ou fotografia. Tenta Web Share, depois clipboard; se falhar, oferece textarea para cópia manual.

Sirva `dist/` em qualquer hospedagem estática com HTTPS. Não precisa de servidor de aplicação ou variáveis secretas. Para subdiretório, gere com `npm.cmd run build -- --base=/seu-subdiretorio/`. Preserve arquivos locais, créditos e licenças; disponibilize este repositório/documentação junto à distribuição. Esta tarefa não realizou deploy, push ou publicação.

## Organização e verificação

`catalog.ts`: dados/licenças; `daily.ts`: seleção/data; `game.ts`: regras; `search.ts`: normalização; `pixel.ts`: canvas; `persistence.ts`: storage/resultados; `stats.ts`: estatísticas; `share.ts`: texto sem spoilers; `App.tsx`: interface; `style.css`: identidade responsiva.

Testes cobrem seleção determinística e ciclos, virada no fuso, seis chances, vitória/derrota, pulos, inválidos/repetidos, busca, restauração, corrupção de storage, estatísticas, sequências, compartilhamento e desenho do canvas. Testes DOM não substituem revisão visual em navegador real.

Não havia navegador conectado no ambiente (`apps: []`, `browsers: []`); a revisão da interface com capturas em 360 px, celular maior e desktop ficou pendente. Fotografias, recortes e níveis foram revisados em prancha separada (`qa/pixel-review.png`), que também é uma adaptação sujeita às licenças em ASSET_LICENSES.md. A referência visual mencionada no pedido não estava anexada como imagem acessível; a identidade segue a composição descrita no texto.

Projeto independente de fãs, sem vínculo com atletas, clubes, federações ou organizadores de competições.

## Revisão local da dificuldade

A progressão atual é 32, 48, 72, 100, 150 e 220 px. Os retratos foram reenquadrados individualmente para rosto e ombros. A revelação desenha o original diretamente no mesmo recorte. Não aplica blur. Uma atualização visual preserva as partidas antigas e avisa sobre o novo enquadramento.

Com o servidor de desenvolvimento ativo, abra `/tools/pixel-review.html` para comparar os seis níveis por atleta e `/tools/layout-review.html` para testar 360, 390, 768 e 1280 px com sugestões, vitória e derrota. São ferramentas locais, isoladas do progresso real e excluídas do build público. Consulte [qa/REVIEW.md](qa/REVIEW.md) para observações das fotografias e o limite de verificação no navegador.

`npm.cmd run check:encoding` valida UTF-8 e procura textos corrompidos. O build também executa esse verificador. A configuração do editor exige UTF-8. Ao hospedar, sirva HTML com `Content-Type: text/html; charset=utf-8` e sem cache permanente; reserve cache longo para JS/CSS com hash, para que o navegador receba os textos e a apresentação atualizados.
