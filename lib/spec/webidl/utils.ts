import { modulo, sign } from "@spec/ecma";

// https://webidl.spec.whatwg.org/#abstract-opdef-integerpart
export function integerPart(n: number): number {
  return sign(n) * Math.floor(Math.abs(n));
}

// https://webidl.spec.whatwg.org/#abstract-opdef-converttoint
export function convertToInt(
  value: unknown,
  bitLength: number,
  signedness?: "signed" | "unsigned",
): number {
  let x = Number(value);

  if (!Number.isFinite(x)) {
    return 0;
  }

  x = modulo(integerPart(x), Math.pow(2, bitLength));

  if (signedness === "signed" && x >= Math.pow(2, bitLength - 1)) {
    return x - Math.pow(2, bitLength);
  }

  return x;
}

// https://webidl.spec.whatwg.org/#create-sequence-from-iterable
export function createSequenceFromIterable<T>(
  T: (...args: unknown[]) => T,
  iterable: Iterable<unknown>,
): T[] {
  const sequence: T[] = [];
  const iterator = iterable[Symbol.iterator]();

  while (true) {
    const next = iterator.next();

    if (next.done) {
      return sequence;
    }

    sequence.push(T(next.value));
  }
}
