import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
  getAssociatedElements,
} from "@spec/html/reflection/NullableFrozenArrayOfElements";

import { ReflectedTargetImpl } from "../ReflectedTarget";

export class ReflectedNullableFrozenArrayOfElementsTargetImpl<T extends Element>
  extends ReflectedTargetImpl
  implements ReflectedTarget<T>
{
  /* @inheritDoc */
  public explicitlySetElements: WeakRef<T>[] | null = null;

  /* @inheritDoc */
  public get cachedAssociatedElements(): T[] | null {
    return (
      this.cachedAssociatedElementsAccessor_.get.call(this.element_) ?? null
    );
  }

  public set cachedAssociatedElements(elements) {
    this.cachedAssociatedElementsAccessor_.set.call(this.element_, elements);
  }

  /* @inheritDoc */
  public getAssociatedElements(): T[] | null {
    return getAssociatedElements.call(this, this.idlAttribute_) as T[] | null;
  }

  public constructor(params: {
    element: Element;
    idlAttribute: ReflectedIDLAttribute<T>;
    contentAttribute: ReflectedContentAttribute;
    cachedAssociatedElementsAccessor: ClassAccessorDecoratorTarget<
      Element,
      T[] | null
    >;
  }) {
    super(params.element, params.contentAttribute);

    this.idlAttribute_ = params.idlAttribute;
    this.cachedAssociatedElementsAccessor_ =
      params.cachedAssociatedElementsAccessor;
  }

  /**/
  protected idlAttribute_: ReflectedIDLAttribute<T>;

  /**/
  protected cachedAssociatedElementsAccessor_: ClassAccessorDecoratorTarget<
    Element,
    T[] | null
  >;
}
