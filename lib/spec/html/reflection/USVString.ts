import { convertStringIntoScalarValueString } from "@spec/infra";
import { failure } from "@spec/shared";

import { encodingParseAndSerializeURL } from "../parsingURLs";

import {
  type ReflectedTarget,
  type ReflectedIDLAttribute as BaseReflectedIDLAttribute,
  type ReflectedContentAttribute,
} from "./types";

export type { ReflectedTarget, ReflectedContentAttribute };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  readonly treatedAsURL: boolean;
}

export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
): string {
  const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute();

  if (contentAttributeValue === null) {
    return "";
  }

  if (reflectedIDLAttribute.treatedAsURL) {
    const urlString = encodingParseAndSerializeURL(
      contentAttributeValue,
      element.ownerDocument,
    );

    if (urlString !== failure) {
      return urlString;
    }
  }

  return convertStringIntoScalarValueString(contentAttributeValue);
}

export function setter(
  this: ReflectedTarget,
  _: ReflectedIDLAttribute,
  __: ReflectedContentAttribute,
  value: string,
): void {
  this.setContentAttribute(value);
}
