# Verificação integral — relatório consolidado (2026-10-09)

Pedido do dono: verificar tudo o que está registrado como feito. Fonte de cada linha: os doze arquivos desta pasta (`grupo-a` a `grupo-l`, com as citações `caminho:linha` e os scripts) e as medições do verificador principal (scripts no scratchpad da sessão, citados em `auditoria/progresso.md`).

## 1. Portões automáticos (medidos hoje)
| verificação | resultado |
|---|---|
| detectores (`npx vitest run --config tools/runner/model/vitest.config.ts`) | 22 arquivos, 61 testes, sem falha |
| `npm run typecheck` | saída 0 |
| `npm run lint` (e `npx eslint .` sem cache, grupo F) | saída 0 |
| `npm run manifest:check` | `manifest:check passed.` |
| `npm run deps:check` | sem violação (1.149 módulos, 5.293 dependências) |
| `npm run gen:check` | **falha**: lê `manifest/generated/behavior.md` como JSON (`tools/gen/check.ts:20`); o arquivo entrou em 253b9a36 |
| catálogo de mutantes (`node tools/runner/mutants-run.ts`) | 68, 65 acusados, 3 "equivalentes"; **o M19 não é equivalente** (grupos E e I reproduziram) |
| `lote-visual.spec.ts` e `lote-navegador.spec.ts`, cada um sozinho, nas duas condições | 4/4 e 7/7 nas duas |
| suíte de navegador inteira (2.926 testes, `E2E_WORKERS=2`) | em curso; ver seção 6 |

Os portões passam, mas a seção 3 mostra que vários detectores não provam o que dizem: passar neles não prova as regras.

## 2. Defeitos da aplicação reproduzidos (não registrados antes, ou registrados como corrigidos)
Cada um com reprodução; onde diz "Chrome", foi medido no navegador real.

