import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getAssociatedElement,
} from "@spec/html/reflection/NullableElement";

import { ReflectedTargetImpl } from "../ReflectedTarget";

export class ReflectedNullableElementTargetImpl<T extends Element>
  extends ReflectedTargetImpl
  implements ReflectedTarget<T>
{
  /* @inheritDoc */
  public explicitlySetElement: WeakRef<T> | null = null;

  /* @inheritDoc */
  public getAssociatedElement(): T | null {
    return getAssociatedElement.call(this, this.idlAttribute_) as T | null;
  }

  public constructor(params: {
    element: Element;
    idlAttribute: ReflectedIDLAttribute<T>;
    contentAttribute: ReflectedContentAttribute;
  }) {
    super(params.element, params.contentAttribute);
    this.idlAttribute_ = params.idlAttribute;
  }

  /**/
  protected idlAttribute_: ReflectedIDLAttribute<T>;
}
