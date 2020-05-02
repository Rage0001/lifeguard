import {AssertionError} from 'assert';

export function assert(assertion: boolean, msg: string): asserts assertion {
  if (!assertion) {
    throw new AssertionError({
      message: msg,
    });
  }
}
