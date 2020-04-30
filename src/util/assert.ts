import { AssertionError } from 'assert';

export function assert(assertion: any, msg: string): asserts assertion {
  if (!assertion) {
    throw new AssertionError({
      message: msg,
    });
  }
}
