import { Plugin } from 'rollup'
import { glob } from 'glob'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname, relative, join, resolve } from 'path'
import shelljs from 'shelljs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import fsUtil from 'ginlibs-file-util'
export interface IOptions {
  declareFiles?: string[]
}

const readFile = (filePath: string) => {
  if (!existsSync(filePath)) {
    return ''
  }
  return readFileSync(filePath, 'utf-8')
}

const writeFile = (filePath: string, content: string) => {
  if (existsSync(filePath)) {
    shelljs.rm('-rf', filePath)
  } else if (!existsSync(dirname(filePath))) {
    shelljs.mkdir('-p', dirname(filePath))
  }

  writeFileSync(filePath, content)
}

const getAstNodeIdName = (node: any) => {
  return node?.id?.name
}

const DTS_EXT = '.d.ts'
const FILE_NAME = 'rollup-plugin-add-global-ts_@global'

const genImportItems = (exportItems: string[], path: string) => {
  return `import { ${exportItems.join(', ')} } from '${path}'`
}

export default function addDts(options: IOptions | string[] = {}): Plugin {
  return {
    name: 'rollup-plugin-add-global-ts',
    writeBundle(api) {
      const outputFile = api.file
      const outDir = dirname(outputFile)
      const declareFiles = Array.isArray(options)
        ? options
        : options.declareFiles || ['typings.d.ts', 'src/typings.d.ts']

      const addDtsCnt = (exIdNames: string[]) => {
        glob(`${outDir}/**/*.d.ts`, {}, function (err, files) {
          if (err) {
            console.log(err)
            return
          }
          files.forEach((file) => {
            let exFilePath = relative(resolve(file, '..'), `./lib/${FILE_NAME}`)
            if (
              !exFilePath.startsWith('/') &&
              !exFilePath.startsWith('./') &&
              !exFilePath.startsWith('../')
            ) {
              exFilePath = `./${exFilePath}`
            }
            if (file.includes(FILE_NAME)) {
              return
            }
            // cache.write(exFilePath, 'exFilePath')
            const dtsCont = readFile(file)
            const newCont = `${genImportItems(
              exIdNames,
              exFilePath
            )}\r\n${dtsCont}`
            writeFile(file, newCont)
          })
        })
      }
      const exportItems = []
      const itIdNames = []
      for (const itFile of declareFiles) {
        const itCntStr = readFile(itFile)
        if (!itCntStr) {
          return
        }
        const ast = parser.parse(itCntStr, {
          sourceType: 'module',
          plugins: ['typescript'],
        })

        traverse(ast as any, {
          TSTypeAliasDeclaration(path) {
            const node = path.node
            const nodeOutput = generate(node as any)
            itIdNames.push(getAstNodeIdName(node))
            exportItems.push(`export ${nodeOutput.code}`)
          },
          TSInterfaceDeclaration(path) {
            const node = path.node
            const nodeOutput = generate(node as any)
            itIdNames.push(getAstNodeIdName(node))
            exportItems.push(`export ${nodeOutput.code}`)
          },
        })
      }
      addDtsCnt(itIdNames)
      fsUtil.write(
        `${join(outDir, FILE_NAME)}${DTS_EXT}`,
        exportItems.join('\n')
      )
    },
  }
}
