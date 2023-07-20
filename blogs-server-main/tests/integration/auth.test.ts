import './setup';
import { strict as assert } from 'node:assert';
import { after, beforeEach, describe, test } from 'node:test';
import { api, demoUser, prisma, resetDatabase, signUpAndLogin } from './helpers';

describe('signup and login against PostgreSQL', () => {
  beforeEach(resetDatabase);
  after(() => prisma.$disconnect());

  test('stores a bcrypt hash, never the password', async () => {
    await api().post('/api/auth/signup').send(demoUser).expect(200);
    const stored = await prisma.user.findUniqueOrThrow({ where: { email: demoUser.email } });
    assert.notEqual(stored.password, demoUser.password);
    assert.match(stored.password, /^\$2[aby]\$10\$/);
  });

  test('a repeated email is a 409, even with different casing', async () => {
    await api().post('/api/auth/signup').send(demoUser).expect(200);
    const res = await api()
      .post('/api/auth/signup')
      .send({ ...demoUser, email: demoUser.email.toUpperCase() })
      .expect(409);
    assert.equal(res.body.message, 'User already exists');
  });

  test('two simultaneous signups for one email create a single account', async () => {
    const statuses = await Promise.all([
      api().post('/api/auth/signup').send(demoUser),
      api().post('/api/auth/signup').send(demoUser),
    ]).then((responses) => responses.map((r) => r.status).sort());
    assert.deepEqual(statuses, [200, 409]);
    assert.equal(await prisma.user.count(), 1);
  });

  test('login returns a token that unlocks the feed', async () => {
    const token = await signUpAndLogin();
    assert.equal(typeof token, 'string');
    await api().get('/api/posts').set('authtoken', token).expect(200);
  });

  test('login ignores email case and surrounding spaces', async () => {
    await api().post('/api/auth/signup').send(demoUser).expect(200);
    await api()
      .post('/api/auth/login')
      .send({ email: '  INES.Calloway@example.com ', password: demoUser.password })
      .expect(200);
  });

  test('wrong password and unknown email get the same 401', async () => {
    await api().post('/api/auth/signup').send(demoUser).expect(200);
    const wrong = await api()
      .post('/api/auth/login')
      .send({ ...demoUser, password: 'not-the-one' })
      .expect(401);
    const unknown = await api()
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: demoUser.password })
      .expect(401);
    assert.equal(wrong.body.message, 'Invalid email/password');
    assert.deepEqual(unknown.body, wrong.body);
  });

  test('a long passphrase (over the old 12-character cap) works end to end', async () => {
    const user = { ...demoUser, password: 'a quiet harbour at low tide' };
    await signUpAndLogin(user);
  });
});
