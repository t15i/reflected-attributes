import { type ReflectedDOMStringOptions } from "./types";

export function asReflectedDOMStringOptions(options: unknown) {
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

  if ("knownValues" in options) {
    if (!Array.isArray(options.knownValues)) {
      throw TypeError(
        `Expected options.knownValues to be Array, got '${typeof options.knownValues}'`,
      );
    }

    options.knownValues.forEach((knownValue, i1) => {
      if (typeof knownValue === "string") {
        return;
      }

      if (Array.isArray(knownValue)) {
        knownValue.forEach((knownValue, i2) => {
          if (typeof knownValue === "string") {
            return;
          }

          throw TypeError(
            `Expected options.knownValues[${i1}][${i2}] to be 'string', got '${typeof knownValue}'`,
          );
        });

        return;
      }

      throw TypeError(
        `Expected options.knownValues[${i1}] to be 'string' or Array, got '${typeof knownValue}'`,
      );
    });
  }

  if (
    "invalidValueDefault" in options &&
    typeof options.invalidValueDefault !== "string"
  ) {
    throw TypeError(
      `Expected options.invalidValueDefault to be 'string', got '${typeof options.invalidValueDefault}'`,
    );
  }

  if (
    "missingValueDefault" in options &&
    typeof options.missingValueDefault !== "string"
  ) {
    throw TypeError(
      `Expected options.missingValueDefault to be 'string', got '${typeof options.missingValueDefault}'`,
    );
  }

  if (
    "emptyValueDefault" in options &&
    typeof options.emptyValueDefault !== "string"
  ) {
    throw TypeError(
      `Expected options.emptyValueDefault to be 'string', got '${typeof options.emptyValueDefault}'`,
    );
  }

  return options as ReflectedDOMStringOptions;
}
