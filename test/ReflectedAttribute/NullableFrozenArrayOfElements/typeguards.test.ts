import { ReflectedNullableFrozenArrayOfElements } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedNullableFrozenArrayOfElements typeguard tests", () => {
  test("should throw if T does not exist", () => {
    expect(() =>
      (ReflectedNullableFrozenArrayOfElements as Function)(),
    ).toThrow(TypeError("Expected T to be 'function', got 'undefined'"));
  });
  test("should throw if T does not inherit Element", () => {
    expect(() =>
      (ReflectedNullableFrozenArrayOfElements as Function)(() => {}),
    ).toThrow(TypeError("T does not inherit Element"));
  });
});
