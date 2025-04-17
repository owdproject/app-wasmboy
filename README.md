# About WasmBoy

> WasmBoy app for your Open Web Desktop client

## Overview

The OWD WasmBoy App is a GameBoy emulator based on torch2424/wasmboy for Open Web Desktop.

## Quick Installation

1.  Navigate to your OWD client folder in your terminal:

    ```bash
    cd owd-client
    ```

2.  Install the module using npm or yarn:

    ```bash
    npm install github:owdproject/app-wasmboy wasmboy
    ```

3.  Register the application in your OWD configuration file:

    ```typescript
    // owd.config.ts
    import AppWasmboy from 'owd-app-wasmboy/owd.config'
    
    export const owdConfig = {
        theme: ['github:owdproject/theme-win95', { install: true }],
    
        apps: [
           './node_modules/owd-app-wasmboy',
        ],
    
        loader: async () => {
            await defineDesktopApp(AppWasmboy)
        }
    }
    ```

## Compatibility

This application is compatible with Open Web Desktop client version `3.0.0-alpha.0`.

## License

This project is released under the [GNU GPLv3](LICENSE).