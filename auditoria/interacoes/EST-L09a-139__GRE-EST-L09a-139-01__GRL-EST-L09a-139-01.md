# EST-L09a-139 × GRE-EST-L09a-139-01 → GRL-EST-L09a-139-01
- **Estado:** EST-L09a-139
- **Escritor:** GRE-EST-L09a-139-01 (setDraft): ENT-L09a-0150, ENT-L09a-0151
- **Leitor:** GRL-EST-L09a-139-01 (o rascunho do campo): ENT-L09a-0150
## Estados deixados por A
- V1 sem rascunho, no primeiro render `src/editor/shell/guides-grids.tsx:133` `const [draft, setDraft] = useState<string | null>(null);`
- V2 o texto digitado no campo `src/editor/shell/guides-grids.tsx:147` `onChange={(event) => setDraft(event.currentTarget.value)}`
- V3 sem rascunho depois de perder o foco `src/editor/shell/guides-grids.tsx:147` `onBlur={() => setDraft(null)} />`
- V4 sem rascunho depois do envio `src/editor/shell/guides-grids.tsx:139` `setDraft(null);`
- Recusa: um texto vazio ou não numérico não roda comando; o rascunho é descartado na mesma `src/editor/shell/guides-grids.tsx:139` `setDraft(null);`
- Desmontagem: o rascunho cai com o `GridField` ao fechar o diálogo `src/editor/shell/guides-grids.tsx:133` `const [draft, setDraft] = useState<string | null>(null);`
## Casos
### C1 final
- O leitor chega com o envio terminado: lê o rascunho `src/editor/shell/guides-grids.tsx:137` `if (draft === null) return;` e o número digitado `src/editor/shell/guides-grids.tsx:138` `const typed = Number(draft);`. Resultado: ok — sem rascunho nada guarda; com um, roda a porta.
### C2 intermediário
- O leitor chega com o texto digitado e o formulário ainda por enviar: o rascunho vale o texto e a porta é rodada `src/editor/shell/guides-grids.tsx:140` `if (draft.trim() !== '' && Number.isFinite(typed)) run(entry, { grid, setting, value: typed });`. Resultado: ok.
### C3 em curso
- n/a — o envio lê o rascunho de forma síncrona no evento `src/editor/shell/guides-grids.tsx:138` `const typed = Number(draft);`.
### C4 desmontagem
- n/a — o rascunho é estado do `GridField` e cai com ele ao fechar o diálogo `src/editor/shell/guides-grids.tsx:133` `const [draft, setDraft] = useState<string | null>(null);`.
## Resultado
- O envio descarta o rascunho e, com um número válido, roda a porta de configuração da grade `src/editor/shell/guides-grids.tsx:140` `if (draft.trim() !== '' && Number.isFinite(typed)) run(entry, { grid, setting, value: typed });`.
