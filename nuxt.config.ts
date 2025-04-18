export default defineNuxtConfig({
    imports: {
        dirs: ['composables', 'components', 'stores', 'utils'],
        presets: [
            {
                from: "@owdproject/core",
                imports: ["useDesktopVolumeStore"]
            }
        ]
    },

    future: {
        compatibilityVersion: 4,
    },
})