export interface ReflectedAttributeOptions {
  /**
   * A string containing the name of the reflected content attribute.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   // now reflects "checked" instead of "defaultChecked"
   *   \@ReflectedBoolean({ contentName: "checked" })
   *   accessor defaultChecked: boolean = false
   * })
   *
   * el = document.createElement('custom-element')
   * el.defaultChecked
   * // false
   * el.toggleAttribute('checked')
   * el.defaultChecked
   * // true
   * ```
   */
  contentName?: string | undefined;
}

export type ReflectedAttributeOptionsTypeguard = (
  value: unknown,
) => ReflectedAttributeOptions;

export interface ReflectedAttributeDecoratorTarget<Value> {
  get(this: Element): Value;
  set(this: Element, value: Value): void;
}

export interface ReflectedAttributeDecoratorContext {
  name: string;
}

export interface ReflectedAttributeDecoratorResult<Value> {
  get?(this: Element): Value;
  set?(this: Element, value: Value): void;
}

export type ReflectedAttributeDecorator<Value> = (
  target: ReflectedAttributeDecoratorTarget<Value>,
  context: ReflectedAttributeDecoratorContext,
) => ReflectedAttributeDecoratorResult<Value>;
