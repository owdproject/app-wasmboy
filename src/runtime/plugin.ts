import { defineNuxtPlugin } from 'nuxt/app'
import { defineDesktopApp } from '@owdproject/core/kit/defineDesktopApp'
import configAppWasmboy from './app.config'
import './stores/storeWasmboy'

export default defineNuxtPlugin({
  name: 'desktop-app-wasmboy-register',
  async setup() {
    if (import.meta.server) return
    await defineDesktopApp(configAppWasmboy)
  },
})
