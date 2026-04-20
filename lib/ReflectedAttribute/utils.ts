import {
  EnumeratedAttributeState,
  EnumeratedAttributeStates,
} from "@spec/html";

export function createEnumeratedAttributeStates(
  knownValues: (string | string[])[],
  {
    invalidValueDefault,
    missingValueDefault,
    emptyValueDefault,
  }: {
    invalidValueDefault?: string | undefined;
    missingValueDefault?: string | undefined;
    emptyValueDefault?: string | undefined;
  },
): EnumeratedAttributeStates {
  const states = new Set(
    knownValues.map((knownValue) => {
      const keywords =
        typeof knownValue === "string" ? [knownValue] : knownValue;

      return new EnumeratedAttributeState({
        conformingKeywords: new Set(keywords),
        canonicalKeyword: keywords.values().find((keyword) => keyword !== ""),
      });
    }),
  );

  const [
    invalidValueDefaultState,
    missingValueDefaultState,
    emptyValueDefaultState,
  ] = [invalidValueDefault, missingValueDefault, emptyValueDefault].map(
    (keyword) => {
      if (keyword === undefined) {
        return undefined;
      }

      const state = states
        .values()
        .find((state) => state.keywords.has(keyword));

      if (state !== undefined) {
        return state;
      }

      return new EnumeratedAttributeState({
        conformingKeywords: new Set([keyword]),
      });
    },
  );

  return new EnumeratedAttributeStates({
    states,
    invalidValueDefault: invalidValueDefaultState,
    missingValueDefault: missingValueDefaultState,
    emptyValueDefault: emptyValueDefaultState,
  });
}
