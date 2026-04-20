import {
  type ReflectedAttributeDecoratorContext,
  type ReflectedAttributeDecoratorResult,
  type ReflectedAttributeDecoratorTarget,
  ReflectedTarget,
} from "lib";
import { type Attribute } from "./types";

type ReflectedAttributeDecorator<T> = (
  target: ReflectedAttributeDecoratorTarget<T>,
  context: ReflectedAttributeDecoratorContext,
) => ReflectedAttributeDecoratorResult<T>;

type AttributeBuilderFactoryOptions = {
  contentName?: string | undefined;
};

type AttributeBuilder<T> = () => {
  attribute: Attribute<T>;
  details: { element: Element };
};

let i = 0;

export function createAttributeBuilder<T>(
  ReflectedAttribute: ReflectedAttributeDecorator<T>,
  initialValue: T,
  options: AttributeBuilderFactoryOptions,
): AttributeBuilder<T> {
  let tagName: string;

  @ReflectedTarget
  class HTMLTestElement extends HTMLElement {
    @ReflectedAttribute
    accessor attribute: T = initialValue;
  }
  customElements.define((tagName = `my-test-${i++}`), HTMLTestElement);

  const contentName = options.contentName ?? "attribute";

  return () => {
    const element = document.createElement(tagName) as HTMLTestElement;
    return {
      attribute: {
        get idl() {
          return element.attribute;
        },
        set idl(value) {
          element.attribute = value;
        },
        get content() {
          return element.getAttribute(contentName);
        },
        set content(value) {
          if (value === null) element.removeAttribute(contentName);
          else element.setAttribute(contentName, value);
        },
      },
      details: {
        element,
      },
    };
  };
}
