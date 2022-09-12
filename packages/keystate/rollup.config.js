import node from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import tsc from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'named'
    }
  ],
  plugins: [
    node({
      extensions: ['.js', '.ts']
    }),
    tsc({
      noEmitOnError: false
    }),
    babel()
  ]
};