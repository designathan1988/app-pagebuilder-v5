# Procedimento do inventário de estado (Fase 3)

Você recebe um conjunto de arquivos (um lote de código, indicado no seu prompt). O seu trabalho é levantar TODO o estado que esses arquivos declaram e guardam, e gravar um bloco por item em `auditoria/estado/<área>.md`.

## O que é um item de estado
Tudo que sobrevive à chamada que o escreveu e é lido por outra entrada:
- variável mutável de módulo (`let` de topo, exportada ou não);
- campo de classe;
- coleção compartilhada (`new Map`, `new Set`, `new WeakMap`, `new WeakSet`) de topo, inclusive caches e memoização;
- estado de componente React (`useState`, `useReducer`, `useRef`, `createRef`, `createContext`) e stores criadas por uma fábrica (`create*Store`) com o estado fechado na fábrica;
- armazenamento do navegador (`localStorage`, `sessionStorage`, `indexedDB`).

Não é item: a variável local curta de uma função que morre no fim dela. Cada uma dessas vira uma exclusão (abaixo).

O estado do navegador também conta, e cada uma destas cinco categorias precisa de pelo menos um item **no conjunto da auditoria**: foco e elemento ativo; seleção de texto e conteúdo de `contenteditable`; posições de rolagem; documento do iframe; captura de ponteiro. Levante as que os seus arquivos tocam; se nenhum dos seus arquivos tocar nenhuma, não invente.

## O formato de cada item
Um bloco por item, em `auditoria/estado/<área>.md`:

## EST-<área>-<nnn> — <nome curto>
- **Declaração:** `<caminho>:<linha>` `<trecho literal da linha>`
- **Forma:** <o tipo do valor>
- **Valores possíveis:**
  - V1 <um valor ou estado distinto, com a citação quando houver>
  - V2 <outro; inclua os intermediários: durante gesto, com rascunho pendente, carregando, com operação assíncrona em curso>
- **Escritores:**
  - `<caminho>:<linha>` `<trecho literal>` via <a função que escreve>
- **Leitores:**
  - `<caminho>:<linha>` `<trecho literal>` via <a função que lê>
- **Criação:** `<caminho>:<linha>` `<trecho literal>`
- **Descarte:** `<caminho>:<linha>` `<trecho literal>` (quando o item vive enquanto a página viver, escreva `fim-da-página` antes da citação)
- **Navegador:** não | foco | seleção-de-texto | rolagem | documento-do-iframe | captura-de-ponteiro

## As exclusões
Ocorrência de um padrão de estado que **não** é um item (uma variável local curta) entra num bloco de exclusão no fim do arquivo:

### EXC-<área>-<nnn>
- **Padrão:** <o id do padrão de `auditoria/padroes.json`, por exemplo P-E03>
- **Ocorrência:** `<caminho>:<linha>` `<trecho literal>`
- **Motivo:** <por que não é estado que sobrevive à chamada, com a citação>

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7,C4 --resumo` e confira que não há pendência apontando para o seu arquivo. As pendências de C4 de outras áreas são esperadas enquanto elas não fecharem.

## Regras
- Todo trecho citado é copiado literalmente da linha; a gravação é recusada quando o trecho não está na linha.
- Escreva em português e não use as palavras proibidas da vistoria.
- Não edite nada fora de `auditoria/`. Não rode testes.

## Resposta final
Responda em menos de 150 palavras: quantos itens e quantas exclusões você gravou, e a faixa de ids usada.
