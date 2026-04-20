import { integerParsing } from "./signedIntegers";

// https://html.spec.whatwg.org/#rules-for-parsing-non-negative-integers
export function nonNegativeIntegerParsing(value: string): number | "error" {
  const parsedValue = integerParsing(value);

  if (parsedValue === "error") {
    return "error";
  }

  if (parsedValue < 0) {
    return "error";
  }

  return parsedValue;
}

// https://html.spec.whatwg.org/#valid-non-negative-integer
export function shortestPossibleRepresentingAsValidNonNegativeInteger(
  n: number,
): string {
  return String(n);
}
