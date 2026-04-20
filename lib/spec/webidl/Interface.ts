export function Interface<T extends object>(
  T: new (...args: unknown[]) => T,
): (raw: unknown) => T;

export function Interface<T extends object>(
  T: new (...args: unknown[]) => T,
  raw: unknown,
): T;

export function Interface<T extends object>(
  T: new (...args: unknown[]) => T,
  raw?: unknown,
) {
  if (arguments.length < 2) {
    return Interface.bind(undefined, T);
  }

  if (!(raw instanceof T)) {
    throw TypeError(`Failed to convert value to '${T.name}'`);
  }

  return raw;
}
