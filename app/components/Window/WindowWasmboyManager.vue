<script setup lang="ts">
defineProps<{
  window: IWindowController
}>()
</script>

<template>
  <Window :window="window" :content="{padded: true}" class="owd-wasmboy-manager">

    <Tabs :value="0">
      <TabList>
        <Tab :value="0">Games</Tab>
        <Tab :value="1">Saves</Tab>
        <Tab :value="2">Settings</Tab>
      </TabList>
      <TabPanels>

        <TabPanel :value="0">
          <WasmboyManagerGames />
        </TabPanel>

        <TabPanel :value="1">
          <WasmboyManagerSaves />
        </TabPanel>

        <TabPanel :value="2">
          <WasmboyManagerSettings :meta="window.application.meta" />
        </TabPanel>
      </TabPanels>
    </Tabs>

  </Window>
</template>

<style scoped lang="scss">
swiper-container, swiper-slide {
  height: 100%;
}
</style>
