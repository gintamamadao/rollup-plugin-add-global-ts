[![NPM version](https://badgen.net/npm/v/rollup-plugin-add-global-ts)](https://www.npmjs.com/package/rollup-plugin-add-global-ts)
[![NPM Weekly Downloads](https://badgen.net/npm/dw/rollup-plugin-add-global-ts)](https://www.npmjs.com/package/rollup-plugin-add-global-ts)
[![License](https://badgen.net/npm/license/rollup-plugin-add-global-ts)](https://www.npmjs.com/package/rollup-plugin-add-global-ts)

# rollup-plugin-add-global-ts

> typescript 编译的时候不会把项目中的全局声明中的内容加到编译或后的声明，这样有全局声明的项目编译后就丢失了部分声明，导致其他项目引用的时候可能会报错。

> 本插件是在 rollup 编译的最后把全局声明的 d.ts 文件的内容添加到编译后的 d.ts 文件中

## Example

```js
import addGlobalTs from 'rollup-plugin-add-global-ts'

export default [
  {
    // addGlobalTs 传入对应的 d.ts 文件路径的数组
    plugins: [addGlobalTs(['src/typings.d.ts'])],
  },
]
```
