import { Nullable, FrozenArray, Interface } from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  getter,
  setter,
  attributeChanged,
} from "@spec/html/reflection/NullableFrozenArrayOfElements";

import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";

import { ReflectedNullableFrozenArrayOfElementsTargetImpl } from "./target";
import { type ReflectedNullableFrozenArrayOfElementsOptions } from "./types";
import {
  asReflectedNullableFrozenArrayOfElementsOptions,
  asT,
} from "./typeguards";

const reflectedNullableFrozenArrayOfElementsSpec = {
  getter,
  setter,
  attributeChanged,
};

const ReflectedNullableFrozenArrayOfElementsDefault =
  ReflectedNullableFrozenArrayOfElements(Element);

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `FrozenArray<T>?`.
 *
 * @param Element - A class constructor that extends `Element`.
 * @param options - An {@link ReflectedNullableFrozenArrayOfElementsOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomDivElement extends HTMLElement {
 *   \@ReflectedNullableFrozenArrayOfElements(Element, { contentName: 'aria-labelledby' })
 *   accessor ariaLabelledByElements: ReadonlyArray<Element> | null
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedNullableFrozenArrayOfElements<T extends Element>(
  Element: new () => T,
  options?: ReflectedNullableFrozenArrayOfElementsOptions | undefined,
): ReflectedAttributeDecorator<T[] | null>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `FrozenArray<T>?`.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomDivElement extends HTMLElement {
 *   \@ReflectedNullableFrozenArrayOfElements
 *   accessor ariaLabelledByElements: ReadonlyArray<Element> | null
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedNullableFrozenArrayOfElements(
  target: ReflectedAttributeDecoratorTarget<Element[] | null>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<Element[] | null>;

export function ReflectedNullableFrozenArrayOfElements<T extends Element>(
  ...args: unknown[]
) {
  if (isReflectedAttributeDecoratorParams<T[] | null>(args)) {
    return ReflectedNullableFrozenArrayOfElementsDefault(args[0], args[1]);
  }

  const T = asT<T>(args[0]);
  const { contentName } = asReflectedNullableFrozenArrayOfElementsOptions(
    args[1] ?? {},
  );

  return createReflectedAttributeDecorator<
    T[] | null,
    ReflectedTarget<T>,
    ReflectedIDLAttribute<T>
  >(
    Nullable(FrozenArray(Interface(T))),
    reflectedNullableFrozenArrayOfElementsSpec,
    {
      initReflectedTarget: (element, context) =>
        new ReflectedNullableFrozenArrayOfElementsTargetImpl({
          element,
          idlAttribute: context.reflectedIDLAttribute,
          contentAttribute: context.reflectedContentAttribute,
          cachedAssociatedElementsAccessor: context.accessor,
        }),
      initReflectedIDLAttribute: ({ idlName }) => ({
        name: idlName,
        T,
      }),
      initReflectedContentAttribute: ({ idlName }) => ({
        name: contentName ?? idlName.toLowerCase(),
      }),
    },
  );
}

export * from "./types";
