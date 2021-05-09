import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import pkg from './package.json'

const extensions = ['.js', '.ts']

const babelOpt = {
  extensions,
  babelHelpers: 'runtime',
  exclude: 'node_modules/**',
  include: ['src/**/*'],
  plugins: ['@babel/plugin-transform-runtime'],
}

export default [
  {
    input: 'src/index.ts',
    external: Object.keys(pkg.dependencies || {}),
    output: [{ file: pkg.main, format: 'cjs' }],
    plugins: [json(), typescript(), resolve(), commonjs(), babel(babelOpt)],
  },
]
