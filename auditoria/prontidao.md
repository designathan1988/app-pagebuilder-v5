# Prontidão para uso (2026-10-10)

Pergunta do dono: o app já pode ser usado, e tudo funciona? Fora do escopo: publicação, deploy e backend.

Método:
- Build de produção (`npm run build` + `vite preview`), perfil de navegador limpo, 1366×768 em pt-BR e 1920×1080 em inglês, Chrome e Edge.
- Um site feito do zero, como o usuário faz: menus, Inserir, inspector, canvas, teclado.
- O resultado conferido no site exportado, aberto fora do editor, e no projeto salvo, reaberto em perfil limpo.
- Só conta como defeito o que foi reproduzido duas vezes.

## Veredito
**Pronto para uso, com ressalvas.**

O fluxo inteiro funciona e não perde trabalho: montar a página, estilizar, ajustar o responsivo, interações, animação, várias páginas, salvar, reabrir e exportar. O site exportado sai igual ao canvas.

Dois defeitos dão resultado errado em casos comuns e devem ser corrigidos antes de entregar o app a outra pessoa:
- **DEF-0615:** o cabeçalho compartilhado não leva texto nem links às outras páginas.
- **DEF-0620:** o preço "6,50" vindo de CSV sai como "6.5".

Os outros quatro defeitos são armadilhas de foco ou um bloco pronto que passa da tela do celular: atrapalham, mas têm contorno visível.

## As tarefas
| # | Tarefa | Terminou? | Resultado certo? | Evidência |
|---|---|---|---|---|
| 1 | Primeiro contato (perfil vazio) | sim | sim: página em branco, dicas no inspector, menu Arquivo claro | fotos 01, 02 |
| 2 | Landing page do zero: barra, hero, 3 cartões com foto, formulário, rodapé; variável de cor, classe | sim | sim, com DEF-0616 e DEF-0618 no caminho | fotos 03–35 |
| 3 | Responsivo: título 32 px e grade em 1 coluna no Celular; Desktop intacto | sim | sim, depois de corrigir à mão a barra pronta (DEF-0619) | fotos 36–42; CSS exportado com `@media (max-width: 390px)` |
| 4 | Hover na classe, clique que rola até o formulário, animação de entrada | sim | sim: no ZIP, hover `#3d2214`, rolagem até o formulário, opacidade 0→1 em 0,6 s | fotos 20, 43–65; `check-export.mjs` |
| 5 | Páginas Sobre e Contato, cabeçalho como componente nas três | sim | **não**: texto e links não se propagam (DEF-0615); contorno: inserir a instância de novo | fotos 66–85 |
| 6 | Trabalho seguro | sim | sim: recarregar mantém tudo; a digitação pendente volta no campo (com o aviso de sair da página); 15 desfazer e 15 refazer voltam ao mesmo projeto; `project.zip` reaberto em perfil limpo é idêntico (3 páginas, 3 fotos, estilos) | fotos 82, 86, 92 |
| 7 | Site exportado, fora do editor, a 1366, 768 e 375 px | sim | sim: links entre as 3 páginas, fotos 3000/2400/1800 px, sem rolagem lateral, HTML limpo com classes legíveis e `alt` | fotos 90-export-*, 91 |
| 8 | Importar HTML, importar pasta, CSV numa coleção | sim | importações certas; **CSV: preço errado** (DEF-0620) | fotos sub-a-01 a sub-a-13 |
| 9 | Página com 647 elementos | sim | sim: abre em 0,6 s; clique→inspector até 119 ms; Enter→canvas até 60 ms; Ctrl+Z até 48 ms | relatório do subagente, fotos sub-a-14 a 16 |
| 10 | Assistente e captura de URL sem serviço | sim | o assistente explica que falta a chave e deixa "Enviar" desativado; a captura explica que precisa do Companion (o campo tem o DEF-0617) | fotos 97, 99, 100 |
| — | Edge | sim | sim: abrir, editar no canvas, inspector, desfazer, exportar, sem erro de console | foto 106, `check-edge.mjs` |
| — | Inglês a 1920×1080 | sim | interface toda em inglês e cabendo | foto 101 |

