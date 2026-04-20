import { ReflectedLong } from "lib";

import {
  contentSetTest,
  createAttributeBuilder,
  defaultValueTest,
  idlSetTest,
  testReflection,
  TestTable,
  type Test,
} from "../../utils";

const sym = Symbol("sym");
const obj = {};
const fn = () => 0;

const tests = new TestTable(
  {
    contentName: [undefined, "index"],
    nonNegative: [undefined, false, true],
    defaultValue: [undefined, -42, 42],
  },
  [
    defaultValueTest(0),
    idlSetTest(undefined, 0, "0"),
    idlSetTest(false, 0, "0"),
    idlSetTest(true, 1, "1"),
    idlSetTest(42, 42, "42"),
    idlSetTest(-42, -42, "-42"),
    idlSetTest(2.71828182846, 2, "2"),
    idlSetTest(2147483648 /* = 2^31 */, -2147483648, "-2147483648"),
    idlSetTest(NaN, 0, "0"),
    idlSetTest("42", 42, "42"),
    idlSetTest("-42", -42, "-42"),
    idlSetTest("2.71828182846", 2, "2"),
    idlSetTest("2147483648", -Math.pow(2, 31), "-2147483648"),
    idlSetTest("string", 0, "0"),
    idlSetTest(sym, TypeError, null),
    idlSetTest(null, 0, "0"),
    idlSetTest(obj, 0, "0"),
    idlSetTest(BigInt(0), 0, "0"),
    idlSetTest(BigInt(42), 42, "42"),
    idlSetTest(BigInt(2147483648), -2147483648, "-2147483648"),
    idlSetTest(fn, 0, "0"),
    contentSetTest(null, 0),
    contentSetTest("string", 0),
    contentSetTest("42", 42),
    contentSetTest("-42", -42),
    contentSetTest("2.71828182846", 2),
    contentSetTest("2147483648", 0),
  ] as Test<number>[],
);

tests.override(
  {
    nonNegative: [true],
  },
  [
    defaultValueTest(-1),
    contentSetTest(null, -1),
    contentSetTest("-42", -1),
    contentSetTest("string", -1),
    contentSetTest("2147483648", -1),
  ],
);

tests.override(
  {
    defaultValue: [-42, 42],
  },
  ({ defaultValue }) => [
    defaultValueTest(defaultValue!),
    contentSetTest(null, defaultValue!),
    contentSetTest("string", defaultValue!),
    contentSetTest("2147483648", defaultValue!),
  ],
);

tests.override(
  {
    nonNegative: [true],
  },
  [
    idlSetTest(-42, DOMException, null),
    idlSetTest(Math.pow(2, 31), DOMException, null),
    idlSetTest("-42", DOMException, null),
    idlSetTest("2147483648", DOMException, null),
    idlSetTest(BigInt(2147483648), DOMException, null),
  ] as unknown as Test<number>[],
);

tests.override(
  {
    nonNegative: [true],
    defaultValue: [-42, 42],
  },
  ({ defaultValue }) => [contentSetTest("-42", defaultValue!)],
);

testReflection("@ReflectedLong", tests, (options) => {
  const builder = createAttributeBuilder(ReflectedLong(options), 0, {
    contentName: options.contentName,
  });

  return () => builder().attribute;
});
