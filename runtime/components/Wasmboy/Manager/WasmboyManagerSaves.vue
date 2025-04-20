<script setup lang="ts">
import {UseTimeAgo} from "@vueuse/components";
import {useWasmboy} from "../../../composables/useWasmboy";
import {useWasmboyLibrary} from "../../../composables/useWasmboyLibrary";

const wasmboy = useWasmboy()
const wasmboyLibrary = useWasmboyLibrary()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
        v-if="wasmboyLibrary.currentGameSaves.value.length > 0"
        v-for="save of wasmboyLibrary.currentGameSaves.value"
        class="flex"
    >
      <div class="flex-1">

        <div>
          <b v-text="`GameSave`"/>
        </div>

        <UseTimeAgo v-slot="{ timeAgo }" :time="save.date">
          {{ timeAgo }}
        </UseTimeAgo>

      </div>

      <div class="flex items-center">
        <ButtonGroup>

          <Button @click="wasmboy.restoreGameState(save)">
            <Icon name="mdi:upload"/>
          </Button>

          <Button @click="wasmboyLibrary.removeSaveGame(save.date)">
            <Icon name="mdi:remove"/>
          </Button>

        </ButtonGroup>
      </div>

      <!--
      <WasmboyCartridgeSaves
          :game="game"
      />
      -->

    </div>
    <template v-else>
      There are no save-games available
    </template>
  </div>
</template>

<style scoped lang="scss">

</style>