import { ReflectedTarget } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedTarget typeguard tests", () => {
  test.each([
    {
      details: "is not function",
      constructor: 0,
      error: TypeError("Expected constructor to be 'function', got 'number'"),
    },
    {
      details: "does not inherit HTMLElement",
      constructor: class {},
      error: TypeError("constructor does not inherit HTMLElement"),
    },
    {
      details: "has non-iterable observedAttributes",
      constructor: class extends HTMLElement {
        static observedAttributes = 0;
      },
      error: TypeError(
        "Expected constructor.observedAttributes to be Iterable, got 'number'",
      ),
    },
  ])("should throw if constructor $details", ({ constructor, error }) => {
    expect(() => ReflectedTarget(constructor as any)).toThrow(error);
  });
});
