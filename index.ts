import {defineNuxtModule, createResolver, addComponentsDir, addPlugin, addImportsDir} from '@nuxt/kit'
import {registerTailwindPath} from "@owdproject/core/runtime/utils/utilApp";

export default defineNuxtModule({
    meta: {
        name: 'owd-app-wasmboy',
    },
    async setup(options, nuxt) {
        const {resolve} = createResolver(import.meta.url);

        {

            // add components

            addComponentsDir({
                path: resolve("./runtime/components"),
            })

        }

        {

            // add plugins

            addPlugin(resolve('./runtime/plugin'))

            // add other files

            addImportsDir(resolve('./runtime/composables'))
            addImportsDir(resolve('./runtime/stores'))
            addImportsDir(resolve('./runtime/utils'))

        }

        {

            // configure tailwind

            registerTailwindPath(nuxt, resolve('./runtime/components/**/*.{vue,mjs,ts}'))

        }

    }
})