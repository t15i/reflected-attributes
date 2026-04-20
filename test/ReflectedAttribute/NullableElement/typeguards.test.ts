import { ReflectedNullableElement } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedNullableElement typeguard tests", () => {
  test("should throw if T does not exist", () => {
    expect(() => (ReflectedNullableElement as Function)()).toThrow(
      TypeError("Expected T to be 'function', got 'undefined'"),
    );
  });
  test("should throw if T does not inherit Element", () => {
    expect(() => (ReflectedNullableElement as Function)(() => {})).toThrow(
      TypeError("T does not inherit Element"),
    );
  });
});
