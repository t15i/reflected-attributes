import { describe, expect, test } from "vitest";

import { ReflectedBoolean, ReflectedTarget } from "lib";

describe("@ReflectedAttribute typeguard tests", () => {
  test("should throw if content attribute names collide", () => {
    expect(() => {
      @ReflectedTarget
      class MyCustomElement extends HTMLElement {
        @ReflectedBoolean
        accessor checked: boolean = false;

        @ReflectedBoolean({ contentName: "checked" })
        accessor defaultChecked: boolean = false;
      }
      return MyCustomElement;
    }).toThrow(
      Error(
        "Content attribute 'checked' is already reflected by another IDL attribute. This may indicate a collision in the attribute declaration or a missing @ReflectedTarget.",
      ),
    );
  });
});
