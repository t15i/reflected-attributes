import { Sequence } from "./Sequence";

export function FrozenArray<T>(
  T: (...args: unknown[]) => T,
): (raw: unknown) => T[];

export function FrozenArray<T>(T: (...args: unknown[]) => T, raw: unknown): T[];

export function FrozenArray<T>(T: (...args: unknown[]) => T, raw?: unknown) {
  if (arguments.length < 2) {
    return FrozenArray.bind(undefined, T);
  }

  const values = Sequence(T, raw);

  return Object.freeze(values);
}
