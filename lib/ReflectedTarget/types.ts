export type AttributeChangedCallback<
  This extends CustomElement = CustomElement,
> = (
  this: This,
  name: string,
  oldValue: string | null,
  value: string | null,
  namespace: string | null,
) => void;

export interface CustomElement extends HTMLElement {
  attributeChangedCallback?(
    ...params: Parameters<AttributeChangedCallback<this>>
  ): ReturnType<AttributeChangedCallback<this>>;
}

export interface CustomElementConstructor {
  readonly prototype: CustomElement;
  observedAttributes?: Iterable<unknown> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): CustomElement;
}
