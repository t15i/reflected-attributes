import { Nullable, Interface } from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  getter,
  setter,
  attributeChanged,
} from "@spec/html/reflection/NullableElement";

import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";

import { ReflectedNullableElementTargetImpl } from "./target";
import { type ReflectedNullableElementOptions } from "./types";
import { asReflectedNullableElementOptions, asT } from "./typeguards";

const reflectedNullableElementSpec = {
  getter,
  setter,
  attributeChanged,
};

const ReflectedNullableElementDefault = ReflectedNullableElement(Element);

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `T?`.
 *
 * @param Element - A class constructor that extends `Element`.
 * @param options - An {@link ReflectedNullableElementOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is ignored.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomMenuListElement extends HTMLElement {
 *   \@ReflectedNullableElement(HTMLCustomContextMenuElement, { contentName: 'submenu' })
 *   accessor submenuElement: HTMLCustomContextMenuElement | null
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedNullableElement<T extends Element>(
  Element: new () => T,
  options?: ReflectedNullableElementOptions | undefined,
): ReflectedAttributeDecorator<T | null>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `T?`.
 *
 * @remarks
 * The accessor transformed by the decorator is ignored.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomButtonElement extends HTMLElement {
 *   \@ReflectedNullableElement
 *   accessor commandForElement: Element | null
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedNullableElement(
  target: ReflectedAttributeDecoratorTarget<Element | null>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<Element | null>;

export function ReflectedNullableElement<T extends Element>(
  ...args: unknown[]
) {
  if (isReflectedAttributeDecoratorParams<T | null>(args)) {
    return ReflectedNullableElementDefault(args[0], args[1]);
  }

  const T = asT<T>(args[0]);
  const { contentName } = asReflectedNullableElementOptions(args[1] ?? {});

  return createReflectedAttributeDecorator<
    T | null,
    ReflectedTarget<T>,
    ReflectedIDLAttribute<T>
  >(Nullable(Interface(T)), reflectedNullableElementSpec, {
    initReflectedTarget: (element, context) =>
      new ReflectedNullableElementTargetImpl({
        element,
        idlAttribute: context.reflectedIDLAttribute,
        contentAttribute: context.reflectedContentAttribute,
      }),
    initReflectedIDLAttribute: ({ idlName }) => ({
      name: idlName,
      T,
    }),
    initReflectedContentAttribute: ({ idlName }) => ({
      name: contentName ?? idlName.toLowerCase(),
    }),
  });
}

export * from "./types";