| # | regra | defeito | reprodução | fonte |
|---|---|---|---|---|
| 1 | segurança | **XSS persistente na exportação**: um projeto cuja página capturada traz um `<style>` com `</style><img onerror>` é aceito ao abrir, e o site exportado executa o `onerror` (`src/core/render/captured.ts:180`) | Chrome: boot `done`, Exportar, `index.html` exportado executou o tratador (`__pwned = 1`) | grupo G; `xss-export.mjs` |
| 2 | segurança | `<animate>`/`<set>` com `javascript:` em `values`/`to`/`from` passam da captura à exportação (`src/core/document/captured.ts:80`), enquanto o sanitizador de SVG os recusa | happy-dom; execução pelo Chrome não medida | grupo G |
| 3 | G2 | campo que sai da página com digitação pendente não grava: a limpeza lê `field.current`, já nulo. Guias e grades: 7 em Colunas + Esc fecha sem gravar, e o 7 entra no próximo comando sem relação | arnês dos detectores com o keymap real | grupos B, F |
| 4 | G1/G2 | dentro de um grupo de comandos (turno do assistente), `group.dispatch` não passa pela conferência de `src/editor/store.ts:235`/`:247`: troca de breakpoint e mudança de documento deixam a digitação pendente; o M19 é acusado por esse caso | arnês | grupos E, I |
| 5 | G2 | toque fora do campo durante o turno do assistente: a gravação recebe `assistant.busy` e sai do registro sem ir ao documento; o texto fica no campo e nada grava de novo | arnês | grupo I |
| 6 | G1 | banda de espaçamento: digitar 12 no `n-hero` e mudar a seleção para `n-title` com o foco no campo grava 12px no `n-title` (`edit-handles.tsx:241`) | arnês | grupo I |
| 7 | G1 | o rascunho da sessão não guarda o quadro-chave (`drafts.ts:28`): digitado no quadro 100, volta no 0 depois de recarregar | arnês | grupo I |
| 8 | G2 | painel rápido: o Ctrl+Shift+Q também descarta a digitação (só o Esc é exceção no `CLAUDE.md`; a especificação do recurso diz outra coisa) — decisão do dono | arnês com o painel e o keymap reais | grupo I |
| 9 | DCS-009 | regressão do DEF-0511: o grupo grava o contexto de quando abriu; um turno que troca para `laptop` e grava `width` faz o desfazer levar o editor a `desktop`, onde a mudança não aparece | store real | grupo A |
| 10 | DCS-016 | todo comando feito com o playhead sobre um quadro grava esse quadro (`store.ts:367`): o desfazer de `element.duplicate` reabre a Timeline fechada | store real | grupo A |
| 11 | DEF-0522 | **a correção piorou o foco**: no código de antes (ae24ee7e^), fechar o painel rápido deixava o foco no chip; agora fica no `BODY` (o chip do quadro do fecho é desmontado no quadro seguinte, `quick-panel.tsx:503`/`:573`) | Chrome, os dois builds | verificador principal, grupo C |
| 12 | G7 | `project.setLanguage`: o canvas fica com `lang=en`, do zero `lang=pt-BR` (`render.ts:185`) | sonda do render | grupo J |
| 13 | G7 | botão movido para dentro de `<form>`: canvas `type=button`, do zero e exportação `submit` | sonda | grupo J |
| 14 | G7 | `element.setId` no alvo de um link: canvas `href=#topo`, do zero `#inicio` | sonda | grupo J |
| 15 | integridade | o validador não confere aninhamento (`validate.ts:6`): `<li>` em `<div>`, `<a>` em `<a>`, `<form>` em `<form>` abrem pelo Arquivo › Abrir; `<video controls>` dentro de `<a href>` é aceito por `element.setAttribute`, quando `placementRefusal` recusaria | sonda | grupo J |
| 16 | G6 | `ui.capturedNode` é uma segunda seleção que nada limpa (`capture/selection.ts:11`); sobrevive à abertura de outro projeto | leitura e sonda | grupo J |
| 17 | robustez | abrir projeto com árvore de 4.000 níveis lança `RangeError` (Arquivo › Abrir); a restauração no boot lança a partir de 3.000 níveis, sem guarda em `main.tsx:61` | arnês | grupos C, G |
| 18 | robustez | componente com árvore sem `children` derruba `readProject` (`data/validate.ts:118`); projeto versão 3 com `capture.viewports: [null]` derruba a migração (`migrations.ts:35`); `clipboard.paste` com nó malformado lança antes da validação (`clipboard.ts:143`); `readStylesheet`/`specificityOf` lançam com 5.000 níveis | arnês | grupos C, G |
| 19 | DEF-0512 | com o compositor aberto, `layout.enter` troca de contêiner e o primeiro desenho do novo usa a caixa do anterior (10px,20px antes de 300px,400px) | sonda | grupo B |
| 20 | MEC-10 | a máquina de modos acusa o menu de contexto aberto pelo clique direito no canvas ("context-menu opened during pointer-gesture"); o app gera o incidente toda vez | `tests/e2e/context-menu.spec.ts`, 3 falhas, nas rodadas de 4 e de 2 navegadores | suíte |
| 21 | i18n | "Não foi possível guardar 1 recursos": a conferência de plurais só vê 11 de 46 bases | leitura e script | grupo G |
| 22 | compat | `computedStyleMap` sem guarda (`coordinates.ts:530`), inexistente no Firefox estável | leitura (não medido no Firefox) | grupo G |
| 23 | DCS-003 | abrir um JSON que não é projeto em pt-BR mostra "…: it is not a project document" (`archive.ts:23`) | leitura (não medido no navegador) | grupo L |

