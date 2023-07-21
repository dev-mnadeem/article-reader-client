#!/usr/bin/env node
/**
 * A stand-in for blogs-server, for working on the UI without a database.
 *
 * It speaks the same contract: the `{ payload }` envelope, `meta` on the list
 * endpoint, the `authtoken` header, and the same validation messages. State
 * lives in memory and resets when the process stops.
 *
 *   node scripts/mockApi.mjs            # listens on 8591
 *   PORT=4000 node scripts/mockApi.mjs
 *
 * Point the app at it with REACT_APP_API_URL=http://localhost:8591/api.
 */
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT ?? 8591);
const ORIGIN = process.env.CORS_ORIGIN ?? '*';
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const SEED_POSTS = [
  ['Learn Nodejs', 'In this blog, we are going to teach you how to learn Nodejs: the event loop, the module system, and how to keep an HTTP server responsive when the work gets heavy.'],
  ['Getting Started with Express', 'Learn how to set up and use Express.js, the popular Node.js web framework. We cover routing, middleware ordering, and why an error handler has to take four arguments.'],
  ['JavaScript Design Patterns', 'Explore the patterns that survive contact with real codebases: the module pattern, dependency injection by constructor, strategies behind a small interface, and when a plain function beats all three.'],
  ['CSS Flexbox Tutorial', 'This tutorial walks through CSS Flexbox from the main axis outwards, and finishes with the three layouts that account for most of the responsive work you will ever do.'],
  ['Mastering React', 'Everything you need to become comfortable with React: what actually triggers a render, why keys matter more than people think, and how to keep data fetching out of your components.'],
  ['Database Design Best Practices', 'Normalise until it hurts, denormalise until it works. Indexes for the queries you actually run, foreign keys that are indexed on purpose, and migrations you can roll back.'],
  ['Introduction to JavaScript', 'The fundamentals, without the folklore: values and references, scope and closures, the prototype chain, and the handful of coercion rules worth memorising.'],
  ['Python Crash Course', 'A short tour of Python for people who already program: comprehensions, the data model, virtual environments, and the standard library modules that pay for themselves immediately.'],
  ['Testing React Components', 'Test what the user can see. Query by role and label, mock the network at the edge rather than the module under test, and let the rest of the component tree render for real.'],
  ['Deploying Node Applications', 'From a Dockerfile that does not ship your node_modules cache to a health check your orchestrator can actually believe. Includes the signals a container has to handle.'],
];

const AUTHOR_ID = randomUUID();
const startedAt = Date.UTC(2023, 6, 20, 12, 0, 0);

/** Newest first, the order the real API returns. */
const posts = SEED_POSTS.map(([title, content], index) => ({
  id: randomUUID(),
  title,
  content,
  authorId: AUTHOR_ID,
  createdAt: new Date(startedAt + index * 600_000).toISOString(),
  updatedAt: new Date(startedAt + index * 600_000).toISOString(),
})).reverse();

const users = new Map([['johndoe@example.com', { id: AUTHOR_ID, name: 'John Doe', password: 'abcd1234' }]]);
const tokens = new Set();

const send = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, authtoken, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
};

const fail = (res, status, message) => send(res, status, { payload: {}, message });

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('error', reject);
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Malformed JSON body'));
      }
    });
  });

const tokenOf = (req) => {
  const authorization = req.headers.authorization;
  if (typeof authorization === 'string' && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.slice(7).trim();
  }
  return typeof req.headers.authtoken === 'string' ? req.headers.authtoken.trim() : '';
};

const clamp = (value, fallback, max) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const handlers = {
  'POST /api/auth/signup': async (req, res) => {
    const body = await readBody(req);
    if (!body.name || String(body.name).trim().length < 3) return fail(res, 400, 'name must be at least 3 characters');
    if (!body.email || !String(body.email).includes('@')) return fail(res, 400, 'email must be a valid email');
    if (!body.password || String(body.password).length < 8) {
      return fail(res, 400, 'password must be at least 8 characters');
    }
    if (users.has(body.email)) return fail(res, 409, 'Email already registered');

    const id = randomUUID();
    users.set(body.email, { id, name: body.name, password: body.password });
    return send(res, 201, { payload: { id, name: body.name, email: body.email } });
  },

  'POST /api/auth/login': async (req, res) => {
    const body = await readBody(req);
    const user = users.get(body.email);
    if (!user || user.password !== body.password) return fail(res, 401, 'Invalid email or password');

    const token = `mock.${Buffer.from(JSON.stringify({ sub: user.id })).toString('base64url')}.signature`;
    tokens.add(token);
    return send(res, 200, { payload: { authtoken: token, expiresIn: 3600 } });
  },

  'GET /api/posts': (req, res, url) => {
    if (!tokens.has(tokenOf(req))) return fail(res, 401, 'Authentication required');

    const title = (url.searchParams.get('title') ?? '').trim().toLowerCase();
    const limit = clamp(url.searchParams.get('limit'), DEFAULT_LIMIT, MAX_LIMIT);
    const page = clamp(url.searchParams.get('page'), 1, Number.MAX_SAFE_INTEGER);
    const matches = title ? posts.filter((post) => post.title.toLowerCase().includes(title)) : posts;
    const offset = (page - 1) * limit;

    return send(res, 200, {
      payload: matches.slice(offset, offset + limit),
      meta: {
        total: matches.length,
        page,
        limit,
        totalPages: matches.length === 0 ? 0 : Math.ceil(matches.length / limit),
      },
    });
  },

  'POST /api/posts': async (req, res) => {
    if (!tokens.has(tokenOf(req))) return fail(res, 401, 'Authentication required');

    const body = await readBody(req);
    if (!body.title || String(body.title).trim().length < 3) return fail(res, 400, 'title must be at least 3 characters');
    if (!body.content || !String(body.content).trim()) return fail(res, 400, 'content is a required field');

    const post = {
      id: randomUUID(),
      title: String(body.title).trim(),
      content: String(body.content).trim(),
      authorId: AUTHOR_ID,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(post);
    return send(res, 201, { payload: post });
  },
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  if (req.method === 'OPTIONS') return send(res, 204, {});

  const handler = handlers[`${req.method} ${url.pathname}`];
  if (!handler) return fail(res, 404, 'Route not found');

  try {
    await handler(req, res, url);
  } catch (error) {
    fail(res, 400, error instanceof Error ? error.message : 'Bad request');
  }
}).listen(PORT, () => {
  console.log(`mock blogs-server listening on http://localhost:${PORT}/api`);
  console.log(`seeded user: johndoe@example.com / abcd1234 (${posts.length} posts)`);
});
