import { ValueTransformer } from 'typeorm';
import assert from 'node:assert';
import { TSRange } from './TSRange';

export const tsRangeTransformer = {
  to(value: any): string {
    assert(value instanceof TSRange);
    return `[${value.start.toISOString()},${value.end.toISOString()})`;
  },
  from(value: string): TSRange {
    const trimmed = value.slice(1, -1);
    const [start, end] = trimmed.split(',');
    return TSRange.fromRaw({ start: new Date(start), end: new Date(end) });
  },
} satisfies ValueTransformer;

