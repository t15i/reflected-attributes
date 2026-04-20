import { contentEqual } from "./contentEqual";
import { copySpace, iterateSpace, type Space } from "./Space";
import { type ErrorExpected } from "./types";

export type TestHead =
  | {
      type: "defaultValue";
      test: unknown;
    }
  | {
      type: "idl";
      test: unknown;
    }
  | {
      type: "content";
      test: string | null;
    };

export interface Expected<T> {
  idl: T | ErrorExpected;
  content: string | null;
}

export type Test<T> =
  | {
      type: "defaultValue";
      test: unknown;
      expected: Expected<T>;
    }
  | {
      type: "idl";
      test: unknown;
      expected: Expected<T>;
    }
  | {
      type: "content";
      test: string | null;
      expected: Expected<T>;
    };

export type Item<T, Opt extends object> = {
  options: Opt;
  testHead: TestHead;
  expected: Expected<T>;
};

/**/
export function defaultValueTest<T>(expectedIdl: T | ErrorExpected): Test<T> {
  return {
    type: "defaultValue",
    test: null,
    expected: { idl: expectedIdl, content: null },
  };
}

/**/
export function idlSetTest<T>(
  test: unknown,
  expectedIdl: T | ErrorExpected,
  expectedContent: string | null,
): Test<T> {
  return {
    type: "idl",
    test,
    expected: { idl: expectedIdl, content: expectedContent },
  };
}

/**/
export function contentSetTest<T>(
  test: string | null,
  expectedIdl: T | ErrorExpected,
): Test<T> {
  return {
    type: "content",
    test,
    expected: { idl: expectedIdl, content: test },
  };
}

export class TestTable<T, Opt extends object = object> {
  protected optionsSpace_: Space<Opt>;

  protected tests_: { head: TestHead; expected: Expected<T> }[];

  protected overrides_: {
    options: Opt;
    testHead: TestHead;
    expected: Expected<T>;
  }[] = [];

  /**/
  public constructor(optionsSpace: Space<Opt>, tests: Test<T>[]) {
    this.optionsSpace_ = copySpace(optionsSpace);
    this.tests_ = tests.map(({ type, test, expected }) => ({
      head: { type, test } as TestHead,
      expected: { ...expected },
    }));
  }

  public get(options: Opt, testHead: TestHead): Expected<T> | void {
    const override = this.overrides_.find(
      (override) =>
        contentEqual(override.options, options) &&
        contentEqual(override.testHead, testHead),
    );

    if (override !== undefined) {
      return override.expected;
    }

    const defaultTest = this.tests_.find((test) =>
      contentEqual(test.head, testHead),
    );

    if (defaultTest !== undefined) {
      return defaultTest.expected;
    }
  }

  /**/
  public override(
    optionsSpace: Partial<Space<Opt>>,
    overrides: Test<T>[] | ((options: Opt) => Test<T>[]),
  ): void {
    iterateSpace<Opt>({ ...this.optionsSpace_, ...optionsSpace }).forEach(
      (options) => {
        const tests =
          typeof overrides === "function" ? overrides(options) : overrides;

        tests.forEach((test) => {
          if (
            !iterateSpace(this.optionsSpace_).find((opt) =>
              contentEqual(opt, options),
            )
          ) {
            return;
          }

          const testHead = { type: test.type, test: test.test };

          const override = this.overrides_.find(
            (override) =>
              contentEqual(override.options, options) &&
              contentEqual(override.testHead, testHead),
          );

          if (override !== undefined) {
            override.expected = {
              ...override.expected,
              ...test.expected,
            };
            return;
          }

          const defaultTest = this.tests_.find((test) =>
            contentEqual(test.head, testHead),
          )!;

          this.overrides_.push({
            options: { ...options },
            testHead: { ...testHead } as TestHead,
            expected: { ...defaultTest.expected, ...test.expected },
          });
        });
      },
    );
  }

  /**/
  public options(): Generator<Opt> {
    return iterateSpace(this.optionsSpace_);
  }

  /**/
  public testHeads(): IteratorObject<TestHead> {
    return this.tests_.values().map((test) => test.head);
  }

  /**/
  public *items(): Generator<Item<T, Opt>> {
    for (const options of iterateSpace(this.optionsSpace_)) {
      for (const test of this.tests_) {
        yield {
          options,
          testHead: test.head,
          expected: this.get(options, test.head)!,
        };
      }
    }
  }
}
