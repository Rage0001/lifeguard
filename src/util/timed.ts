// deno-lint-ignore no-explicit-any
export async function timed<T extends (...args: any) => any>(
  func: T,
  params?: Parameters<T>
): Promise<[number, ReturnType<T>]> {
  const t1 = performance.now();
  const val = params ? await func(params) : await func();
  const t2 = performance.now();
  return [t2 - t1, val];
}
