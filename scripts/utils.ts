import {PackageIndexes} from "../packages/metadata";
import fs from 'fs-extra'
import { join } from 'path'

/**
 * 更新packages中各个目录的index.ts文件，保证每个子包的内容都有被export
 * @param packages
 * @param functions
 */
export async function updateImport(packages: PackageIndexes['packages'], functions: PackageIndexes['functions']) {
  for(const { name, dir, manualImport } of Object.values(packages)) {
    if(manualImport) continue
    let imports: string[] = []

    // 这里稍作修改，不处理components
    if(name !== 'components') {
      imports = functions
        .filter(i => i.package === name)
        .map(f => f.name)
        .sort()
        .map(name => `export * from './src/${name}'`)
    }
    if(name === 'core') {
      imports.push(
        'export * from \'./types\'',
        'export * from \'@wuse/shared\'',
      )
    }

    await fs.writeFile(join(dir.slice(0, -4), 'index.ts'), `${imports.join('\n')}\n`)
  }
}
