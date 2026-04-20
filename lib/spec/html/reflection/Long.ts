import * as webidl from "@spec/webidl";
import {
  integerParsing,
  nonNegativeIntegerParsing,
  shortestPossibleStringRepresentingAsValidInteger,
} from "@spec/html";

import {
  type ReflectedTarget,
  type ReflectedContentAttribute,
  type ReflectedIDLAttribute as BaseReflectedIDLAttribute,
} from "./types";

export type { ReflectedTarget, ReflectedContentAttribute };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  readonly limitedToOnlyNonNegativeNumbers: boolean;
  readonly defaultValue: number | null;
}

export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
): number {
  const contentAttributeValue = this.getContentAttribute();

  if (contentAttributeValue !== null) {
    const parsedValue = reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers
      ? nonNegativeIntegerParsing(contentAttributeValue)
      : integerParsing(contentAttributeValue);

    if (
      parsedValue !== "error" &&
      parsedValue >= webidl.Long.MIN &&
      parsedValue <= webidl.Long.MAX
    ) {
      return parsedValue;
    }
  }

  if (reflectedIDLAttribute.defaultValue !== null) {
    return reflectedIDLAttribute.defaultValue;
  }

  if (reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers) {
    return -1;
  }

  return 0;
}

export function setter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  _: ReflectedContentAttribute,
  value: number,
): void {
  if (reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers && value < 0) {
    throw new DOMException(
      `The value provided (${value}) is not positive or 0.`,
      "IndexSizeError",
    );
  }

  this.setContentAttribute(
    shortestPossibleStringRepresentingAsValidInteger(value),
  );
}
