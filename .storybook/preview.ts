import type { Preview } from '@storybook/html';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a2e' },
        { name: 'web', value: '#f0f0f0' },
      ],
    },
  },
};

export default preview;