## 3. Detectores que não provam o que o registro diz
- **G7 (`lote-visual.spec.ts`)**: 149 dos 164 comandos "rodados" só rodaram a seleção (`:212`, `:225`); o caso compara dois desenhos do zero, nunca o incremental (o boot roda antes do primeiro desenho); a exportação só é comparada no documento sem edição; os contextos próprios ficam fora da fixture (guarda de tela e feed).
- **Controles montados (`lote-visual.spec.ts:82`)**: `<button>`/`<input>`/`[contenteditable]` sem `role`/`tabindex` nunca são visitados; `data-local` não conferidos; "toda porta do inventário montada" não conferido; o painel rápido nunca é aberto (o editor abre sem seleção).
- **`lote-navegador.spec.ts`**: o `onclick` da colagem é conferido na janela errada e sem clicar; cores forçadas só olham `visibility`/`display`; o IME passaria sem a guarda (a consulta deixa de casar); a cota enche só o `localStorage` e não confere o aviso; o LoAF não troca de página; código de depuração em `:217`.
- **`tools/ui-fit/check.ts`**: 150 de 944 rótulos pulados sem aviso (painel rápido, menu de contexto, seletor de cor, diálogos); hash do CSS nunca conferido; coluna = região inteira (inspector 336 px para rótulos de 116 px); sem ligaduras (GSUB), `text-transform` nem `letter-spacing`; pseudo-expansão medida com `.notdef`; a condição 1280×720 pt-BR nunca medida; token renomeado desliga a conferência sem falhar. **DEF-0520 é falso positivo** (a porta não desenha texto) e a mensagem inglesa foi trocada para calar o detector.
- **G1/G2**: `events.ts:58` (gravação no início do toque) sem detector — removida, 89 de 89 testes passam; classe-alvo e quadro-chave nunca trocados como contexto (`harness.ts:213`); nenhuma troca de seleção com o foco no campo (`harness.ts:222`); nenhum caso de grupo de comandos, de restauração de rascunho, de painel que fecha com campo montado nem das portas de fecho do painel rápido.
- **Outros**: o M19 não é equivalente; `mutants-run.ts:80` conta como acusado qualquer saída não zero (inclusive tempo esgotado); o seletor de impacto não vê o manifesto (`import.meta.glob`) nem arquivos lidos do disco; a porta de colar por clique (`door.tsx:112`) sem caso nem mutante; `fields.test.ts:85` passa com as duas leituras recusadas; o contador de render mede uma vista escrita no teste e a testemunha de commits é vazia; o caso `__proto__` não chama leitor; DEF-0001 sem efeito no app (`main.tsx:86` descarta a parada); `events.ts:51`–`52` (cancelamento do gesto preso, DEF-0510) sem detector; DEF-0509 confere 2 de 8 longhands; DEF-0516 sem mutante do sinal unário; DCS-001 (ida-e-volta byte a byte) sem detector; nenhum detector mede a posição das abas (D-1) nem o ramo "logo abaixo" do DEC-70 no navegador.
- **Lint**: `builder/interactive-owner` isenta quem envolve uma porta, quem tem o texto `data-door` num comentário e quem recebe atributos espalhados — caso real em `quick-panel.tsx:284`; `builder/listener-scope` aceita apelido local de `window`, `{ once: false }` e intervalo com o mesmo último nome.

## 4. Registros que não conferem
- `auditoria/progresso.md`: 30 defeitos (são 33); DEF-0522 aberto e corrigido ao mesmo tempo; lista de commits para em 1bc2d094 (faltam 10); remete a "O que não deu" (não existe); etapas 4 e 5 dadas como feitas sem o LoAF em `tools/perf/` nem o lote por impacto.
- `auditoria/otimizacoes.md` não existe; nenhuma otimização registrada (Fase 9).
- `auditoria/defeitos.md`: DEF-0514 a DEF-0523 sem itens de estado; DEF-0516 a DEF-0523 sem re-rastreamento; DEF-0519 a DEF-0523 sem mutante; causas de DEF-0504, DEF-0506, DEF-0507 e do DEF-0522 erradas; DEF-0518 diz que `behavior.json` sai de `tools/gen/generate.ts` (sai de `tools/map/generate.ts`).
- Decisões: DCS-007 cita uma trava e uma configuração que não existem mais; DCS-011 cita `src/editor/input/scope.ts` (não existe); DCS-014 cita `tools/runner/field-contracts.test.ts` (nunca existiu); DCS-013 não registra que D-E só vale para o mesmo ponteiro; DCS-019 cita uma regra do soltar de arquivo que não confere; DCS-008: a matriz marca "nenhum leitor" para EST-L01-035 e EST-L01-036, lidas pelo código.
- Processo das tarefas: o commit 81be75c7 atualizou citações que a tarefa mandava não tocar; commits misturam itens (1f0b094a); `package.json` passou de CRLF a LF (1bc2d094); `src/ui/tokens.css` diz ser gerado por um gerador que não existe.

## 5. Confirmado
DEF-0003 a DEF-0008, DEF-0286, DEF-0289, DEF-0501 a DEF-0503, DEF-0505, DEF-0508, DEF-0515; MEC-03, MEC-06, MEC-07, MEC-19; DCS-004, DCS-006, DCS-010, DCS-011, DCS-012, DCS-017, DCS-018, DCS-021, D-1, DEC-70; a fonte carregada e usada no Chrome; nenhuma dependência nova desde o estado de partida; a ida-e-volta salvar→abrir→salvar idêntica nas 48 fixtures (sonda, sem detector); os 68 trechos do catálogo existem no código.

## 6. Suíte de navegador inteira
Em curso (`E2E_WORKERS=2`, prioridade baixa). Resultado a gravar aqui.
