import { NOT_THE_INSTANCE_OF_ERROR_WAS_THROWN } from '../constants';

export function assertIsError(e: unknown): asserts e is Error {
  if (!(e instanceof Error)) {
    throw new TypeError(NOT_THE_INSTANCE_OF_ERROR_WAS_THROWN);
  }
}
