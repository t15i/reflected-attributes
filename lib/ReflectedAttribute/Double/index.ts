import { Double } from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getter,
  setter,
} from "@spec/html/reflection/Double";

import { ReflectedTargetImpl } from "../ReflectedTarget";
import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createCachedReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";

import { type ReflectedDoubleOptions } from "./types";
import { asReflectedDoubleOptions } from "./typeguards";

const reflectedDoubleSpec = {
  getter,
  setter,
};

const ReflectedDoubleDefault = ReflectedDouble();

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `double`.
 *
 * @param options - An {@link ReflectedDoubleOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomProgressElement extends HTMLElement {
 *   \@ReflectedDouble({ positive: true, defaultValue: 1.0 })
 *   accessor max: number
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedDouble(
  options?: ReflectedDoubleOptions | undefined,
): ReflectedAttributeDecorator<number>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `double`.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomProgressElement extends HTMLElement {
 *   \@ReflectedDouble
 *   accessor value: number
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedDouble(
  target: ReflectedAttributeDecoratorTarget<number>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<number>;

export function ReflectedDouble(...args: unknown[]) {
  if (isReflectedAttributeDecoratorParams<number>(args)) {
    return ReflectedDoubleDefault(args[0], args[1]);
  }

  const { contentName, positive, defaultValue } = asReflectedDoubleOptions(
    args[0] ?? {},
  );

  return createCachedReflectedAttributeDecorator<
    number,
    ReflectedTarget,
    ReflectedIDLAttribute
  >(Double, reflectedDoubleSpec, {
    initReflectedTarget: (element, context) =>
      new ReflectedTargetImpl<ReflectedContentAttribute>(
        element,
        context.reflectedContentAttribute,
      ),
    initReflectedIDLAttribute: ({ idlName }) => ({
      name: idlName,
      limitedToOnlyPositiveNumbers: positive ?? false,
      defaultValue: defaultValue !== undefined ? Double(defaultValue) : null,
    }),
    initReflectedContentAttribute: ({ idlName }) => ({
      name: contentName ?? idlName.toLowerCase(),
    }),
  });
}

export * from "./types";
