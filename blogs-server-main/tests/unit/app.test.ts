import { strict as assert } from 'node:assert';
import { before, describe, test } from 'node:test';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { app } from '../../src/app';

// None of these requests reach the database: they stop at routing, parsing or authentication.
describe('HTTP boundaries without a database', () => {
  before(() => {
    process.env.JWT_KEY = 'synthetic-test-key-only-32-characters-minimum';
  });

  test('unknown routes answer with the JSON envelope', async () => {
    const res = await supertest(app).get('/api/nope').expect(404);
    assert.deepEqual(res.body, { payload: {}, message: 'Not found' });
  });

  test('malformed JSON is a 400, not an HTML stack page', async () => {
    const res = await supertest(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email":')
      .expect(400);
    assert.equal(res.body.message, 'Invalid request');
  });

  test('validation failures name the offending field', async () => {
    const res = await supertest(app)
      .post('/api/auth/signup')
      .send({ name: 'Ines Calloway', email: 'nope' })
      .expect(400);
    assert.match(res.body.message, /email|password/);
  });

  test('post routes require a token', async () => {
    await supertest(app).get('/api/posts').expect(401);
    await supertest(app).post('/api/posts').send({ title: 'Tide tables', content: 'Low water' }).expect(401);
  });

  test('a token signed with another key is refused', async () => {
    const forged = jwt.sign({ user: 'someone' }, 'another-key-that-is-long-enough-to-pass-32');
    await supertest(app).get('/api/posts').set('authtoken', forged).expect(401);
  });

  test('CORS only allows the configured web origin', async () => {
    const res = await supertest(app).options('/api/posts').set('Origin', 'http://localhost:3000');
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:3000');
  });
});
