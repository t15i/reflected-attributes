import { type ReflectedLongOptions } from "./types";

export function asReflectedLongOptions(options: unknown) {
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

  if ("nonNegative" in options && typeof options.nonNegative !== "boolean") {
    throw TypeError(
      `Expected options.nonNegative to be 'boolean', got '${typeof options.nonNegative}'`,
    );
  }

  if ("defaultValue" in options && typeof options.defaultValue !== "number") {
    throw TypeError(
      `Expected options.defaultValue to be 'number', got '${typeof options.defaultValue}'`,
    );
  }

  return options as ReflectedLongOptions;
}
