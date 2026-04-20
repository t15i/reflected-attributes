import { Long } from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getter,
  setter,
} from "@spec/html/reflection/Long";

import { ReflectedTargetImpl } from "../ReflectedTarget";
import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createCachedReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";

import { type ReflectedLongOptions } from "./types";
import { asReflectedLongOptions } from "./typeguards";

const reflectedLongSpec = {
  getter,
  setter,
};

const ReflectedLongDefault = ReflectedLong();

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `long`.
 *
 * @param options - An {@link ReflectedLongOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomInputElement extends HTMLElement {
 *   \@ReflectedLong({ nonNegative: true })
 *   accessor maxLength: number
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedLong(
  options?: ReflectedLongOptions | undefined,
): ReflectedAttributeDecorator<number>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `long`.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomLiElement extends HTMLElement {
 *   \@ReflectedLong
 *   accessor value: number
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedLong(
  target: ReflectedAttributeDecoratorTarget<number>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<number>;

export function ReflectedLong(...args: unknown[]) {
  if (isReflectedAttributeDecoratorParams<number>(args)) {
    return ReflectedLongDefault(args[0], args[1]);
  }

  const { contentName, nonNegative, defaultValue } = asReflectedLongOptions(
    args[0] ?? {},
  );

  return createCachedReflectedAttributeDecorator<
    number,
    ReflectedTarget,
    ReflectedIDLAttribute
  >(Long, reflectedLongSpec, {
    initReflectedTarget: (element, context) =>
      new ReflectedTargetImpl<ReflectedContentAttribute>(
        element,
        context.reflectedContentAttribute,
      ),
    initReflectedIDLAttribute: ({ idlName }) => ({
      name: idlName,
      limitedToOnlyNonNegativeNumbers: nonNegative ?? false,
      defaultValue: defaultValue !== undefined ? Long(defaultValue) : null,
    }),
    initReflectedContentAttribute: ({ idlName }) => ({
      name: contentName ?? idlName.toLowerCase(),
    }),
  });
}

export * from "./types";
