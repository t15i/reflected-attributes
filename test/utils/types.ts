export type Attribute<T> = {
  get idl(): T;
  set idl(value: unknown);

  get content(): string | null;
  set content(value: string | null);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructable = new (...params: any[]) => any;

export type ErrorExpected = Error | Constructable;
