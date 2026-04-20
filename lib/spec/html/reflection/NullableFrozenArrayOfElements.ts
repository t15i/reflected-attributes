import { Interface, FrozenArray } from "@spec/webidl";

import {
  type ReflectedTarget as BaseReflectedTarget,
  type ReflectedIDLAttribute as BaseReflectedIDLAttribute,
  type ReflectedContentAttribute,
} from "./types";
import { firstElementInTreeOrderThatMeetsCriteria } from "./utils";

export interface ReflectedTarget<
  T extends Element,
> extends BaseReflectedTarget {
  explicitlySetElements: WeakRef<T>[] | null;
  cachedAssociatedElements: T[] | null;
  getAssociatedElements(): T[] | null;
}

export interface ReflectedIDLAttribute<
  T extends Element,
> extends BaseReflectedIDLAttribute {
  readonly T: new () => T;
}

export type { ReflectedContentAttribute };

export function getAssociatedElements<T extends Element>(
  this: ReflectedTarget<T>,
  reflectedIDLAttribute: ReflectedIDLAttribute<T>,
): T[] | null {
  const elements: T[] = [];
  const element = this.getElement();

  if (this.explicitlySetElements !== null) {
    for (const attrElementRef of this.explicitlySetElements) {
      const attrElement = attrElementRef.deref();

      if (attrElement?.getRootNode() === element.getRootNode()) {
        elements.push(attrElement);
      }
    }
  } else {
    const contentAttributeValue = this.getContentAttribute();

    if (contentAttributeValue === null) {
      return null;
    }

    const tokens = contentAttributeValue.split(" ");

    for (const id of tokens) {
      const candidate = firstElementInTreeOrderThatMeetsCriteria({
        root: element.getRootNode(),
        id,
        T: reflectedIDLAttribute.T,
      });

      if (candidate === null) {
        continue;
      }

      elements.push(candidate);
    }
  }

  return elements;
}

export function getter<T extends Element>(
  this: ReflectedTarget<T>,
  reflectedIDLAttribute: ReflectedIDLAttribute<T>,
): T[] | null {
  const elements = this.getAssociatedElements();

  if (elements === null && this.cachedAssociatedElements === null) {
    return null;
  }

  if (
    elements !== null &&
    this.cachedAssociatedElements !== null &&
    elements.length === this.cachedAssociatedElements.length &&
    elements.every(
      (element, index) => element === this.cachedAssociatedElements?.[index],
    )
  ) {
    return this.cachedAssociatedElements;
  }

  const elementsAsFrozenArray = FrozenArray(
    Interface(reflectedIDLAttribute.T),
    elements,
  );

  this.cachedAssociatedElements = elementsAsFrozenArray;
  return elementsAsFrozenArray;
}

export function setter<T extends Element>(
  this: ReflectedTarget<T>,
  _: ReflectedIDLAttribute<T>,
  __: ReflectedContentAttribute,
  value: T[] | null,
): void {
  if (value === null) {
    this.explicitlySetElements = null;
    this.deleteContentAttribute();
    return;
  }

  this.setContentAttribute("");

  const elements = [];
  for (const element of value) {
    elements.push(new WeakRef(element));
  }

  this.explicitlySetElements = elements;
}

export function attributeChanged<T extends Element>(
  this: ReflectedTarget<T>,
  _: ReflectedIDLAttribute<T>,
  reflectedContentAttribute: ReflectedContentAttribute,
  __: T,
  localName: string,
  ___: string | null,
  ____: string | null,
  namespace: string | null,
): void {
  if (localName !== reflectedContentAttribute.name || namespace !== null) {
    return;
  }
  this.explicitlySetElements = null;
}
