# Procedimento das interações (Fase 7)

Cada arquivo desta pasta é **um par**: um grupo de escritores de um item de estado e um grupo de leitores do mesmo item. O par é o que prova o encontro dos dois: o leitor, chegando depois do escritor, lê o que o escritor deixou.

## 1. De onde saem os pares

- `node tools/audit/matriz.mjs` congela `auditoria/matriz.md`: por item de estado, os grupos de escritores (`GRE-<EST>-<nn>`, um por função que escreve o item) e os de leitores (`GRL-<EST>-<nn>`, um por função que lê o item), com os fluxos que cada grupo cobre.
- `node tools/audit/esqueletos.mjs <EST>` cria um esqueleto por par `(GRE × GRL)` — inclusive `A = B`, quando o mesmo grupo escreve e lê.
- Cada esqueleto já traz o título, os ids, os membros dos dois grupos e os títulos das seções. **O conteúdo é seu.**

## 2. O que o arquivo precisa dizer

### `## Estados deixados por A`
Um item por estado distinto que os membros do `GRE-` deixam no item de estado. **O estado distinto é o que a função produtora deixa**, e não o comando:

- abra os fluxos que o grupo cobre (a linha `- **Escritor:**` os lista) e veja, em cada um, qual função produz o valor novo do item na linha citada (`writeDeclarations`, `withDock`, `applyPatches`, `record`, `containerWrite` e as demais produtoras);
- quando o grupo é uma função que **aplica** o resultado de outra (`run`, `publish`, `commit`), os estados distintos são os das produtoras que os membros citam: as mesmas produtoras citadas por muitos membros valem uma linha, com a citação da produtora e um ou dois membros de exemplo;
- cubra os estados **finais**, os **intermediários** (meio de um gesto, de um grupo, de uma sequência), os que a **recusa** deixa (o comando recusado, que não mudou o documento) e os que a **desmontagem** deixa.

Cada linha cita a linha do código que produz aquele estado, no formato `` `caminho:LINHA` `trecho exato` ``.

### `## Casos`
Quatro casos, um por título, e cada um termina em `ok`, `DEF-<nnnn>` ou `n/a — <motivo>` seguido de citação:

- `### C1 final` — o leitor chega com o escritor já terminado e lê o estado final.
- `### C2 intermediário` — o leitor chega quando o escritor deixou um estado intermediário (meio de um gesto, de um grupo ou de uma sequência).
- `### C3 em curso` — o leitor chega **enquanto** o escritor corre: a assinatura da store, o `getState` no meio de um `run`, um ouvinte chamado no meio de um `publish`.
- `### C4 desmontagem` — o leitor chega depois de desmontar o componente que o escritor usa (a assinatura removida, o painel fechado, o campo desligado).

Ao tracejar um caso, siga a linha do leitor no código: onde ele lê o item, o que ele faz com o valor, e o que muda no DOM. Cite cada linha.

### `## Resultado`
Uma linha: o que o leitor mostra ou decide a partir do que leu, com a citação.

## 3. O que não vale

- **Deduzir pelo nome da função.** Abra a função e cite a linha.
- **Palavra proibida** (`auditoria/decisoes.md` e `.claude/vistoria.config.json`): a trava recusa a gravação.
- **Citação que não confere:** o trecho tem de estar na linha citada, ou ser um pedaço dela com 6 caracteres não brancos ou mais. A trava recusa a gravação.
- **Linguagem de conclusão** ("funciona", "corrigido", "garantido", "100%", "sem erros") sem a saída do verificador.
- **Medir o que o navegador calcula** (seção 8 do `CLAUDE.md`): dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto e ordem de foco se medem no Chrome headless e se citam por `MED-`; o rastreamento nunca os presume.
- **Alterar outro arquivo** que não seja o par em que se trabalha.

## 4. Fechamento

- `node tools/audit/check.mjs --so C6 --resumo` sem pendências para o item de estado do lote.
- Um defeito achado no rastreamento entra em `auditoria/defeitos.md` com `Status: aberto`, citado, e é citado no caso com `DEF-<nnnn>`.
