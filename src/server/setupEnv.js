import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { join } from 'node:path';
import { myLogger } from './myLogger.js';

const dir = fileURLToPath(import.meta.url);
dotenv.config({
  path: join(dir, '../../../.env'),
});
if (process.env.DEBUG_SETUP_ENV) {
  myLogger.debug(
    'environment variables set up',
    Object.fromEntries(
      Object.entries(process.env).filter(
        (entry) => !entry[0].endsWith('PATH'),
      ),
    ),
  );
}
