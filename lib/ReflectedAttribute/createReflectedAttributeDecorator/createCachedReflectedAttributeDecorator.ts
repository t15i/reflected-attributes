import {
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  type ReflectedTarget,
} from "@spec/html";

import { createReflectedAttributeDecorator } from "./createReflectedAttributeDecorator";

import {
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorTarget,
} from "../types";

import {
  type CachedReflectedAttributeParams,
  type ReflectedAttributeSpec,
} from "./types";
import {
  asReflectedAttributeDecoratorTarget,
  asReflectedAttributeDecoratorContext,
} from "./typeguards";

export function createCachedReflectedAttributeDecorator<
  Value,
  Target extends ReflectedTarget = ReflectedTarget,
  IDLAttr extends ReflectedIDLAttribute = ReflectedIDLAttribute,
  ContentAttr extends ReflectedContentAttribute = ReflectedContentAttribute,
>(
  T: (raw: unknown) => Value,
  {
    getter,
    setter,
    attributeChanged,
  }: ReflectedAttributeSpec<Target, IDLAttr, ContentAttr, Value>,
  params: CachedReflectedAttributeParams<Target, IDLAttr, ContentAttr>,
) {
  return function (
    cacheAccessor: ReflectedAttributeDecoratorTarget<Value>,
    context: ReflectedAttributeDecoratorContext,
  ): ClassAccessorDecoratorResult<Element, Value> {
    cacheAccessor = asReflectedAttributeDecoratorTarget(cacheAccessor);
    context = asReflectedAttributeDecoratorContext(context);

    const cacheValid = new WeakMap<Element, boolean>();

    return createReflectedAttributeDecorator(
      T,
      {
        getter(...params) {
          const element = this.getElement();

          if (cacheValid.get(element)) {
            return cacheAccessor.get.call(element);
          }

          const value = getter.call(this, ...params);

          cacheAccessor.set.call(element, value);
          cacheValid.set(element, true);

          return value;
        },
        setter(...params) {
          cacheValid.set(this.getElement(), false);
          return setter.call(this, ...params);
        },
        attributeChanged(...params) {
          cacheValid.set(params[2], false);
          attributeChanged?.call(this, ...params);
        },
      },
      params,
    )(cacheAccessor, context);
  };
}
