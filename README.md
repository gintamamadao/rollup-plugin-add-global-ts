English | [简体中文](./README.zh-CN.md)

# rollup-plugin-add-global-ts

[![NPM version](https://badgen.net/npm/v/rollup-plugin-add-global-ts)](https://www.npmjs.com/package/rollup-plugin-add-global-ts)
[![NPM Weekly Downloads](https://badgen.net/npm/dw/rollup-plugin-add-global-ts)](https://www.npmjs.com/package/rollup-plugin-add-global-ts)
[![License](https://badgen.net/npm/license/rollup-plugin-add-global-ts)](https://www.npmjs.com/package/rollup-plugin-add-global-ts)

> typescript will not add the types in the global declarations of the project to the compiled declaration file when it is compiled, so that projects with global declarations lose some of their declarations when they are compiled, which may result in errors when other projects refer to them.

> This plugin adds the contents of the globally declared d.ts file to the compiled d.ts file at the end of the rollup compilation

## Example

```js
import addGlobalTs from 'rollup-plugin-add-global-ts'

export default [
  {
    // pass in an array of corresponding d.ts file paths to the function addGlobalTs
    plugins: [addGlobalTs(['src/typings.d.ts'])],
  },
]
```
