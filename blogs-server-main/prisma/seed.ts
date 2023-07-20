import prisma from '../src/db';
import { encryptData } from '../src/helpers/encryptionHelpers';
import { demoAuthors, demoNotes } from './demoData';

// Demo-only credential shared by every seeded account; override with SEED_PASSWORD.
const password = process.env.SEED_PASSWORD || 'fieldnotes-demo';

async function main() {
  if ((await prisma.user.count()) > 0) {
    console.log('Database already has users; seed skipped.');
    return;
  }

  const hash = await encryptData(password);
  const authors = [];
  for (const author of demoAuthors) {
    authors.push(await prisma.user.create({ data: { ...author, password: hash } }));
  }

  const now = Date.now();
  for (const note of demoNotes) {
    await prisma.post.create({
      data: {
        title: note.title,
        content: note.content,
        authorId: authors[note.author].id,
        createdAt: new Date(now - note.hoursAgo * 3_600_000),
      },
    });
  }
  console.log(`Seeded ${authors.length} demo authors and ${demoNotes.length} notes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
