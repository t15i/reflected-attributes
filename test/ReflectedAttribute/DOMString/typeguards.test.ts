import { ReflectedDOMString } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedDOMString typeguard tests", () => {
  test.each([
    {
      details: "has property knownValues which is not an array",
      options: { knownValues: undefined },
      error: TypeError(
        "Expected options.knownValues to be Array, got 'undefined'",
      ),
    },
    {
      details: "has property knownValues which has non-string/array item",
      options: { knownValues: ["string", [], undefined] },
      error: TypeError(
        "Expected options.knownValues[2] to be 'string' or Array, got 'undefined'",
      ),
    },
    {
      details: "has property knownValues[1] which has non-string item",
      options: { knownValues: ["string", ["string", undefined]] },
      error: TypeError(
        "Expected options.knownValues[1][1] to be 'string', got 'undefined'",
      ),
    },
    {
      details: "has property invalidValueDefault which is not a string",
      options: { invalidValueDefault: undefined },
      error: TypeError(
        "Expected options.invalidValueDefault to be 'string', got 'undefined'",
      ),
    },
    {
      details: "has property missingValueDefault which is not a string",
      options: { missingValueDefault: undefined },
      error: TypeError(
        "Expected options.missingValueDefault to be 'string', got 'undefined'",
      ),
    },
    {
      details: "has property emptyValueDefault which is not a string",
      options: { emptyValueDefault: undefined },
      error: TypeError(
        "Expected options.emptyValueDefault to be 'string', got 'undefined'",
      ),
    },
  ])("should throw if options $details", ({ options, error }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => ReflectedDOMString(options as any)).toThrow(error);
  });
});
