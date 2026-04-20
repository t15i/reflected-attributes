import { UnsignedLong } from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getter,
  setter,
} from "@spec/html/reflection/UnsignedLong";

import { ReflectedTargetImpl } from "../ReflectedTarget";
import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createCachedReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";

import { type ReflectedUnsignedLongOptions } from "./types";
import { asReflectedUnsignedLongOptions } from "./typeguards";

const reflectedUnsignedLongSpec = {
  getter,
  setter,
};

const ReflectedUnsignedLongDefault = ReflectedUnsignedLong();

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `unsigned long`.
 *
 * @param options - An {@link ReflectedUnsignedLongOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomColElement extends HTMLElement {
 *   \@ReflectedUnsingedLong({ defaultValue: 1, range: [1, 1000] })
 *   accessor span: number
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedUnsignedLong(
  options?: ReflectedUnsignedLongOptions | undefined,
): ReflectedAttributeDecorator<number>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `unsigned long`.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomVideoElement extends HTMLElement {
 *   \@ReflectedUnsingedLong
 *   accessor width: number
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedUnsignedLong(
  target: ReflectedAttributeDecoratorTarget<number>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<number>;

export function ReflectedUnsignedLong(...args: unknown[]) {
  if (isReflectedAttributeDecoratorParams<number>(args)) {
    return ReflectedUnsignedLongDefault(args[0], args[1]);
  }

  const { contentName, positive, defaultValue, range } =
    asReflectedUnsignedLongOptions(args[0] ?? {});

  const clamped = range?.map((value) => UnsignedLong(value));

  return createCachedReflectedAttributeDecorator<
    number,
    ReflectedTarget,
    ReflectedIDLAttribute
  >(UnsignedLong, reflectedUnsignedLongSpec, {
    initReflectedTarget: (element, context) =>
      new ReflectedTargetImpl<ReflectedContentAttribute>(
        element,
        context.reflectedContentAttribute,
      ),
    initReflectedIDLAttribute: ({ idlName }) => ({
      name: idlName,
      limitedToOnlyPositiveNumbers: positive ?? false,
      limitedToOnlyPositiveNumbersWithFallback:
        (positive ?? false) && defaultValue !== null,
      defaultValue:
        defaultValue !== undefined ? UnsignedLong(defaultValue) : null,
      clampedToRange: clamped !== undefined,
      clampedMin: clamped !== undefined ? Math.min(...clamped) : 0,
      clampedMax: clamped !== undefined ? Math.max(...clamped) : 0,
    }),
    initReflectedContentAttribute: ({ idlName }) => ({
      name: contentName ?? idlName.toLowerCase(),
    }),
  });
}

export * from "./types";
