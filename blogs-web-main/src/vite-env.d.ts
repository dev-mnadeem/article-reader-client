/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Vite exposes variables under their literal .env names.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly REACT_APP_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
