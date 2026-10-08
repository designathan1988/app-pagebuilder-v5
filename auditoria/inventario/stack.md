# Stack

| pacote | versão instalada | consultas |
|---|---|---|
| react | 19.3.0 | 2026-10-08: https://react.dev/reference/react ; https://react.dev/reference/react/hooks ; https://github.com/facebook/react/releases/tag/v19.3.0 |
| react-dom | 19.3.0 | 2026-10-08: https://react.dev/reference/react-dom ; https://react.dev/reference/react-dom/client/createRoot |
| zod | 4.6.5 | 2026-10-08: https://zod.dev/api ; https://github.com/colinhacks/zod/blob/v4.6.5/packages/zod/README.md |
| css-tree | 3.2.1 | 2026-10-08: https://github.com/csstree/csstree/tree/v3.2.1/docs ; https://github.com/csstree/csstree/blob/v3.2.1/docs/parsing.md |
| html-to-image | 1.11.13 | 2026-10-08: https://github.com/bubkoo/html-to-image/tree/v1.11.13 |
| happy-dom | 20.14.5 | 2026-10-08: https://github.com/capricorn86/happy-dom/wiki ; https://github.com/capricorn86/happy-dom/tree/v20.14.5 |
| ws | 8.21.3 | 2026-10-08: https://github.com/websockets/ws/blob/8.21.3/doc/ws.md |
| parse5 | 8.0.1 | 2026-10-08: https://parse5.js.org/ ; https://parse5.js.org/modules/parse5.html |
| lottie-web | 5.13.0 | 2026-10-08: https://github.com/airbnb/lottie-web/tree/v5.13.0 |
| typescript | 6.0.3 | 2026-10-08: https://www.typescriptlang.org/tsconfig/ ; https://github.com/microsoft/TypeScript/tree/v6.0.3 |

## react 19.3.0
- **URL consultada:** https://react.dev/reference/react
- **URL consultada:** https://react.dev/reference/react/hooks
- **URL consultada:** https://react.dev/reference/react/createContext
- **URL consultada:** https://react.dev/reference/react/memo
- **URL consultada:** https://react.dev/reference/react/StrictMode
- **URL consultada:** https://react.dev/reference/react/Fragment
- **URL consultada:** https://github.com/facebook/react/releases/tag/v19.3.0
- **Confirmado:** A referência lista useState, useRef, useEffect, useLayoutEffect, useSyncExternalStore, useMemo, useCallback, useContext e useId como hooks embutidos, e confirma createContext(defaultValue) com o próprio objeto de contexto renderizado como provider desde o React 19. Confirma memo(Component, arePropsEqual?) com comparação por Object.is, Fragment cuja sintaxe curta não aceita key e StrictMode sem props com renderização dupla e ciclo extra de efeitos apenas em desenvolvimento; a tag v19.3.0 do repositório oficial existe e consta como a mais recente.

## react-dom 19.3.0
- **URL consultada:** https://react.dev/reference/react-dom
- **URL consultada:** https://react.dev/reference/react-dom/client/createRoot
- **Confirmado:** Confirma createPortal e flushSync importáveis de react-dom e a assinatura createRoot(domNode, options?) com as opções onCaughtError, onUncaughtError e onRecoverableError, além de root.render e root.unmount; root.render não é síncrono e flushSync força a atualização do DOM de forma síncrona.

## zod 4.6.5
- **URL consultada:** https://zod.dev/api
- **URL consultada:** https://github.com/colinhacks/zod/blob/v4.6.5/packages/zod/README.md
- **URL consultada:** https://github.com/colinhacks/zod/releases/tag/v4.6.5
- **Confirmado:** A página zod.dev/api (documentada como Zod 4.6) confirma z, z.object, z.string, z.array, z.record, parse e safeParse. O README na tag v4.6.5 confirma que parse devolve uma cópia profunda tipada e lança ZodError, e que safeParse devolve uma união discriminada com success, data e error; a tag v4.6.5 consta como a mais recente no repositório oficial.

