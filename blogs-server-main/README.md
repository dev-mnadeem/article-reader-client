# Blog API package

See the [monorepo guide](../README.md) for setup, architecture, source context, and verification limits. This package uses npm and Prisma/PostgreSQL; `npm run typecheck` and `npm run test:unit` are offline checks after client generation. `npm test` writes to a real database and was not run in the review. Read `.env.example`, configure a private signing key, and deliberately migrate a local database before starting. The feed is shared by all authenticated users.
