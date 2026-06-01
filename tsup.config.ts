import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { bichito: 'src/index.ts' },
  format: ['esm', 'cjs', 'iife'],
  globalName: 'Bichito',
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: 'es2022',
})
