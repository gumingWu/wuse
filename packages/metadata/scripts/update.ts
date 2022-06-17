// @ts-ignore
import { resolve, relative, join } from 'path'
import fg from 'fast-glob'
// @ts-ignore
import fs from 'fs-extra'
import matter from "gray-matter";
import { packages } from "../../../meta/packages";
import type {PackageIndexes, WUseFunction, WUsePackage} from "../types";
import {getCategories} from "../utils";

// @ts-ignore
export const DIR_ROOT = resolve(__dirname, '../../..')
export const DIR_PACKAGE = resolve(__dirname, '..')
export const DIR_SRC = resolve(DIR_ROOT, 'packages')
export const DOCS_URL = 'https://vueuse.org'

export async function listFunctions(dir: string, ignore: string[]=[]) {
  const files = await fg('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignore
    ]
  })
  files.sort()
  return files
}

export async function readMetadata() {
  const indexes: PackageIndexes = {
    packages: {},
    categories: [],
    functions: []
  }
  for(const info of packages) {
    if(info.utils) continue

    const dir = join(DIR_SRC, info.name, 'src')

    const functions = await listFunctions(dir)

    const pkg: WUsePackage = {
      ...info,
      dir: relative(DIR_ROOT, dir).replaceAll('\\', '/')
    }
    indexes.packages[info.name] = pkg

    await Promise.all(functions.map(async (fnName) => {
      const mdPath = join(dir, fnName, 'index.md')
      // const tsPath = join(dir, fnName, 'index.ts')

      const fn: WUseFunction = {
        name: fnName,
        package: pkg.name
      }
      if(fs.existsSync(join(dir, fnName, 'component.ts'))) {
        fn.component = true
      }
      if(fs.existsSync(join(dir, fnName, 'directive.ts'))) {
        fn.directive = true
      }
      if(!fs.existsSync(mdPath)) {
        fn.internal = true
        indexes.functions.push(fn)
        return
      }

      fn.docs = `${DOCS_URL}/${pkg.name}/${fnName}`
      const mdRaw = await fs.readFile(mdPath, 'utf-8')
      const { content: md, data: frontmatter } = matter(mdRaw)
      const category = frontmatter.category

      let alias = frontmatter.alias
      if(typeof alias === 'string') {
        alias = alias.split(',').map(s => s.trim()).filter(Boolean)
      }
      let related = frontmatter.related
      if(typeof related === 'string') {
        related = related.split(',').map(s => s.trim()).filter(Boolean)
      }

      let description = (md
          .replace(/\r\n/g, '\n')
          .match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || []
      )[1] || ''  // 这里是匹配一级标题(# xxx)之后，到第一个回车之前的内容，作为hook介绍，所以最好一句话概括
      description = description.trim()
      description = description.charAt(0).toLowerCase() + description.slice(1)

      fn.category = ['core', 'shared'].includes(pkg.name) ? category : `@${pkg.display}`
      fn.description = description

      if(description.includes('DEPRECATED')) {
        fn.deprecated = true
      }

      if(alias?.length) {
        fn.alias = alias
      }
      if(related?.length) {
        fn.related = related
      }

      indexes.functions.push(fn)
    }))
  }
  indexes.functions.sort((a, b) => a.name.localeCompare(b.name))
  indexes.categories = getCategories(indexes.functions)

  return indexes
}

async function run() {
  const indexes = await readMetadata()
  await fs.writeJSONSync(join(DIR_PACKAGE, 'index.json'), indexes, { spaces: 2 })
}

run()
