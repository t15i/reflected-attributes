import { ReflectedTarget, ReflectedNullableElement } from "lib";

import { describe, expect, test } from "vitest";

describe("@ReflectedTarget", () => {
  test("reflected target should work properly on attribute reflection", () => {
    @ReflectedTarget
    class HTMLReflectedTargetElement extends HTMLElement {
      @ReflectedNullableElement(Element, {
        contentName: "popoverTarget",
      })
      accessor popoverTargetElement: Element | null = null;
    }

    customElements.define("test-correct", HTMLReflectedTargetElement);

    const element = document.createElement(
      "test-correct",
    ) as HTMLReflectedTargetElement;

    expect(() => element.popoverTargetElement).not.toThrow();
    expect(() => (element.popoverTargetElement = null)).not.toThrow();
  });

  test("not reflected target should throw on attribute reflection", () => {
    class HTMLReflectedTargetMissedElement extends HTMLElement {
      @ReflectedNullableElement(Element, {
        contentName: "popoverTarget",
      })
      accessor popoverTargetElement: Element | null = null;
    }

    customElements.define("test-missed", HTMLReflectedTargetMissedElement);

    const element = document.createElement(
      "test-missed",
    ) as HTMLReflectedTargetMissedElement;

    expect(() => element.popoverTargetElement).toThrow();
    expect(() => (element.popoverTargetElement = null)).toThrow();
  });
});
