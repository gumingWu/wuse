import type { PackageManifest } from '../packages/metadata/types'

export const packages: PackageManifest[] = [
  {
    name: 'metadata',
    display: 'Metadata for WUse functions',
    manualImport: true,
    iife: false,
    utils: true,
    target: 'node14'
  },
  {
    name: 'shared',
    display: 'Shared utilities'
  },
  {
    name: 'core',
    display: 'WUse',
    description: 'Collection of essential Vue Composition Utilities'
  },
  {
    name: 'components',
    display: 'ads'
  },
]
