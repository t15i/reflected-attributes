export interface ReflectedTarget {
  getElement(): Element;
  getContentAttribute(): string | null;
  setContentAttribute(value: string): void;
  deleteContentAttribute(): void;
}

export interface ReflectedIDLAttribute {
  readonly name: string;
}

export interface ReflectedContentAttribute {
  readonly name: string;
}
