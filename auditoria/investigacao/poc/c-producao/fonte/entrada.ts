// Entrada mínima: o app chama a sonda atrás de import.meta.env.DEV e de uma constante que o build substitui.
declare const __SONDA__: boolean;
export function iniciar(): string {
  if (import.meta.env.DEV || __SONDA__) void import('./sonda.ts').then((m) => m.instalarSonda());
  return 'app';
}
iniciar();
