import { type ReflectedTarget } from "@spec/html";

/**/
export const unusedFamilies: ReflectedTargetFamily[] = [];

/**/
export class ReflectedTargetFamily<
  T extends ReflectedTarget = ReflectedTarget,
> {
  /**/
  protected initializer_: (this: Element) => T;

  /**/
  protected reflectedTargets_: WeakMap<Element, T> = new WeakMap();

  /**/
  public constructor(initializer: (this: Element) => T) {
    this.initializer_ = initializer;

    unusedFamilies.push(this);
  }

  /**/
  public get(element: Element): T {
    const target = this.reflectedTargets_.get(element);

    if (target === undefined) {
      throw Error(
        "Cannot get reflected target. Did you forget to apply @ReflectedTarget?",
      );
    }

    return target;
  }

  /**/
  public add(element: Element): void {
    this.reflectedTargets_.set(element, this.initializer_.call(element));
  }
}
