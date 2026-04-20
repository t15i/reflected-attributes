import { ReflectedUnsignedLong } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedUnsignedLong typeguard tests", () => {
  test.each([
    {
      details: "has property positive which is not an boolean",
      options: { positive: undefined },
      error: TypeError(
        "Expected options.positive to be 'boolean', got 'undefined'",
      ),
    },
    {
      details: "has property defaultValue which is not an boolean",
      options: { defaultValue: undefined },
      error: TypeError(
        "Expected options.defaultValue to be 'number', got 'undefined'",
      ),
    },
    {
      details: "has property range which is not an array",
      options: { range: undefined },
      error: TypeError("Expected options.range to be Array, got 'undefined'"),
    },
    {
      details:
        "has property range which does not contain pair of numbers (first)",
      options: { range: [undefined, 0] },
      error: TypeError(
        "Expected options.range[0] to be 'number', got 'undefined'",
      ),
    },
    {
      details:
        "has property range which does not contain pair of numbers (second)",
      options: { range: [0, undefined] },
      error: TypeError(
        "Expected options.range[1] to be 'number', got 'undefined'",
      ),
    },
  ])("should throw if options $details", ({ options, error }) => {
    expect(() => ReflectedUnsignedLong(options as any)).toThrow(error);
  });
});
