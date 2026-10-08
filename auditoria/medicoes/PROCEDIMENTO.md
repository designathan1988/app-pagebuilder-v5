# Procedimento das medições no navegador (Fase 6)

Você recebe uma faixa de ids `MED-nnnn`. Cada um já está citado por um ou mais fluxos em `auditoria/fluxos/`, na seção `## Medições`. O seu trabalho é medir o valor descrito ali, no Chrome headless, e gravar dois arquivos por medição: `auditoria/medicoes/MED-nnnn.mjs` (o script) e `auditoria/medicoes/MED-nnnn.md` (o registro).

## Ambiente já pronto
- O build e2e está em `dist/` (feito com `npm run build:e2e`).
- O servidor JÁ ESTÁ NO AR em `http://localhost:5399` (`vite preview`, com `PORT=5399`). Não suba outro. Se ele cair, suba com `PORT=5399 npm run preview` em segundo plano e espere o `Local:` aparecer na saída.
- Rode cada script da raiz do repositório: `cat auditoria/medicoes/MED-nnnn.mjs | node --input-type=module -`.

## O que medir
1. Abra o fluxo que cita o `MED-nnnn` (procure o id em `auditoria/fluxos/`) e leia o passo e o item de `## Medições` para saber exatamente qual valor falta.
2. Leia `src/editor/test-boot.ts` para saber a forma exata de `{ project, commands, drawn }` que o boot de teste espera e como o `?test-boot` o consome.
3. Monte o estado que o fluxo descreve e meça o valor.

## As duas configurações (CLAUDE.md, seção 8)
- **A:** viewport 1280×720, `locale: 'pt-BR'`, `deviceScaleFactor: 1`, barras de rolagem ocultas (o padrão do Chrome do Playwright).
- **B:** viewport 1440×900, `locale: 'en-US'`, `deviceScaleFactor: 1.25`, barras visíveis — `chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] })`.
- **Um editor por página:** um contexto novo por configuração.

Esqueleto do script:

```js
import { chromium } from '@playwright/test';
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};
for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJETO, commands: COMANDOS, drawn: DESENHADOS } }));
  await page.goto('http://localhost:5399/?test-boot');
  const valor = await page.evaluate(() => { /* a medida deste passo */ });
  console.log(JSON.stringify({ config: nome, valor }));
  await browser.close();
}
```

**Ponto no canvas:** a posição do iframe mais a posição do nó vezes `iframe.currentCSSZoom`.

## O registro `MED-nnnn.md`

# MED-nnnn — <o que se mediu>
- **Fluxo e passo:** <citação do fluxo e o número do passo>
- **Configuração:** A | B
- **Build:** SHA1 de dist/index.html e do chunk principal
- **Commit:** <o commit e o estado do git status ao medir>
- **Valor:** <o valor medido>
- **Saída:** <a saída bruta do script, num bloco de código>

Se um valor não puder ser medido (a tela não existe, o estado não se alcança), **não invente**: grave o registro com `- **Valor:** não medido` e, na linha seguinte, o motivo citado. Abra um `## DEF-<nnnn>` em `auditoria/defeitos.md` quando a impossibilidade for um defeito do aplicativo.

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7 --resumo` e confirme zero pendências. Não edite nada fora de `auditoria/`. Não rode a suíte de testes.

## Resposta final
Responda em menos de 150 palavras: quantas medições gravadas, quantas não medidas e por quê, e qualquer defeito aberto.
