import type { ManifestV3Export } from '@crxjs/vite-plugin'
import { env } from 'node:process'
import packageJson from './package.json'


const { version, name, description, displayName } = packageJson
// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default {
  name: env.mode === 'staging' ? `[INTERNAL] ${name}` : displayName || name,
  description,
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  manifest_version: 3,
  // key: '',
  action: {
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      all_frames: true,
      js: [
        'src/content-script/index.ts',
        // 'src/content-scripts/file.js'
      ],
      matches: ['*://*/*'],
      run_at: 'document_end',
    },
  ],
  // Full options page
  options_page: 'src/options/index.html',
  // Embedded options page
  // options_ui: {
  //   page: 'src/options/index.html',
  // },
  offline_enabled: true,
  'host_permissions': ['*://baza-knig.ink/*'],
  permissions: [
    'storage',
    'tabs',
    'background',
    'notifications',
    'downloads',
    'scripting',
    'alarms',
  ],
  externally_connectable: {
    matches: ['*://*/*'],
  },
  web_accessible_resources: [
    {
      matches: ['*://*/*'],
      resources: ['src/content-script/index.ts'],
    },
    {
      matches: ['*://*/*'],
      resources: ['src/content-script/iframe/index.html'],
    },
  ],
  icons: {
    16: 'src/assets/icons/icon-16.png',
    32: 'src/assets/icons/icon-32.png',
    48: 'src/assets/icons/icon-48.png',
    128: 'src/assets/icons/icon-128.png',
  },
} as ManifestV3Export
