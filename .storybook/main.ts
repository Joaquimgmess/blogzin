import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../app/**/*.mdx', '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    // '@storybook/addon-styling-webpack' was removed as it's for Webpack.
    // Tailwind CSS should be handled by the Vite configuration loaded from vite.config.ts.
    // The subtask mentions manually editing vite.config.ts to conditionally exclude reactRouter.
    // That vite.config.ts should retain TailwindCSS and other necessary plugins for Storybook.
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}, // Storybook will try to load vite.config.ts by default
  },
  docs: {
    autodocs: 'tag',
  },
  // viteFinal is not used here, relying on the modified vite.config.ts
  // and Storybook's default Vite config loading.
};

export default config;
