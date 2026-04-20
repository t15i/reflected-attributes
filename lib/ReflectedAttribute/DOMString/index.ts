import { DOMString } from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getter,
  setter,
} from "@spec/html/reflection/DOMString";

import { ReflectedTargetImpl } from "../ReflectedTarget";
import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createCachedReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";
import { createEnumeratedAttributeStates } from "../utils";

import { type ReflectedDOMStringOptions } from "./types";
import { asReflectedDOMStringOptions } from "./typeguards";

const reflectedDOMStringSpec = {
  getter,
  setter,
};

const ReflectedDOMStringDefault = ReflectedDOMString();

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `DOMString`.
 *
 * @param options - An {@link ReflectedDOMStringOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomInputElement extends HTMLElement {
 *   \@ReflectedDOMString({
 *     knownValues: ['text', 'button', 'checkbox', 'radio'],
 *     missingValueDefault: 'text',
 *     emptyValueDefault: 'text',
 *     invalidValueDefault: 'text',
 *   })
 *   accessor type: string
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedDOMString(
  options?: ReflectedDOMStringOptions | undefined,
): ReflectedAttributeDecorator<string>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `DOMString`.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomInputElement extends HTMLElement {
 *   \@ReflectedDOMString
 *   accessor name: string
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedDOMString(
  target: ReflectedAttributeDecoratorTarget<string>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<string>;

export function ReflectedDOMString(...args: unknown[]) {
  if (isReflectedAttributeDecoratorParams<string>(args)) {
    return ReflectedDOMStringDefault(args[0], args[1]);
  }

  const { contentName, knownValues, ...special } = asReflectedDOMStringOptions(
    args[0] ?? {},
  );

  return createCachedReflectedAttributeDecorator<
    string,
    ReflectedTarget,
    ReflectedIDLAttribute,
    ReflectedContentAttribute
  >(DOMString, reflectedDOMStringSpec, {
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
          ? createEnumeratedAttributeStates(knownValues, special)
          : null,
    }),
  });
}

export * from "./types";
