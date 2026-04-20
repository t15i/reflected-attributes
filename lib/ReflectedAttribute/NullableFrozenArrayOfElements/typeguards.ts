import { asReflectedAttributeOptions } from "../typeguards";
import { type ReflectedAttributeOptionsTypeguard } from "../types";

export function asT<T extends Element>(T: unknown) {
  if (typeof T !== "function") {
    throw TypeError(`Expected T to be 'function', got '${typeof T}'`);
  }

  if (!(T === Element || T.prototype instanceof Element)) {
    throw TypeError(`T does not inherit Element`);
  }

  return T as new () => T;
}

export const asReflectedNullableFrozenArrayOfElementsOptions: ReflectedAttributeOptionsTypeguard =
  asReflectedAttributeOptions;
