// The verification probe: only the development build and the test build load it.
export function installProbe(): void {
  (globalThis as Record<string, unknown>).__verificationProbe = 'VERIFICATION_PROBE_MARKER';
}
