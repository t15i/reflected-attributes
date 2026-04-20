import { type ReflectedDoubleOptions } from "./types";

export function asReflectedDoubleOptions(options: unknown) {
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

  return options as ReflectedDoubleOptions;
}
