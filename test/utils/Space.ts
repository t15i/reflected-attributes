export type Space<Type> = {
  [Property in keyof Type]: Type[Property][];
};

export function copySpace<T>(space: Space<T>): Space<T> {
  return { ...space };
}

export function* iterateSpace<T>(space: Space<T>): Generator<T> {
  let size = 1;
  for (const axisName in space) {
    size *= space[axisName].length;
  }

  for (let i = 0; i < size; ++i) {
    const point: Record<string, unknown> = {};

    let rest = i;
    for (const axisName in space) {
      const index = rest % space[axisName].length;
      rest = (rest - index) / space[axisName].length;

      if (space[axisName][index] !== undefined) {
        point[axisName] = space[axisName][index];
      }
    }

    yield point as T;
  }
}
