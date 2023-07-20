import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import jwt from 'jsonwebtoken';
import authenticate from '../src/middlewares/authMiddleware';
import { getJwtKey } from '../src/helpers/tokenConfig';
const key = 'synthetic-test-key-only-32-characters-minimum';
function accepts(token?: string) {
  let accepted = false;
  const response: any = { status() { return this; }, json() { return this; } };
  authenticate({ headers: token ? { authtoken: token } : {} } as any, response, () => { accepted = true; });
  return accepted;
}
test('configuration rejects missing and short signing keys', () => {
  delete process.env.JWT_KEY;
  assert.throws(getJwtKey);
  process.env.JWT_KEY = 'short';
  assert.throws(getJwtKey);
  process.env.JWT_KEY = key;
  assert.equal(getJwtKey(), key);
});
test('authentication accepts a valid bounded token and rejects unsafe alternatives', () => {
  process.env.JWT_KEY = key;
  assert.equal(accepts(jwt.sign({ user: 'synthetic-user' }, key, { expiresIn: '1h' })), true);
  assert.equal(accepts(), false);
  assert.equal(accepts('invalid'), false);
  assert.equal(accepts(jwt.sign({ user: 'synthetic-user' }, key, { expiresIn: -1 })), false);
  assert.equal(accepts(jwt.sign({ user: 'synthetic-user' }, key, { algorithm: 'HS384' })), false);
  assert.equal(accepts(jwt.sign({ user: 123 }, key)), false);
  assert.equal(accepts(jwt.sign({ user: 'synthetic-user' }, 'different-key')), false);
});
