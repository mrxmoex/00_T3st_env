export function assertNever(value: never, label = "value"): never {
  throw new Error(`Unexhaustive ${label}: ${String(value)}`);
}
