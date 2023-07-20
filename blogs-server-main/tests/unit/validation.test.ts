import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { createPostSchema } from '../../src/validationSchemas/postsSchema';
import { userAuthSchema, userRegistrationSchema } from '../../src/validationSchemas/userSchema';

describe('registration schema', () => {
  test('normalises email case and surrounding whitespace', async () => {
    const value = await userRegistrationSchema.validate({
      name: '  Ines Calloway ',
      email: ' Ines.Calloway@Example.COM ',
      password: 'margin-notes-1',
    });
    assert.equal(value.email, 'ines.calloway@example.com');
    assert.equal(value.name, 'Ines Calloway');
  });

  test('accepts passwords up to the 72-byte bcrypt limit and rejects longer ones', async () => {
    const base = { name: 'Ines Calloway', email: 'ines@example.com' };
    await userRegistrationSchema.validate({ ...base, password: 'x'.repeat(72) });
    await assert.rejects(userRegistrationSchema.validate({ ...base, password: 'x'.repeat(73) }));
    await assert.rejects(userRegistrationSchema.validate({ ...base, password: 'short' }));
  });

  test('rejects malformed email and short names', async () => {
    await assert.rejects(
      userRegistrationSchema.validate({ name: 'Al', email: 'al@example.com', password: 'longenough' })
    );
    await assert.rejects(userRegistrationSchema.validate({ name: 'Alba', email: 'alba', password: 'longenough' }));
  });
});

describe('login schema', () => {
  test('requires both fields and lower-cases the email', async () => {
    const value = await userAuthSchema.validate({ email: 'ALBA@example.com', password: 'anything' });
    assert.equal(value.email, 'alba@example.com');
    await assert.rejects(userAuthSchema.validate({ email: 'alba@example.com' }));
  });
});

describe('post schema', () => {
  test('trims text and enforces title and content bounds', async () => {
    const value = await createPostSchema.validate({ title: '  Tide tables  ', content: ' Low water at six. ' });
    assert.deepEqual(value, { title: 'Tide tables', content: 'Low water at six.' });
    await assert.rejects(createPostSchema.validate({ title: '  ab ', content: 'body' }));
    await assert.rejects(createPostSchema.validate({ title: 'Valid title', content: '   ' }));
    await assert.rejects(createPostSchema.validate({ title: 't'.repeat(201), content: 'body' }));
  });
});
