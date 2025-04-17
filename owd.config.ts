export default {
    id: "org.owdproject.wasmboy",
    title: "WasmBoy",
    category: 'games',
    icon: "streamline:gameboy",
    singleton: true,
    windows: {
        main: {
            component: () => import('./app/components/Window/WindowWasmboy.vue'),
            resizable: false,
            size: {
                width: 'initial',
                height: 'initial',
            },
            position: {
                x: 400,
                y: 240,
                z: 0
            },
        },
        manager: {
            component: () => import('./app/components/Window/WindowWasmboyManager.vue'),
            title: "WasmBoy Manager",
            resizable: false,
            size: {
                width: 400,
                height: 400,
            },
            position: {
                x: 400,
                y: 240,
                z: 0
            },
        },
    },
    meta: {
        config: {
            gameTitleAsWindowName: false,
            isPausedByPlayer: false,
            isGbcColorizationEnabled: true,
            speed: 1,
            screenSize: 1,
        }
    },
    entries: {
        wasmboy: {
            command: "wasmboy"
        },
        manager: {
            title: "WasmBoy Manager",
            command: "wasmboy manager"
        }
    },
    commands: {
        wasmboy: (app, args) => {
            handleCommand(app, args)
        },
        gameboy: (app, args) => {
            handleCommand(app, args)
        },
    },
}

function handleCommand(app: IApplicationController, args: any[]) {
    if (args.length === 1 && ['manager', 'settings'].includes(args[0])) {
        return app.openWindow("manager")
    }

    app.openWindow("main")
}