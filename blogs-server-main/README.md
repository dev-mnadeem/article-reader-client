# Fieldnotes API package

Express + Prisma API for the [Fieldnotes monorepo](../README.md). Install with npm (`npm ci --ignore-scripts`), copy `.env.example` to `.env`, then `npx prisma generate` and `npx prisma migrate deploy`.

| Script | Purpose |
| --- | --- |
| `npm run dev` | ts-node with reload on 127.0.0.1:8080 |
| `npm run build` / `npm start` | compile to `dist/` and run it |
| `npm run seed` | fictional demo authors and notes |
| `npm run test:unit` | offline tests |
| `npm run test:integration` | PostgreSQL tests; wipes the database in `TEST_DATABASE_URL` |
| `npm run lint`, `npm run typecheck`, `npm run format:check` | static checks |
