import { EnumeratedAttributeStates } from "@spec/html";

import {
  type ReflectedTarget,
  type ReflectedIDLAttribute as BaseReflectedIDLAttribute,
  type ReflectedContentAttribute as BaseReflectedContentAttribute,
} from "./types";

export type { ReflectedTarget };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  readonly limitedToOnlyKnownValue: boolean;
}

export interface ReflectedContentAttribute extends BaseReflectedContentAttribute {
  states: EnumeratedAttributeStates | null;
}

export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttribute: ReflectedContentAttribute,
): string {
  // const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute();

  // > Let attributeDefinition be the attribute definition of *element*'s content attribute
  // > whose namespace is null and local name is the reflected content attribute name.
  const attributeDefinition = reflectedContentAttribute;

  if (
    // > ... attributeDefinition indicates it is an enumerated attribute ...
    attributeDefinition.states !== null &&
    reflectedIDLAttribute.limitedToOnlyKnownValue
  ) {
    const state = attributeDefinition.states.get(contentAttributeValue);

    if (state === null || state.keywords.size === 0) {
      return "";
    }

    return state.canonicalKeyword;
  }

  if (contentAttributeValue === null) {
    return "";
  }

  return contentAttributeValue;
}

export function setter(
  this: ReflectedTarget,
  _: ReflectedIDLAttribute,
  __: ReflectedContentAttribute,
  value: string,
): void {
  this.setContentAttribute(value);
}
