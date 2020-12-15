export function filterUndefined<T>(t: T | undefined): t is T {
  return t !== undefined;
}
