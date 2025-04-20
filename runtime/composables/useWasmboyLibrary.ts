import {markRaw} from "vue"
import {ref, computed} from "@vue/reactivity"

const DB_NAME = 'wasmboy'
const STORE_NAME = 'keyval'

/**
 * Opens the IndexedDB database and returns the database instance.
 */
async function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME)

        request.onerror = () => reject(new Error('Error opening IndexedDB'))
        request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result)
    })
}

/**
 * Performs a transaction on IndexedDB
 */
async function withTransaction<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => Promise<T>): Promise<T> {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], mode)
        const store = transaction.objectStore(STORE_NAME)

        action(store)
            .then(resolve)
            .catch(reject)

        transaction.oncomplete = () => {}
        transaction.onerror = () => reject(new Error('Transaction failed'))
    })
}

/**
 * Fetches all saved games from IndexedDB
 */
async function getAllGames(): Promise<{ cartridgeRom: any, saveStates: any[] }[]> {
    return withTransaction('readonly', (store) => {
        return new Promise((resolve, reject) => {
            const request = store.getAll()
            request.onsuccess = () => resolve(markRaw(request.result))
            request.onerror = () => reject(new Error('Error reading IndexedDB'))
        })
    })
}

/**
 * Fetches the latest game from IndexedDB
 */
async function getLatestGame(): Promise<{ cartridgeRom: any } | undefined> {
    const allGames = await getAllGames()
    return allGames.length ? allGames[allGames.length - 1] : undefined
}

/**
 * Deletes a game completely from IndexedDB
 */
async function deleteGame(gameKey: string): Promise<void> {
    return withTransaction('readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
            const request = store.delete(gameKey)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(new Error('Error deleting game'))
        })
    })
}

/**
 * Fetches the save states for a specific game by its key
 */
async function getSaveStatesForGame(gameKey: string): Promise<any[]> {
    return withTransaction('readonly', (store) => {
        return new Promise((resolve, reject) => {
            const getRequest = store.get(gameKey)

            getRequest.onsuccess = () => {
                const gameData = getRequest.result
                if (!gameData) {
                    return reject()
                }

                resolve(gameData.saveStates || [])
            }
            getRequest.onerror = () => reject(new Error('Error reading IndexedDB'))
        })
    })
}

/**
 * Deletes a specific save state from a game
 */
async function deleteSaveState(gameKey: string, saveTimestamp: number): Promise<any> {
    return withTransaction('readwrite', (store) => {
        return new Promise((resolve, reject) => {
            const getRequest = store.get(gameKey)

            getRequest.onsuccess = () => {
                const gameData = getRequest.result
                if (!gameData) return reject(new Error('Game not found'))

                gameData.saveStates = gameData.saveStates.filter((save: any) => save.date !== saveTimestamp)

                const updateRequest = store.put(gameData, gameKey)
                updateRequest.onsuccess = () => resolve(gameData.saveStates)
                updateRequest.onerror = () => reject(new Error('Error updating IndexedDB'))
            }
            getRequest.onerror = () => reject(new Error('Error reading IndexedDB'))
        })
    })
}

function arraysAreEqual(arr1: Uint8Array, arr2: Uint8Array): boolean {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

const list = ref<WasmboyGame[]>([])

const currentGameKey = ref<any>()
const currentGameSaves = ref<any>([])

const currentGame: ComputedRef<WasmboyGame | undefined> = computed(() => {
    return list.value.find(game => {
        return arraysAreEqual(game.cartridgeInfo.header, currentGameKey.value)
    })
})

/**
 * Composable for WasmBoy game management
 */
export function useWasmboyLibrary() {

    // Refresh the list of all games from IndexedDB
    async function refreshGameList() {
        list.value = await getAllGames()
    }

    // Reset the list to an empty array
    function resetGameList() {
        list.value = []
    }

    // Remove a game by key
    async function removeGame(gameKey: string) {
        await deleteGame(gameKey)
        await refreshGameList()
    }

    // Remove a specific save state from a game
    async function refreshCurrentGameSaves() {
        currentGameSaves.value = await getSaveStatesForGame(currentGameKey.value)
    }

    // Remove a specific save state from a game
    async function removeSaveGame(saveTimestamp: number) {
        await deleteSaveState(currentGameKey.value, saveTimestamp)
        await refreshCurrentGameSaves()
    }

    // Set current game rom header
    function setCurrentGameKey(gameKey: string) {
        currentGameKey.value = gameKey
        refreshCurrentGameSaves()
    }

    // Computed property to get the latest game
    const latestGame = computed(() => list.value.length ? list.value[list.value.length - 1] : undefined)

    return {
        list,
        latestGame,
        currentGame,
        currentGameKey,
        currentGameSaves,
        refreshGameList,
        resetGameList,
        removeGame,
        removeSaveGame,
        setCurrentGameKey,
        refreshCurrentGameSaves,
    }
}
