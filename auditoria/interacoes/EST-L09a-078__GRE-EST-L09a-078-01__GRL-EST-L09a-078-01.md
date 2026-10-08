# EST-L09a-078 × GRE-EST-L09a-078-01 → GRL-EST-L09a-078-01
- **Estado:** EST-L09a-078
- **Escritor:** GRE-EST-L09a-078-01 (onChange): ENT-L09a-0081
- **Leitor:** GRL-EST-L09a-078-01 (onChange): ENT-L09a-0081
## Estados deixados por A
- V1 a lista dos pontos do valor, no primeiro render `src/editor/shell/easing-curve.tsx:79` `const [points, setPoints] = useState<readonly string[]>(() => pointsOf(value).map(written));`
- V2 a lista com o ponto digitado no lugar `src/editor/shell/easing-curve.tsx:116` `const next = [...points];` seguido de `src/editor/shell/easing-curve.tsx:118` `setPoints(next);`
- Recusa: não é deste item — a digitação só muda o estado do seletor; a gravação do valor é o envio do formulário `src/editor/shell/easing-curve.tsx:118` `setPoints(next);`
- Desmontagem: a lista cai com `EasingChooser` ao fechar o popover `src/editor/shell/easing-curve.tsx:79` `const [points, setPoints] = useState<readonly string[]>(() => pointsOf(value).map(written));`
## Casos
### C1 final
- O leitor chega com o `onChange` terminado: o componente lê a lista para montar o texto do Bézier `src/editor/shell/easing-curve.tsx:80` `points.join(', ')`; o campo do ponto digitado lê o seu valor `src/editor/shell/easing-curve.tsx:113` `value={points[i]}`. Resultado: ok.
### C2 intermediário
- n/a — a cópia e a substituição do ponto são locais ao tratador; a lista guardada só muda no `setPoints` `src/editor/shell/easing-curve.tsx:116` `const next = [...points];`.
### C3 em curso
- n/a — `setPoints` agenda o próximo render; o leitor corre depois do retorno do tratador `src/editor/shell/easing-curve.tsx:118` `setPoints(next);`.
### C4 desmontagem
- n/a — a lista é estado de `EasingChooser` e cai com ele ao fechar o popover `src/editor/shell/easing-curve.tsx:79` `const [points, setPoints] = useState<readonly string[]>(() => pointsOf(value).map(written));`.
## Resultado
- A curva grande é redesenhada com o Bézier da lista lida `src/editor/shell/easing-curve.tsx:96` `<EasingCurve text={valid ? bezier : value} size={96} label={bezier} />`.
