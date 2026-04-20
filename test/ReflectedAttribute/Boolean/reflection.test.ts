import { ReflectedBoolean } from "lib";

import {
  contentSetTest,
  createAttributeBuilder,
  defaultValueTest,
  idlSetTest,
  testReflection,
  TestTable,
} from "../../utils";

const testTable = new TestTable(
  {
    contentName: [undefined, "checked"],
  },
  [
    defaultValueTest(false),
    idlSetTest(undefined, false, null),
    idlSetTest(false, false, null),
    idlSetTest(true, true, ""),
    idlSetTest(0, false, null),
    idlSetTest(1, true, ""),
    idlSetTest(42, true, ""),
    idlSetTest(-42, true, ""),
    idlSetTest(NaN, false, null),
    idlSetTest("", false, null),
    idlSetTest("string", true, ""),
    idlSetTest(Symbol(), true, ""),
    idlSetTest(null, false, null),
    idlSetTest({}, true, ""),
    idlSetTest(BigInt(0), false, null),
    idlSetTest(BigInt(1), true, ""),
    idlSetTest(BigInt(42), true, ""),
    idlSetTest(() => 0, true, ""),
    contentSetTest(null, false),
    contentSetTest("", true),
    contentSetTest("false", true),
    contentSetTest("true", true),
    contentSetTest("string", true),
  ],
);

testReflection("@ReflectedBoolean", testTable, (options) => {
  const builder = createAttributeBuilder(ReflectedBoolean(options), false, {
    contentName: options.contentName,
  });

  return () => builder().attribute;
});
