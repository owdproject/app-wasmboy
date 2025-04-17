// @ts-ignore
import {WasmBoy} from "wasmboy"

const wasmboyLibrary = useWasmboyLibrary()

const status = reactive({
    isLoaded: false,
    isPaused: false,
})

let window: IWindowController

export function useWasmboy() {
    async function setup(canvas: HTMLCanvasElement, _window: IWindowController) {
        window = _window

        // override wasmboy config
        wasmboyConfig.isGbcColorizationEnabled = window.application.meta.config.isGbcColorizationEnabled
        wasmboyConfig.onPause = () => {
            status.isPaused = true
        }

        await WasmBoy.config(wasmboyConfig, canvas)
    }

    /**
     * Restore latest rom
     */
    async function restorePreviousGame() {
        // wait until store has been restored
        await window.application.store.$persistedState.isReady()

        const latestGame = await getLatestGameFromWasmboyStorage()

        if (!latestGame || !latestGame.cartridgeRom) {
            return
        }

        await loadGame(latestGame.cartridgeRom)
    }

    /**
     * Restore latest save-game of current rom
     */
    async function restoreGameState(gameState?: WasmboySaveState) {
        try {
            if (gameState) {
                await loadGameState(gameState)
            } else {
                const saves: WasmboySaveState[] = await WasmBoy.getSaveStates()

                if (saves.length > 0) {
                    await loadGameState(saves[saves.length - 1])
                }
            }
        } catch (error) {
            debugError('Error loading game:', error)
        }

        await playEmulator()
    }

    /**
     * Load save-game
     *
     * @param save
     */
    async function loadGameState(save: WasmboySaveState) {
        await WasmBoy.pause()
        await WasmBoy.loadState(save)
    }

    /**
     * Save save-game
     */
    async function saveGameState() {
        try {
            await WasmBoy.saveState()
        } catch (error) {
            debugError('Error saving the game:', error)
        }
    }

    /**
     * Load game
     *
     * @param cartridgeRom
     */
    async function loadGame(cartridgeRom: WasmboyGameCardridge) {
        try {

            await WasmBoy.loadROM(cartridgeRom.ROM, {
                header: cartridgeRom.header,
                fileName: cartridgeRom.fileName
            })

            debugWarn(window.application.meta.config)

            setSpeed(window.application.meta.config.speed)

            await restoreGameState()

            status.isLoaded = true

            if (!window.application.meta.config.isPausedByPlayer) {
                await playEmulator()
            }

            const cartridgeInfo = await WasmBoy._getCartridgeInfo()

            wasmboyLibrary.setCurrentGameKey(cartridgeInfo.header)
            setWindowNameAsGameTitle()

            debugLog('Cartridge ROM loaded into WasmBoy')
        } catch (error) {
            debugError('Error loading the ROM:', error)
        }
    }

    /**
     * Load new game from input[type=file]
     *
     * @param file
     */
    async function insertCartridge(file: File) {
        try {
            await loadGame({ROM: file, header: undefined, fileName: file.name})
            await WasmBoy.saveLoadedCartridge()

            // refresh library
            await useWasmboyLibrary().refreshGameList()
        } catch (error) {
            debugError('Error initializing new ROM:', error)
        }
    }

    /**
     * Play WasmBoy
     */
    async function playEmulator() {
        await WasmBoy.play()
        status.isPaused = false
        window.application.meta.config.isPausedByPlayer = false
    }

    /**
     * Pause WasmBoy
     */
    async function pauseEmulator() {
        await WasmBoy.pause()
        status.isPaused = true
        window.application.meta.config.isPausedByPlayer = true
    }

    /**
     * Reset WasmBoy
     */
    async function resetEmulator() {
        await WasmBoy.reset()
    }

    /**
     * Toggle play
     */
    async function togglePlayEmulator() {
        if (status.isPaused) {
            await playEmulator()
        } else {
            await pauseEmulator()
        }
    }

    /**
     * Set emulator speed
     */
    function setSpeed(speed: number) {
        WasmBoy.setSpeed(speed)
        window.application.meta.config.speed = speed
    }

    function setWindowNameAsGameTitle() {
        function filterValidChars(input: string): string {
            return input.replace(/[^a-zA-Z0-9\s.,!?()\-]/g, '');
        }

        if (!window.application.meta.config.gameTitleAsWindowName) {
            return
        }

        window.actions.setTitleOverride(
            filterValidChars(
                wasmboyLibrary.currentGame.value
                    ? wasmboyLibrary.currentGame.value.cartridgeInfo.titleAsString
                    : undefined
            )
        )
    }

    return {
        status,
        setup,
        restorePreviousGame,
        restoreGameState,
        saveGameState,
        loadGame,
        insertCartridge,
        setSpeed,
        playEmulator,
        pauseEmulator,
        resetEmulator,
        togglePlayEmulator,
    }
}