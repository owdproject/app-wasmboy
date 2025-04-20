<script setup lang="ts">
import {useWasmboy} from "../../../../runtime/composables/useWasmboy";

defineProps<{
  meta: IApplicationMeta
}>()

const wasmboy = useWasmboy()
</script>

<template>
  <div class="mb-2">
    <label>
      <Checkbox binary v-model="meta.config.isGbcColorizationEnabled"/>
      GameBoy Color colorization enabled
    </label>
  </div>

  <div>
    <label>
      <Checkbox binary v-model="meta.config.gameTitleAsWindowName"/>
      Set game title as window name
    </label>
  </div>

  <div class="mt-3 mb-2">
    <b>Screen</b>
  </div>

  <ButtonGroup>
    <Button
        :class="{'p-button--active': meta.config.screenSize === 1}" label="1x"
        @click="meta.config.screenSize = 1"
    />
    <Button
        :class="{'p-button--active': meta.config.screenSize === 1.5}" label="1.5x"
        @click="meta.config.screenSize = 1.5"
    />
    <Button
        :class="{'p-button--active': meta.config.screenSize === 2}" label="2x"
        @click="meta.config.screenSize = 2"
    />
  </ButtonGroup>

  <div class="mt-3 mb-2">
    <b>Speed</b>
  </div>

  <ButtonGroup>
    <Button
        :class="{'p-button--active': meta.config.speed === 0.5}" label="0.5x"
        @click="wasmboy.setSpeed(0.5)"
    />
    <Button
        :class="{'p-button--active': meta.config.speed === 0.7}" label="0.7x"
        @click="wasmboy.setSpeed(0.7)"
    />
    <Button
        :class="{'p-button--active': meta.config.speed === 0.8}" label="0.8x"
        @click="wasmboy.setSpeed(0.8)"
    />
    <Button
        :class="{'p-button--active': meta.config.speed === 1}" label="1.0x"
        @click="wasmboy.setSpeed(1)"
    />
  </ButtonGroup>
</template>

<style scoped lang="scss">

</style>