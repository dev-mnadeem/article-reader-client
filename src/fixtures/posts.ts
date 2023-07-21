import { PageMeta } from 'types/pagination';
import { PostType } from 'types/post';

/**
 * Deterministic posts used by the tests and by `scripts/mockApi.mjs`. The
 * titles and bodies match blogs-server's seed data so the mocked UI looks like
 * the real one.
 */
export const mockedPosts: PostType[] = [
  {
    id: '6f603f74-0a32-4176-848b-94d2969014f1',
    title: 'Learn Nodejs',
    content:
      'In this blog, we are going to teach you how to learn Nodejs: the event loop, the module system, and how to keep an HTTP server responsive when the work gets heavy.',
    authorId: '2f2d6b6f-2c4a-4a0f-9d4e-27b5a6f4a111',
    createdAt: '2023-07-20T12:13:49.908Z',
  },
  {
    id: '8bfce472-ad3e-431b-8f9c-8807a1e127e5',
    title: 'Getting Started with Express',
    content:
      'Learn how to set up and use Express.js, the popular Node.js web framework. We cover routing, middleware ordering, and why an error handler has to take four arguments.',
    authorId: '2f2d6b6f-2c4a-4a0f-9d4e-27b5a6f4a111',
    createdAt: '2023-07-20T12:23:49.908Z',
  },
  {
    id: '1f33b3ea-47f3-4bb3-851c-7f6327edf2e3',
    title: 'JavaScript Design Patterns',
    content:
      'Explore the patterns that survive contact with real codebases: the module pattern, dependency injection by constructor, strategies behind a small interface, and when a plain function beats all three.',
    authorId: '9a1c2d3e-4f50-4162-8b73-5c6d7e8f9a01',
    createdAt: '2023-07-20T12:33:49.908Z',
  },
  {
    id: '13cc55ec-7a07-43e4-8ed0-f5e133a43faf',
    title: 'CSS Flexbox Tutorial',
    content:
      'This tutorial walks through CSS Flexbox from the main axis outwards, and finishes with the three layouts that account for most of the responsive work you will ever do.',
    authorId: '9a1c2d3e-4f50-4162-8b73-5c6d7e8f9a01',
    createdAt: '2023-07-20T12:43:49.908Z',
  },
  {
    id: 'a3c21f55-7b31-4c3f-8f1a-2d04d9f0b6e2',
    title: 'Mastering React',
    content:
      'Everything you need to become comfortable with React: what actually triggers a render, why keys matter more than people think, and how to keep data fetching out of your components.',
    authorId: '2f2d6b6f-2c4a-4a0f-9d4e-27b5a6f4a111',
    createdAt: '2023-07-20T12:53:49.908Z',
  },
  {
    id: 'c77a0f18-6d10-4a2c-9b8e-0f3c3a7d5e44',
    title: 'Database Design Best Practices',
    content:
      'Normalise until it hurts, denormalise until it works. Indexes for the queries you actually run, foreign keys that are indexed on purpose, and migrations you can roll back.',
    authorId: '9a1c2d3e-4f50-4162-8b73-5c6d7e8f9a01',
    createdAt: '2023-07-20T13:03:49.908Z',
  },
  {
    id: 'e1b8d2c9-55a4-4f6b-9d02-7c1e8a4b3f90',
    title: 'Introduction to JavaScript',
    content:
      'The fundamentals, without the folklore: values and references, scope and closures, the prototype chain, and the handful of coercion rules worth memorising.',
    authorId: '2f2d6b6f-2c4a-4a0f-9d4e-27b5a6f4a111',
    createdAt: '2023-07-20T13:13:49.908Z',
  },
  {
    id: 'b4f6e7a8-9c01-42d3-8e5f-6a7b8c9d0e12',
    title: 'Python Crash Course',
    content:
      'A short tour of Python for people who already program: comprehensions, the data model, virtual environments, and the standard library modules that pay for themselves immediately.',
    authorId: '9a1c2d3e-4f50-4162-8b73-5c6d7e8f9a01',
    createdAt: '2023-07-20T13:23:49.908Z',
  },
  {
    id: 'd0e9f8a7-b6c5-4d43-a2b1-0c9d8e7f6a55',
    title: 'Testing React Components',
    content:
      'Test what the user can see. Query by role and label, mock the network at the edge rather than the module under test, and let the rest of the component tree render for real.',
    authorId: '2f2d6b6f-2c4a-4a0f-9d4e-27b5a6f4a111',
    createdAt: '2023-07-20T13:33:49.908Z',
  },
  {
    id: 'f5a4b3c2-d1e0-4f9a-8b7c-6d5e4f3a2b10',
    title: 'Deploying Node Applications',
    content:
      'From a Dockerfile that does not ship your node_modules cache to a health check your orchestrator can actually believe. Includes the signals a container has to handle.',
    authorId: '9a1c2d3e-4f50-4162-8b73-5c6d7e8f9a01',
    createdAt: '2023-07-20T13:43:49.908Z',
  },
];

export const mockedMeta = (page: number, limit: number, total = mockedPosts.length): PageMeta => ({
  total,
  page,
  limit,
  totalPages: total === 0 ? 0 : Math.ceil(total / limit),
});
