import { USVString } from "@spec/webidl";
import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getter,
  setter,
} from "@spec/html/reflection/USVString";

import { ReflectedTargetImpl } from "../ReflectedTarget";
import {
  type ReflectedAttributeDecorator,
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
} from "../types";
import { isReflectedAttributeDecoratorParams } from "../typeguards";
import { createCachedReflectedAttributeDecorator } from "../createReflectedAttributeDecorator";

import { type ReflectedUSVStringOptions } from "./types";
import { asReflectedUSVStringOptions } from "./typeguards";

const reflectedUSVStringSpec = {
  getter,
  setter,
};

const ReflectedUSVStringDefault = ReflectedUSVString();

/**
 * Creates a decorator that transforms a class accessor into a reflected IDL attribute of type `USVString`.
 *
 * @param options - An {@link ReflectedUSVStringOptions | options object} applied to the created decorator.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomAnchorElement extends HTMLElement {
 *   \@ReflectedUSVString({ nonNegative: true })
 *   accessor href: string
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedUSVString(
  options?: ReflectedUSVStringOptions | undefined,
): ReflectedAttributeDecorator<string>;

/**
 * Transforms a class accessor into a reflected IDL attribute of type `USVString`.
 *
 * @remarks
 * The accessor transformed by the decorator is used to store the cached value.
 *
 * @example
 * ```ts
 * \@ReflectedTarget
 * class HTMLCustomElement extends HTMLElement {
 *   \@ReflectedUSVString
 *   accessor usv: string
 * }
 * ```
 *
 * @see https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
 */
export function ReflectedUSVString(
  target: ReflectedAttributeDecoratorTarget<string>,
  context: ReflectedAttributeDecoratorContext,
): ReflectedAttributeDecoratorResult<string>;

export function ReflectedUSVString(...args: unknown[]) {
  if (isReflectedAttributeDecoratorParams<string>(args)) {
    return ReflectedUSVStringDefault(args[0], args[1]);
  }

  const { contentName, url } = asReflectedUSVStringOptions(args[0] ?? {});

  return createCachedReflectedAttributeDecorator<
    string,
    ReflectedTarget,
    ReflectedIDLAttribute,
    ReflectedContentAttribute
  >(USVString, reflectedUSVStringSpec, {
    initReflectedTarget: (element, context) =>
      new ReflectedTargetImpl<ReflectedContentAttribute>(
        element,
        context.reflectedContentAttribute,
      ),
    initReflectedIDLAttribute: ({ idlName }) => ({
      name: idlName,
      treatedAsURL: url ?? false,
    }),
    initReflectedContentAttribute: ({ idlName }) => ({
      name: contentName ?? idlName.toLowerCase(),
    }),
  });
}

export * from "./types";
