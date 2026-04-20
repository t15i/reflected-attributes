import { type ReflectedUSVStringOptions } from "./types";

export function asReflectedUSVStringOptions(options: unknown) {
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

  if ("url" in options && typeof options.url !== "boolean") {
    throw TypeError(
      `Expected options.url to be 'boolean', got '${typeof options.url}'`,
    );
  }

  return options as ReflectedUSVStringOptions;
}
