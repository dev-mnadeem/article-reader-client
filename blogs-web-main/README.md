# Fieldnotes browser package

See the [monorepo guide](../README.md) and [synthetic feed preview](../docs/blog-desktop.png). Install with the checked-in Yarn 1 lock. This CRA application needs `REACT_APP_API_URL` pointing at the companion Express `/api` base; it is a public configuration value. `yarn test --watchAll=false --runInBand` runs the eleven component tests, and `yarn build` produces the browser bundle. Cookies are JavaScript-readable and sign out is local; the server, not the UI route guard, authorizes requests.
