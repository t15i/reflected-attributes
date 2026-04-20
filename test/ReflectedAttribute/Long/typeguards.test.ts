import { ReflectedLong } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedLong typeguard tests", () => {
  test.each([
    {
      details: "has property nonNegative which is not an boolean",
      options: { nonNegative: undefined },
      error: TypeError(
        "Expected options.nonNegative to be 'boolean', got 'undefined'",
      ),
    },
    {
      details: "has property defaultValue which is not an boolean",
      options: { defaultValue: undefined },
      error: TypeError(
        "Expected options.defaultValue to be 'number', got 'undefined'",
      ),
    },
  ])("should throw if options $details", ({ options, error }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => ReflectedLong(options as any)).toThrow(error);
  });
});
