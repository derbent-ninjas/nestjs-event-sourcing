import * as dotenv from 'dotenv';

export function loadEnvironment(): void {
  if (process.argv.find((arg) => arg === '--local-manual-tests')) {
    dotenv.config({ path: `environments/.env.local.test.manual` });
  } else {
    dotenv.config();
  }
}
