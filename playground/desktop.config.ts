import { defineDesktopConfig } from '@owdproject/core'

export default defineDesktopConfig({
  theme: '@owdproject/theme-win31',
  modules: ['@owdproject/module-fs', '@owdproject/module-persistence'],
  apps: ['@owdproject/app-wasmboy'],
  systemBar: {
    enabled: true,
    startButton: true,
  },
  fs: {
    mounts: {
      '/mnt/test': '/test-small.zip',
    },
  },
  about: {
    title: 'WasmBoy (playground)',
    subtitle: 'app-wasmboy · theme-win31',
    href: 'https://github.com/owdproject/app-wasmboy',
    versionText: 'Nuxt Desktop',
    icons: [
      {
        title: 'Open Web Desktop',
        name: 'mdi:hexagon-multiple-outline',
        size: 24,
      },
      {
        title: 'Nuxt.js',
        name: 'simple-icons:nuxt',
        size: 25,
        style: 'margin-top: -1px',
      },
    ],
  },
})
