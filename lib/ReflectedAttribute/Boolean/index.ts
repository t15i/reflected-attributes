import * as webidl from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getter,
  setter,
} from "@spec/html/reflection/Boolean";

import { ReflectedTargetImpl } from "../ReflectedTarget";
import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createCachedReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";

import { type ReflectedBooleanOptions } from "./types";
import { asReflectedBooleanOptions } from "./typeguards";

const reflectedBooleanSpec = {
  getter,
  setter,
};

const ReflectedBooleanDefault = ReflectedBoolean();

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `boolean`.
 *
 * @param options - An {@link ReflectedBooleanOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomInputElement extends HTMLElement {
 *   \@ReflectedBoolean({ contentName: 'checked' })
 *   accessor defaultChecked: boolean
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedBoolean(
  options?: ReflectedBooleanOptions | undefined,
): ReflectedAttributeDecorator<boolean>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `boolean`.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomDivElement extends HTMLElement {
 *   \@ReflectedBoolean
 *   accessor inert: boolean
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedBoolean(
  target: ReflectedAttributeDecoratorTarget<boolean>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<boolean>;

export function ReflectedBoolean(...args: unknown[]) {
  if (isReflectedAttributeDecoratorParams<boolean>(args)) {
    return ReflectedBooleanDefault(args[0], args[1]);
  }

  const { contentName } = asReflectedBooleanOptions(args[0] ?? {});

  return createCachedReflectedAttributeDecorator<
    boolean,
    ReflectedTarget,
    ReflectedIDLAttribute
  >(webidl.Boolean, reflectedBooleanSpec, {
    initReflectedTarget: (element, context) =>
      new ReflectedTargetImpl<ReflectedContentAttribute>(
        element,
        context.reflectedContentAttribute,
      ),
    initReflectedIDLAttribute: ({ idlName }) => ({
      name: idlName,
    }),
    initReflectedContentAttribute: ({ idlName }) => ({
      name: contentName ?? idlName.toLowerCase(),
    }),
  });
}

export * from "./types";
