import './setup';
import { strict as assert } from 'node:assert';
import { after, describe, test } from 'node:test';
import { api, prisma } from './helpers';

describe('health check', () => {
  after(() => prisma.$disconnect());

  test('reports ok when PostgreSQL answers', async () => {
    const res = await api().get('/api/health').expect(200);
    assert.deepEqual(res.body, { payload: { status: 'ok' } });
  });
});
