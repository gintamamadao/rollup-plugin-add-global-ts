import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

const extensions = ['.js', '.ts']

const babelOpt = {
  extensions,
  exclude: 'node_modules/**',
  include: ['src/**/*'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10.0',
        },
      },
    ],
  ],
}

export default [
  {
    input: 'src/index.ts',
    external: [].concat(
      Object.keys(pkg.dependencies || {}),
      Object.keys(pkg.peerDependencies || {})
    ),
    output: [{ file: pkg.main, format: 'cjs' }],
    plugins: [typescript(), resolve(), commonjs(), babel(babelOpt)],
  },
]
