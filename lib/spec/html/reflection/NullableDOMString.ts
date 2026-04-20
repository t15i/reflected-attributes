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
  readonly states: EnumeratedAttributeStates | null;
}

export function getter(
  this: ReflectedTarget,
  _: ReflectedIDLAttribute,
  reflectedContentAttribute: ReflectedContentAttribute,
): string | null {
  // const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute();

  // > Let attributeDefinition be the attribute definition of *element*'s content attribute
  // > whose namespace is null and local name is the reflected content attribute name.
  const attributeDefinition = reflectedContentAttribute;

  // > ... attributeDefinition indicates it is an enumerated attribute ...
  if (attributeDefinition.states !== null) {
    const state = attributeDefinition.states.get(contentAttributeValue);

    if (state?.canonicalKeyword === undefined) {
      return null;
    }

    return state.canonicalKeyword;
  }

  return contentAttributeValue;
}

/**/
export function setter(
  this: ReflectedTarget,
  _: ReflectedIDLAttribute,
  __: ReflectedContentAttribute,
  value: string | null,
): void {
  if (value === null) {
    this.deleteContentAttribute();
  } else {
    this.setContentAttribute(value);
  }
}
