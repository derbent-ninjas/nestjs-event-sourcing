import { Injectable } from '@nestjs/common';
import getUuidByString from 'uuid-by-string';
import { v4 } from 'uuid';

@Injectable()
export class RandomService {
  uuid(seed?: string): string {
    return seed ? getUuidByString(seed, 5) : v4();
  }
}
