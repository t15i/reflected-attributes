import {
  ReflectedBoolean,
  ReflectedDOMString,
  ReflectedDouble,
  ReflectedLong,
  ReflectedNullableDOMString,
  ReflectedNullableElement,
  ReflectedNullableFrozenArrayOfElements,
  ReflectedUSVString,
  ReflectedUnsignedLong,
} from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedAttribute typeguard tests", () => {
  describe.for([
    { name: "Boolean", factory: ReflectedBoolean },
    { name: "DOMString", factory: ReflectedDOMString },
    { name: "Double", factory: ReflectedDouble },
    { name: "Long", factory: ReflectedLong },
    { name: "NullableDOMString", factory: ReflectedNullableDOMString },
    {
      name: "NullableElement",
      factory: (...args: any) => ReflectedNullableElement(Element, ...args),
    },
    {
      name: "NullableFrozenArrayOfElements",
      factory: (...args: any) =>
        ReflectedNullableFrozenArrayOfElements(Element, ...args),
    },
    { name: "USVString", factory: ReflectedUSVString },
    { name: "UnsignedLong", factory: ReflectedUnsignedLong },
  ])("$name", (data) => {
    const factory = data.factory as Function;

    test.for([
      {
        details: "is not object",
        options: 0,
        error: TypeError(
          "Expected options to be non-null 'object', got 'number'",
        ),
      },
      {
        details: "has property contentName which is not a string",
        options: { contentName: Symbol(), Element },
        error: TypeError(
          "Expected options.contentName to be 'string', got 'symbol'",
        ),
      },
    ])("should throw if options $details", ({ options, error }) => {
      expect(() => factory(options)).toThrow(error);
    });

    const decorator = factory({ Element }) as Function;

    test.for([
      {
        details: "is not object",
        target: undefined,
        error: TypeError(
          "Expected target to be non-null 'object', got 'undefined'",
        ),
      },
      {
        details: "is null",
        target: null,
        error: TypeError("Expected target to be non-null 'object', got null"),
      },
      {
        details: "does not have get",
        target: {},
        error: TypeError("target.get is required, but does not exist"),
      },
      {
        details: "has .get which is not a function",
        target: { get: undefined, set() {} },
        error: TypeError(
          "Expected target.get to be 'function', got 'undefined'",
        ),
      },
      {
        details: "does not have set",
        target: { get() {} },
        error: TypeError("target.set is required, but does not exist"),
      },
      {
        details: "has .set which is not a function",
        target: { get() {}, set: undefined },
        error: TypeError(
          "Expected target.set to be 'function', got 'undefined'",
        ),
      },
    ])("should throw if target $details", ({ target, error }) => {
      expect(() => decorator(target, { name: "attribute" })).toThrow(error);
    });

    test.for([
      {
        details: "is not object",
        context: undefined,
        error: TypeError(
          "Expected context to be non-null 'object', got 'undefined'",
        ),
      },
      {
        details: "is null",
        context: null,
        error: TypeError("Expected context to be non-null 'object', got null"),
      },
      {
        details: "does not have name",
        context: {},
        error: TypeError("context.name is required, but does not exist"),
      },
      {
        details: "has .name which is not a string",
        context: { name: undefined },
        error: TypeError(
          "Expected context.name to be 'string', got 'undefined'",
        ),
      },
    ])("should throw if target $details", ({ context, error }) => {
      expect(() => decorator({ get() {}, set() {} }, context)).toThrow(error);
    });
  });
});
