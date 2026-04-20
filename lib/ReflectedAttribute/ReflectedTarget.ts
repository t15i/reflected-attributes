import { type ReflectedContentAttribute } from "@spec/html";

export class ReflectedTargetImpl<
  ContentAttribute extends ReflectedContentAttribute =
    ReflectedContentAttribute,
> {
  protected element_: Element;

  protected contentAttribute_: ContentAttribute;

  public constructor(element: Element, contentAttribute: ContentAttribute) {
    this.element_ = element;
    this.contentAttribute_ = contentAttribute;
  }

  /* @inheritDoc */
  public getElement(): Element {
    return this.element_;
  }

  /* @inheritDoc */
  public getContentAttribute(): string | null {
    return this.element_.getAttributeNS(null, this.contentAttribute_.name);
  }

  /* @inheritDoc */
  public setContentAttribute(value: string): void {
    this.element_.setAttributeNS(null, this.contentAttribute_.name, value);
  }

  /* @inheritDoc */
  public deleteContentAttribute(): void {
    this.element_.removeAttributeNS(null, this.contentAttribute_.name);
  }
}
