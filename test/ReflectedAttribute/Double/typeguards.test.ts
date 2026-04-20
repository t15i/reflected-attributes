import { ReflectedDouble } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedDouble typeguard tests", () => {
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
  ])("should throw if options $details", ({ options, error }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => ReflectedDouble(options as any)).toThrow(error);
  });
});