## css-tree 3.2.1
- **URL consultada:** https://github.com/csstree/csstree/tree/v3.2.1/docs
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/parsing.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/generate.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/traversal.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/utils.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/README.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/definition-syntax.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/readme.md
- **URL consultada:** https://api.github.com/repos/csstree/csstree/contents/docs?ref=v3.2.1
- **URL consultada:** https://csstree.github.io/docs/
- **Confirmado:** Os docs da tag v3.2.1 confirmam parse(source[, options]) com context, positions, onParseError, parseAtrulePrelude, parseRulePrelude, parseValue e parseCustomProperty, generate(ast[, options]) com mode spec ou safe, walk(ast, options) com enter, leave, visit e reverse (e break e skip), toPlainObject(ast), que converte filhos List em arrays com alteração da árvore passada, e csstree.lexer em checkStructure. As páginas consultadas (docs, README e índice dos docs da tag v3.2.1, além do site csstree.github.io/docs) não apresentam uma função fork.

## html-to-image 1.11.13
- **URL consultada:** https://github.com/bubkoo/html-to-image/tree/v1.11.13
- **Confirmado:** O README da tag v1.11.13 confirma toSvg com as opções de renderização width, height, pixelRatio, backgroundColor, style, filter e quality aplicadas ao nó antes da renderização.

## happy-dom 20.14.5
- **URL consultada:** https://github.com/capricorn86/happy-dom/wiki
- **URL consultada:** https://github.com/capricorn86/happy-dom/wiki/Window
- **URL consultada:** https://github.com/capricorn86/happy-dom/wiki/Getting-started
- **URL consultada:** https://github.com/capricorn86/happy-dom/tree/v20.14.5
- **Confirmado:** O wiki confirma a classe Window, importada de happy-dom, com new Window({ url }) e window.document, e a página de primeiros passos usa document.createElement, document.querySelector e appendChild. As páginas do wiki consultadas não trazem número de versão; a tag v20.14.5 do repositório oficial existe.

## ws 8.21.3
- **URL consultada:** https://github.com/websockets/ws/blob/8.21.3/doc/ws.md
- **Confirmado:** O doc/ws.md da tag 8.21.3 confirma new WebSocketServer(options[, callback]) com a opção port (exatamente uma entre port, server e noServer), o evento connection com websocket e request, o evento message com data e isBinary, server.close, websocket.send e websocket.close([code[, reason]]).

## parse5 8.0.1
- **URL consultada:** https://parse5.js.org/
- **URL consultada:** https://parse5.js.org/modules/parse5.html
- **Confirmado:** A referência do módulo confirma as funções parse, parseFragment, serialize e serializeOuter e o tipo DefaultTreeAdapterMap na versão 8.0.1 do parse5; a página inicial descreve a biblioteca como conjunto de análise e serialização de HTML em conformidade com o padrão WHATWG.

## lottie-web 5.13.0
- **URL consultada:** https://github.com/airbnb/lottie-web/tree/v5.13.0
- **Confirmado:** O README da tag v5.13.0 confirma loadAnimation com um único objeto de parâmetros e as opções container, renderer, loop, autoplay, path, animationData e name.

## typescript 6.0.3
- **URL consultada:** https://www.typescriptlang.org/tsconfig/
- **URL consultada:** https://github.com/microsoft/TypeScript/tree/v6.0.3
- **Confirmado:** A referência de tsconfig confirma as opções target ES2022, module ESNext, moduleResolution bundler, jsx react-jsx, strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitOverride, noFallthroughCasesInSwitch, noUnusedLocals, noUnusedParameters, verbatimModuleSyntax, isolatedModules, allowImportingTsExtensions, resolveJsonModule e skipLibCheck, com a nota de que allowImportingTsExtensions exige noEmit ou emitDeclarationOnly; a tag v6.0.3 do repositório oficial existe.
