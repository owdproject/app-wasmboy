<script setup lang="ts">
const props = defineProps<{
  window: IWindowController
}>()

const visibility = useDocumentVisibility()

const wasmboy = useWasmboy()
const wasmboyCanvas: any = useTemplateRef('wasmboyCanvas')

const meta = props.window.applicationController.meta

// window lifecycle

onMounted(async () => {
  if (!wasmboyCanvas.value) {
    return
  }

  await wasmboy.setup(wasmboyCanvas.value, props.window)
  await wasmboy.restorePreviousGame()
})

onUnmounted(() => {
  wasmboy.resetEmulator()
})

watch(visibility, (newVisibility) => {
  if (newVisibility === 'visible') {
    if (!meta.config.isPausedByPlayer && wasmboy.status.isPaused) {
      wasmboy.playEmulator()
    }
  }
})

// handle input file

const {open: onWasmboyRomSelect, onChange} = useFileDialog({
  accept: '.gb,.gbc,.gba,.zip',
  multiple: false,
})

onChange((files) => {
  wasmboy.insertCartridge(files[0])
})

/**
 * Open WasmBoy window manager
 */
function onWasmBoyWindowManagerOpen() {
  props.window.applicationController.openWindow('manager')
}

const gameScreenSizeClass = computed(() => {
  switch (props.window.applicationController.meta.config.screenSize) {
    case 1.5:
      return 'game-screen--15'
    case 2:
      return 'game-screen--2'
    default:
      return 'game-screen'
  }
})
</script>

<template>
  <Window :window="window" class="owd-wasmboy">

    <template #nav-append>

      <ButtonWindowNav
          v-if="wasmboy.status.isLoaded" rounded
          title="WasmBoy Manager"
          @click="onWasmBoyWindowManagerOpen"
      >
        <Icon name="mdi:settings"/>
      </ButtonWindowNav>

      <ButtonWindowNav
          rounded
          title="Load ROM"
          @click="onWasmboyRomSelect"
      >
        <Icon name="mdi:eject"/>
      </ButtonWindowNav>

      <ButtonWindowNav
          v-if="wasmboy.status.isLoaded" rounded
          :title="meta.config.isPausedByPlayer ? 'Play' : 'Pause'"
          @click="wasmboy.togglePlayEmulator()"
      >
        <Icon :name="!meta.config.isPausedByPlayer ? 'mdi:pause' : 'mdi:play'"/>
      </ButtonWindowNav>

    </template>

    <canvas
        ref="wasmboyCanvas"
        :class="gameScreenSizeClass"
    />

  </Window>
</template>

<style scoped lang="scss">
:deep(.p-card) {
  width: fit-content !important;
  height: fit-content !important;
}

.owd-wasmboy {
  &__actions {
    position: absolute;
    bottom: 32px;
    left: 0;
    right: 0;
    text-align: center;
    opacity: 1;

    .p-button {
      margin: 0 4px;

      .iconify {
        color: white;
      }
    }
  }

  &:hover {
    opacity: 1;
  }
}

.game-screen {
  pointer-events: none;
  width: 320px;
  height: 288px;

  &--15 {
    width: 480px;
    height: 432px;
  }

  &--2 {
    width: 640px;
    height: 576px;
  }
}
</style>
