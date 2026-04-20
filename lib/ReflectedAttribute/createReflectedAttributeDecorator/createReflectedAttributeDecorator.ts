import {
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  type ReflectedTarget,
} from "@spec/html";

import {
  ReflectedTargetFamily,
  addAttributeChangedCallback,
} from "@/ReflectedTarget";

import {
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorTarget,
} from "../types";

import {
  type ReflectedAttributeParams,
  type ReflectedAttributeSpec,
} from "./types";
import {
  asReflectedAttributeDecoratorTarget,
  asReflectedAttributeDecoratorContext,
} from "./typeguards";

export function createReflectedAttributeDecorator<
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
  {
    initReflectedTarget,
    initReflectedIDLAttribute,
    initReflectedContentAttribute,
  }: ReflectedAttributeParams<Target, IDLAttr, ContentAttr, Value>,
) {
  return function (
    accessor: ReflectedAttributeDecoratorTarget<Value>,
    context: ReflectedAttributeDecoratorContext,
  ): ClassAccessorDecoratorResult<Element, Value> {
    accessor = asReflectedAttributeDecoratorTarget(accessor);
    context = asReflectedAttributeDecoratorContext(context);

    const reflectedIDLAttribute = initReflectedIDLAttribute({
      idlName: context.name,
    });

    const reflectedContentAttribute = initReflectedContentAttribute({
      idlName: context.name,
    });

    const reflectedTargetFamily = new ReflectedTargetFamily(function () {
      return initReflectedTarget(this, {
        reflectedIDLAttribute,
        reflectedContentAttribute,
        accessor,
      });
    });

    if (attributeChanged !== undefined) {
      addAttributeChangedCallback(
        reflectedContentAttribute.name,
        function (name, oldValue, value, namespace) {
          attributeChanged.call(
            reflectedTargetFamily.get(this),
            reflectedIDLAttribute,
            reflectedContentAttribute,
            this,
            name,
            oldValue,
            value,
            namespace,
          );
        },
      );
    }

    return {
      get: function () {
        return getter.call(
          reflectedTargetFamily.get(this),
          reflectedIDLAttribute,
          reflectedContentAttribute,
        );
      },
      set: function (value) {
        try {
          return setter.call(
            reflectedTargetFamily.get(this),
            reflectedIDLAttribute,
            reflectedContentAttribute,
            T(value),
          );
        } catch (e: unknown) {
          if (e instanceof Error) {
            const enrichedMessage = `Failed to set the '${reflectedIDLAttribute.name}' property on '${reflectedTargetFamily.get(this).constructor.name}': ${e.message}`;

            if (e instanceof DOMException) {
              // DOMException message property is readonly
              throw new DOMException(enrichedMessage, e.name);
            }

            e.message = enrichedMessage;
            throw e;
          }
        }
      },
    };
  };
}
