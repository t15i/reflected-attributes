import { type ReflectedUnsignedLongOptions } from "./types";

export function asReflectedUnsignedLongOptions(options: unknown) {
  if (options === null) {
    throw TypeError("Expected options to be non-null 'object', got null");
  }

  if (typeof options !== "object") {
    throw TypeError(
      `Expected options to be non-null 'object', got '${typeof options}'`,
    );
  }

  if ("contentName" in options && typeof options.contentName !== "string") {
    throw TypeError(
      `Expected options.contentName to be 'string', got '${typeof options.contentName}'`,
    );
  }

  if ("positive" in options && typeof options.positive !== "boolean") {
    throw TypeError(
      `Expected options.positive to be 'boolean', got '${typeof options.positive}'`,
    );
  }

  if ("defaultValue" in options && typeof options.defaultValue !== "number") {
    throw TypeError(
      `Expected options.defaultValue to be 'number', got '${typeof options.defaultValue}'`,
    );
  }

  if ("range" in options) {
    if (!Array.isArray(options.range)) {
      throw TypeError(
        `Expected options.range to be Array, got '${typeof options.range}'`,
      );
    }

    for (const i of [0, 1]) {
      if (typeof options.range[i] !== "number") {
        throw TypeError(
          `Expected options.range[${i}] to be 'number', got '${typeof options.range[i]}'`,
        );
      }
    }
  }

  return options as ReflectedUnsignedLongOptions;
}
