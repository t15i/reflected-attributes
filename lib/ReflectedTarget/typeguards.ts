import { type CustomElementConstructor } from "./types";

export function asCustomElementConstructor(constructor: unknown) {
  if (typeof constructor !== "function") {
    throw TypeError(
      `Expected constructor to be 'function', got '${typeof constructor}'`,
    );
  }

  if (!(constructor.prototype instanceof HTMLElement)) {
    throw TypeError(`constructor does not inherit HTMLElement`);
  }

  if (
    "observedAttributes" in constructor &&
    !(
      constructor.observedAttributes !== null &&
      typeof constructor.observedAttributes === "object" &&
      Symbol.iterator in constructor.observedAttributes &&
      typeof constructor.observedAttributes[Symbol.iterator] !== "function"
    )
  ) {
    throw TypeError(
      `Expected constructor.observedAttributes to be Iterable, got '${typeof constructor.observedAttributes}'`,
    );
  }

  return constructor as CustomElementConstructor;
}
