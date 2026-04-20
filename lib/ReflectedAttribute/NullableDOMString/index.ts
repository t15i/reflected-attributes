import { Nullable, DOMString } from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getter,
  setter,
} from "@spec/html/reflection/NullableDOMString";

import { ReflectedTargetImpl } from "../ReflectedTarget";
import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { createCachedReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createEnumeratedAttributeStates } from "../utils";

import { type ReflectedNullableDOMStringOptions } from "./types";
import { asReflectedNullableDOMStringOptions } from "./typeguards";

const NullableDOMString = Nullable(DOMString);

const reflectedNullableDOMStringSpec = {
  getter,
  setter,
};

const ReflectedNullableDOMStringDefault = ReflectedNullableDOMString();

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `DOMString?`.
 *
 * @param options - An {@link ReflectedNullableDOMStringOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomDivElement extends HTMLElement {
 *   \@ReflectedNullableDOMString({ contentName: 'aria-checked' })
 *   accessor ariaChecked: string | null
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedNullableDOMString(
  options?: ReflectedNullableDOMStringOptions | undefined,
): ReflectedAttributeDecorator<string | null>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `DOMString?`.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomDivElement extends HTMLElement {
 *   \@ReflectedNullableDOMString
 *   accessor role: string | null
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedNullableDOMString(
  target: ReflectedAttributeDecoratorTarget<string | null>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<string | null>;

export function ReflectedNullableDOMString(...args: unknown[]) {
  if (isReflectedAttributeDecoratorParams<string | null>(args)) {
    return ReflectedNullableDOMStringDefault(args[0], args[1]);
  }

  const { contentName, knownValues, ...specials } =
    asReflectedNullableDOMStringOptions(args[0] ?? {});

  return createCachedReflectedAttributeDecorator<
    string | null,
    ReflectedTarget,
    ReflectedIDLAttribute,
    ReflectedContentAttribute
  >(NullableDOMString, reflectedNullableDOMStringSpec, {
    initReflectedTarget: (element, context) =>
      new ReflectedTargetImpl<ReflectedContentAttribute>(
        element,
        context.reflectedContentAttribute,
      ),
    initReflectedIDLAttribute: ({ idlName }) => ({
      name: idlName,
      limitedToOnlyKnownValue: knownValues !== undefined,
    }),
    initReflectedContentAttribute: ({ idlName }) => ({
      name: contentName ?? idlName.toLowerCase(),
      states:
        knownValues !== undefined
          ? createEnumeratedAttributeStates(knownValues, specials)
          : null,
    }),
  });
}

export * from "./types";
