import { Plugin } from 'rollup'
import { glob } from 'glob'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import shelljs from 'shelljs'
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

export default function addDts(options: IOptions | string[] = {}): Plugin {
  return {
    name: 'rollup-plugin-add-global-ts',
    writeBundle(api) {
      const outputFile = api.file
      const outDir = dirname(outputFile)
      const declareFiles = Array.isArray(options)
        ? options
        : options.declareFiles || ['typings.d.ts', 'src/typings.d.ts']
      const addDtsCnt = (outDir: string, dtsFile: string) => {
        const cntStr = readFile(dtsFile)
        if (!cntStr) {
          return
        }
        glob(`${outDir}/**/*.d.ts`, {}, function (err, files) {
          if (err) {
            console.log(err)
            return
          }
          files.forEach((file) => {
            const dtsCont = readFile(file)
            const newCont = `${cntStr}\r\n${dtsCont}`
            writeFile(file, newCont)
          })
        })
      }

      for (const itFile of declareFiles) {
        addDtsCnt(outDir, itFile)
      }
    },
  }
}
