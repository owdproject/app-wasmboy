import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin({
  name: 'app-wasmboy-playground-launch',
  dependsOn: ['desktop-app-wasmboy-register'],
  setup(nuxtApp) {
    autoStartPlaygroundApps(nuxtApp, [
      { id: 'org.owdproject.wasmboy', entry: 'wasmboy', windowModel: 'main' },
    ])
  },
})
