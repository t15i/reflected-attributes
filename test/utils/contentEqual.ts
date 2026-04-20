function equal(a: unknown, b: unknown) {
  return a === b || (Number.isNaN(a) && Number.isNaN(b));
}

export function contentEqual(a: unknown, b: unknown): boolean {
  if (typeof a !== "object" || typeof b !== "object") {
    return equal(a, b);
  }

  if (a === null || b === null) {
    return a === b;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) =>
    equal(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key],
    ),
  );
}
