# Fieldnotes web package

React + MUI client for the [Fieldnotes monorepo](../README.md), built with Vite. Install with the checked-in Yarn 1 lock (`yarn install --frozen-lockfile --ignore-scripts`). `REACT_APP_API_URL` (see `.env.example`) points at the API's `/api` base and is baked in at build time; it is a public value.

| Script | Purpose |
| --- | --- |
| `yarn start` | dev server on http://localhost:3000 |
| `yarn build` / `yarn preview` | type-check, bundle to `build/`, serve it |
| `yarn test` | Vitest + Testing Library |
| `yarn lint` | ESLint, zero warnings allowed |
