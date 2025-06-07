import type { Preview } from '@storybook/react';
// Ensure the path to global CSS is correct.
// If app/app.css is the main global stylesheet.
import '../app/app.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
