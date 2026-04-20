import { ReflectedDouble } from "lib";

import {
  contentSetTest,
  createAttributeBuilder,
  defaultValueTest,
  idlSetTest,
  testReflection,
  TestTable,
  type Test,
} from "../../utils";

const tests = new TestTable(
  {
    contentName: [undefined, "checked"],
    positive: [undefined, false, true],
    defaultValue: [undefined, 42.42],
  },
  [
    defaultValueTest(0),
    idlSetTest(undefined, TypeError, null),
    idlSetTest(false, 0, "0"),
    idlSetTest(true, 1, "1"),
    idlSetTest(0, 0, "0"),
    idlSetTest(1, 1, "1"),
    idlSetTest(4.2, 4.2, "4.2"),
    // prettier-ignore
    idlSetTest(4.200, 4.2, "4.2"),
    idlSetTest(-4.2, -4.2, "-4.2"),
    idlSetTest(NaN, TypeError, null),
    idlSetTest("0", 0, "0"),
    idlSetTest("4.2", 4.2, "4.2"),
    idlSetTest("4.200", 4.2, "4.2"),
    idlSetTest("string", TypeError, null),
    idlSetTest(Symbol(), TypeError, null),
    idlSetTest(null, 0, "0"),
    idlSetTest({}, TypeError, null),
    idlSetTest(BigInt(0), 0, "0"),
    idlSetTest(BigInt(42), 42, "42"),
    idlSetTest(
      BigInt("9007199254740993"), // Number.MAX_SAFE_INTEGER + 2
      Number.MAX_SAFE_INTEGER + 1,
      String(Number.MAX_SAFE_INTEGER + 1),
    ),
    idlSetTest(() => 0, TypeError, null),
    contentSetTest(null, 0),
    contentSetTest("string", TypeError),
    contentSetTest("4.2", 4.2),
    contentSetTest("-4.2", -4.2),
    contentSetTest("4.200", 4.2),
  ] as Test<number | TypeErrorConstructor>[],
);

tests.override(
  {
    defaultValue: [42.42],
  },
  [defaultValueTest(42.42), contentSetTest(null, 42.42)],
);

tests.override(
  {
    positive: [true],
  },
  [
    defaultValueTest(0),
    idlSetTest(false, 0, null),
    idlSetTest(0, 0, null),
    idlSetTest(-4.2, 0, null),
    idlSetTest("0", 0, null),
    idlSetTest(null, 0, null),
    idlSetTest(BigInt(0), 0, null),
    contentSetTest(null, 0),
    contentSetTest("-4.2", 0),
  ],
);

tests.override(
  {
    positive: [true],
    defaultValue: [42.42],
  },
  [
    defaultValueTest(42.42),
    idlSetTest(false, 42.42, null),
    idlSetTest(0, 42.42, null),
    idlSetTest(-4.2, 42.42, null),
    idlSetTest("0", 42.42, null),
    idlSetTest(null, 42.42, null),
    idlSetTest(BigInt(0), 42.42, null),
    contentSetTest(null, 42.42),
    contentSetTest("-4.2", 42.42),
  ],
);

testReflection("@ReflectedDouble", tests, (options) => {
  const builder = createAttributeBuilder(ReflectedDouble(options), 0, {
    contentName: options.contentName,
  });

  return () => builder().attribute;
});
