// https://html.spec.whatwg.org/#rules-for-parsing-floating-point-number-values
export function floatingPointNumberParsing(value: string): number | "error" {
  const parsedValue = Number.parseFloat(value);

  if (!Number.isFinite(parsedValue)) {
    return "error";
  }

  return parsedValue;
}

// https://html.spec.whatwg.org/#best-representation-of-the-number-as-a-floating-point-number
export function bestRepresentationAsFloatingPointNumber(n: number): string {
  return String(n);
}
