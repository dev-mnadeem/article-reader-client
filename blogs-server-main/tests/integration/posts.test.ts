import './setup';
import { strict as assert } from 'node:assert';
import { after, beforeEach, describe, test } from 'node:test';
import { FEED_LIMIT } from '../../src/controllers/posts';
import { api, prisma, resetDatabase, signUpAndLogin } from './helpers';

describe('posts feed against PostgreSQL', () => {
  let token: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await signUpAndLogin();
  });
  after(() => prisma.$disconnect());

  const create = (title: string, content = 'Field observation.') =>
    api().post('/api/posts').set('authtoken', token).send({ title, content });

  test('creating a post returns it with the author name only', async () => {
    const res = await create('  Heron at the weir  ').expect(200);
    assert.equal(res.body.payload.title, 'Heron at the weir');
    assert.deepEqual(res.body.payload.author, { name: 'Ines Calloway' });
    assert.equal(res.body.payload.authorId, undefined);
  });

  test('the feed is newest first and never exposes emails or hashes', async () => {
    await create('First light');
    await create('Second tide');
    const res = await api().get('/api/posts').set('authtoken', token).expect(200);
    assert.deepEqual(
      res.body.payload.map((p: { title: string }) => p.title),
      ['Second tide', 'First light']
    );
    const serialized = JSON.stringify(res.body);
    assert.doesNotMatch(serialized, /example\.com|\$2[aby]\$/);
  });

  test('title search is case-insensitive and ignores repeated params', async () => {
    await create('Heron at the weir');
    await create('Lichen survey');
    const found = await api().get('/api/posts?title=HERON').set('authtoken', token).expect(200);
    assert.deepEqual(
      found.body.payload.map((p: { title: string }) => p.title),
      ['Heron at the weir']
    );
    const repeated = await api().get('/api/posts?title=a&title=b').set('authtoken', token).expect(200);
    assert.equal(repeated.body.payload.length, 2);
  });

  test(`the feed is capped at ${FEED_LIMIT} posts`, async () => {
    const author = await prisma.user.findFirstOrThrow();
    await prisma.post.createMany({
      data: Array.from({ length: FEED_LIMIT + 5 }, (_, i) => ({
        title: `Note ${i}`,
        content: 'x',
        authorId: author.id,
      })),
    });
    const res = await api().get('/api/posts').set('authtoken', token).expect(200);
    assert.equal(res.body.payload.length, FEED_LIMIT);
  });

  test('invalid posts get a 400 with the reason', async () => {
    const res = await create('ab').expect(400);
    assert.match(res.body.message, /title/);
  });

  test('a token whose account no longer exists cannot post', async () => {
    await prisma.user.deleteMany();
    await create('Orphaned note').expect(401);
  });
});
