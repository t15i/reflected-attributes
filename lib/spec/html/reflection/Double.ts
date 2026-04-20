import {
  bestRepresentationAsFloatingPointNumber,
  floatingPointNumberParsing,
} from "@spec/html";

import {
  type ReflectedTarget,
  type ReflectedContentAttribute,
  type ReflectedIDLAttribute as BaseReflectedIDLAttribute,
} from "./types";

export type { ReflectedTarget, ReflectedContentAttribute };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  readonly limitedToOnlyPositiveNumbers: boolean;
  readonly defaultValue: number | null;
}

/**/
export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
): number {
  const contentAttributeValue = this.getContentAttribute();

  if (contentAttributeValue !== null) {
    const parsedValue = floatingPointNumberParsing(contentAttributeValue);

    if (parsedValue !== "error" && parsedValue > 0) {
      return parsedValue;
    }

    if (
      parsedValue !== "error" &&
      !reflectedIDLAttribute.limitedToOnlyPositiveNumbers
    ) {
      return parsedValue;
    }
  }

  if (reflectedIDLAttribute.defaultValue !== null) {
    return reflectedIDLAttribute.defaultValue;
  }

  return 0;
}

/**/
export function setter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  _: ReflectedContentAttribute,
  value: number,
): void {
  if (reflectedIDLAttribute.limitedToOnlyPositiveNumbers && value <= 0) {
    return;
  }

  this.setContentAttribute(bestRepresentationAsFloatingPointNumber(value));
}

export * from "./types";
