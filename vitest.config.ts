import vitestConfig from 'super-configs/vitest';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(vitestConfig, {
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      thresholds: { lines: 80, functions: 80 },
    },
  },
});
