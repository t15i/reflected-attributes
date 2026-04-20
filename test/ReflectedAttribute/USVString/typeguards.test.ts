import { ReflectedUSVString } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedUSVString typeguard tests", () => {
  test.each([
    {
      details: "has property url which is not boolean",
      options: { url: undefined },
      error: TypeError("Expected options.url to be 'boolean', got 'undefined'"),
    },
  ])("should throw if options $details", ({ options, error }) => {
    expect(() => ReflectedUSVString(options as any)).toThrow(error);
  });
});