## Defeitos que contam (registrados em `defeitos.md`, todos abertos)
1. **DEF-0615**: "Atualizar o componente a partir desta instância" diz "2 outras instâncias acompanham", mas o nome da marca e os links do menu não mudam nas outras páginas. O estilo muda. É o caso clássico de cabeçalho compartilhado. Causa em `components.ts:394`.
2. **DEF-0620**: um preço de CSV "6,50" sai "6.5" no canvas e no ZIP. Causa em `collections.ts:116`.
3. **DEF-0616**: com uma classe já criada, "+ Classe" põe o foco na lista. O nome digitado some, e o Enter aplica a classe errada. Causa em `popover.tsx:78`.
4. **DEF-0619**: a "Barra de navegação" pronta tem 423 px no Celular de 390, e o site rola de lado no telefone. Causa em `manifest/elements.json:88`.
5. **DEF-0617**: em "Abrir um endereço da web", o que se digita não entra no campo, porque o foco fica no painel. Causa em `dialog.tsx:28`.
6. **DEF-0618**: o Tab no nome de uma variável nova perde o foco, e as teclas seguintes viram atalhos do editor. Causa em `variables.tsx:167`.
7. **DEF-0621** (cosmético): o menu de contexto que sobe até o topo fica por baixo da barra de menus. Causa em `top-bar.css:30`.

## Atritos menores (não são defeito de código; ficam para decisão)
- Na busca de propriedades, "cor de fundo" e "cor" não acham "Fundo". Só "fundo" ou "background" acham (foto 17a).
- Depois de "+ Classe", o alvo continua "Elemento", e os estilos seguintes vão para o elemento, não para a classe (foto 17). No Webflow, a classe nova vira o alvo.
- Para pôr uma foto numa imagem, é preciso enviá-la antes pelo Explorer. Arrastar o arquivo do Explorer para a imagem não faz nada (fotos 23, 27).
- Animação de entrada: "+ Movimento" cria uma linha do tempo com um "Animar" sem propriedade. Para chegar ao efeito, são cerca de 8 passos (modo Gravar, dois quadros-chave). "Reproduzir" com a agulha no fim não faz nada.
- "Pré-visualizar" em Desktop numa janela de 1366 mostra a página de 1440 px cortada à direita, com rolagem lateral (foto 102).
- Depois de recarregar, o painel Verificações abre sozinho e ocupa metade da altura do canvas a 768 px (foto 82).

## Cosméticos vistos nas fotos (conferidos aqui)
- A pílula "Editando Ao passar o mouse" cobre metade do botão "Entrar" do site (foto 20).
- O rótulo e o chip da seleção ficam sobre a faixa laranja do breakpoint ("…esta tela…", fotos 41 e 97).
- A amostra de cor de um campo com variável aparece vazia em vez da cor (fotos 15 e 101).
- A barra superior anda 14 px a cada "Salvando…" (fotos 12c e 20 contra 12b).
- No painel Dados, o nome do campo "descricao" aparece cortado como "descrica" (foto sub-a-10).
- Em pt-BR, "inspector" aparece em `motion.timeline.recording` e `status.motion.recordOn`; o resto da interface usa "inspetor".
- Nas Camadas, os ícones de escolher alvo ficam sobre o tag ("butto◎n", foto 47).

## Descartados (não são do app)
- O erro de console "Blocked script execution in about:srcdoc" vem da injeção do Playwright MCP. Nas execuções com Chrome e Edge próprios, o console ficou limpo.
- A moldura deslocada e o canvas vazio depois de maximizar a bancada (fotos 64, 83, 103) vêm do navegador do MCP, que não desenha quadros. No Chrome, a mesma sequência fica certa (foto 104).
- Colar sem efeito: sem a permissão de área de transferência, o leitor fica esperando no headless. Com a permissão que o Chrome pede ao usuário, colar funciona (foto 75).

## O que não foi avaliado
- O assistente com uma chave de serviço real e a captura de URL com o Companion rodando: os dois dependem de serviço externo.
- O envio real do formulário, que fica do lado do backend.

## Fotos
Ficam em `auditoria/fotos/prontidao/` (as `sub-a-*` são do subagente da tarefa 8/9). Cada foto foi aberta: as do editor, aqui ou por dois subagentes de revisão; cada achado deles foi conferido aqui na própria foto ou por reprodução.
