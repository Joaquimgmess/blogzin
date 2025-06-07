import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Initialize plugins array
const plugins = [
  tailwindcss(),
  tsconfigPaths()
];

// Conditionally add the reactRouter plugin
// Note: Using a dynamic import for reactRouter so it's only imported when not in Storybook.
// This might help avoid issues if the mere presence of the import causes problems.
if (process.env.STORYBOOK_RUNNING !== 'true') {
  // Dynamically import and then push the plugin.
  // This requires an async context if at top level, or use a top-level await if module system supports it.
  // For a standard vite.config.js, we can't use top-level await directly in the script body
  // unless vite.config.ts is treated as an ES module that supports it.
  // A common pattern is to define an async function and call it, or use a promise.
  // However, Vite plugins must be synchronous.
  // Let's try requiring it directly within the condition.
  const { reactRouter } = require("@react-router/dev/vite");
  plugins.push(reactRouter());
}

export default defineConfig({
  plugins: plugins,
});
