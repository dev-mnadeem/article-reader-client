import { execFileSync } from 'node:child_process';

// The suite deletes every row, so it only ever runs against an explicitly named throwaway database.
const url = process.env.TEST_DATABASE_URL;
if (!url) {
  throw new Error('Set TEST_DATABASE_URL to a disposable PostgreSQL database; the integration suite wipes it.');
}
process.env.DATABASE_URL = url;
process.env.NODE_ENV = 'test';
process.env.JWT_KEY ??= 'integration-only-signing-key-0123456789';

execFileSync('npx', ['prisma', 'migrate', 'deploy'], { env: process.env, stdio: 'ignore' });
