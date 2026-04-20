import {
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorTarget,
} from "../types";

export function asReflectedAttributeDecoratorTarget<Value>(target: unknown) {
  if (target === null) {
    throw TypeError("Expected target to be non-null 'object', got null");
  }

  if (typeof target !== "object") {
    throw TypeError(
      `Expected target to be non-null 'object', got '${typeof target}'`,
    );
  }

  if (!("get" in target)) {
    throw TypeError("target.get is required, but does not exist");
  }

  if (typeof target.get !== "function") {
    throw TypeError(
      `Expected target.get to be 'function', got '${typeof target.get}'`,
    );
  }

  if (!("set" in target)) {
    throw TypeError("target.set is required, but does not exist");
  }

  if (typeof target.set !== "function") {
    throw TypeError(
      `Expected target.set to be 'function', got '${typeof target.set}'`,
    );
  }

  return target as ReflectedAttributeDecoratorTarget<Value>;
}

export function asReflectedAttributeDecoratorContext(context: unknown) {
  if (context === null) {
    throw TypeError("Expected context to be non-null 'object', got null");
  }

  if (typeof context !== "object") {
    throw TypeError(
      `Expected context to be non-null 'object', got '${typeof context}'`,
    );
  }

  if (!("name" in context)) {
    throw TypeError("context.name is required, but does not exist");
  }

  if (typeof context.name !== "string") {
    throw TypeError(
      `Expected context.name to be 'string', got '${typeof context.name}'`,
    );
  }

  return context as ReflectedAttributeDecoratorContext;
}
