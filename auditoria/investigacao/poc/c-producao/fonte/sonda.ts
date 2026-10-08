// A sonda de verificação: só o build de desenvolvimento e o de teste a carregam.
export function instalarSonda(): void {
  (globalThis as Record<string, unknown>).__sondaDeVerificacao = 'MARCA_DA_SONDA_DE_VERIFICACAO';
}
