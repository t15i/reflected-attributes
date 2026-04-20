import {
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorTarget,
  type ReflectedAttributeOptions,
} from "./types";

export function asReflectedAttributeOptions(options: unknown) {
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

  return options as ReflectedAttributeOptions;
}

export function isReflectedAttributeDecoratorParams<T>(
  args: unknown[],
): args is [
  ReflectedAttributeDecoratorTarget<T>,
  ReflectedAttributeDecoratorContext,
] {
  return (
    args.length == 2 &&
    typeof args[0] === "object" &&
    typeof args[1] === "object" &&
    args[0] !== null &&
    args[1] !== null
  );
}
