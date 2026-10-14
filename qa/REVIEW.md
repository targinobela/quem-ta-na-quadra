# Revisão visual — 14/10/2026

Progressão: 32, 48, 72, 100, 150 e 220 px por lado. Conclusão: desenho direto da imagem original, mantendo exatamente o mesmo recorte quadrado. Sem blur adicional; nenhuma imagem é esticada.

Os 15 atletas foram revisados na prancha `pixel-review.png`. A primeira tentativa agora preserva cabelo, contorno do rosto, direção do olhar e ombros. As duas últimas são bastante reconhecíveis. Gabi, Giba, Kim, Serginho, Garay, Ivan e Saori tiveram o corpo/cenário reduzido de forma significativa. Os demais receberam alinhamento individual. Após uma primeira revisão, Gabi, Giba e Saori foram apertados novamente para equilibrar o tamanho do rosto e reduzir pessoas no fundo.

O close anterior de Kurek foi rejeitado: o recorte quadrado cortava cabelo e queixo, mostrando um rosto desproporcionalmente grande. Foi substituído por `Bartosz Kurek 2012.jpg`, de Anna Kłeczek (Nula), CC BY-SA 3.0. A página individual foi consultada via HTTPS e a seção de licença confirma autoria, fonte própria e autorização para adaptação. O novo original foi revisado antes da inclusão. Veja ASSET_LICENSES.md.

Limites das fontes preservadas: Bruno tem apenas 400 × 300 px e o original corta ligeiramente o cabelo; Jaqueline é um retrato estreito de 282 px; Thaísa tem foco naturalmente suave; Giba é de perfil e tem granulação. Esses limites são identificados na ferramenta, sem tentar inventar detalhes ou acrescentar desfoque. Não impedem reconhecimento nas últimas tentativas, mas podem produzir dificuldades diferentes entre atletas.

## Ferramentas privadas de desenvolvimento

Com `npm.cmd run dev`:

- `/tools/pixel-review.html`: seis níveis e original lado a lado, por atleta, usando a função de canvas real do jogo. Permite avaliar a fotografia em tamanhos correspondentes a telas de 360, 390, 768 e 1280 px.
- `/tools/layout-review.html`: fixture isolada com as quatro larguras, primeira tentativa, sugestões abertas, vitória e derrota. Não lê nem escreve o progresso real. Informa medidas reais do DOM quando aberta num navegador: rolagem horizontal, grafismos nas margens, ausência da arte no mobile, pointer-events e integridade dos textos.

Esses HTML/TS não são entradas do build e não são incluídos em `dist/`. Não existem links ou controles de revisão na interface pública.

## Responsividade e codificação

A camada decorativa é absoluta em relação à página, recortada e não interativa. Cada SVG só pode ocupar a largura entre a borda externa da página e a coluna central. Em 1280 px, cada margem tem no máximo 80 px; em 768 px, a margem externa tem largura zero. Abaixo de 768 px, a camada é removida por CSS. O conteúdo ocupa uma camada acima; a decoração não se move sobre ele conforme aumenta o histórico ou aparece o resultado. O layout em coluna é aplicado até 960 px.

HTML declara UTF-8 e os arquivos de texto são decodificados estritamente em UTF-8 durante o build. O verificador rejeita padrões típicos de mojibake. Acentos e setas são testados na origem; arquivos com BOM foram normalizados sem BOM. A migração de apresentação restaura os recortes atuais das partidas antigas sem modificar data, atleta, palpites ou resultados, e mostra aviso ao jogador.

**Limite de verificação:** a ferramenta de controle informou `apps: []`, `browsers: []`. Não foi possível capturar ou inspecionar a interface num navegador real em 360, 390, 768 e 1280 px. As ferramentas foram servidas com HTTP 200; os testes DOM e as invariantes de CSS passaram. Isso não substitui a revisão visual do layout com sugestões e resultado final, que permanece pendente.
