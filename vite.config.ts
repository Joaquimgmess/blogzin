import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Initialize plugins array
const plugins = [
  tailwindcss(),
  tsconfigPaths()
];

import { reactRouter } from "@react-router/dev/vite";

// Conditionally add the reactRouter plugin
if (process.env.STORYBOOK_RUNNING !== 'true') {
  plugins.push(reactRouter());
}

export default defineConfig({
  plugins: plugins,
});
