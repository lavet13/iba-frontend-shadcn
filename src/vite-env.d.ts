/// <reference types="vite/client" />
import { Config } from 'tailwindcss/types/config';

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'tailwind-config' {
  const config: Config;
  export default config;
}
