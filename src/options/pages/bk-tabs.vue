<template>
  <div>
    <h1 class="text-3xl font-bold underline pb-6">
      BK-TABS!
    </h1>

    <div class="flex">
      <Tab
        v-for="tab in tabs"
        :key="tab.id"
        :tab="tab"
      />
    </div>

<!--    <button
      style="border: 1px solid #273558; border-radius: 4px; padding: 10px; margin: 10px; cursor: pointer; color: #273558;"
      @click="collectTabs"
    >
      Collect tabs
    </button>-->
  </div>
</template>


<script setup lang="ts">
/** Created by Denis Abramyan (dennila2@gmail.com) on 13.12.2024 */

import { onMounted } from 'vue'
import { EMessageEvent } from '@/types/enums'

import ITab = chrome.tabs.Tab
import type { IMessage } from '@/types'
// interface Props {
// }
//
// const props = defineProps<Props>()

const tabs: Ref<ITab[]> = ref([])

/*const collectTabs = () => {
  chrome.runtime.sendMessage({event: EMessageEvent.COLLECT_BK_TABS})
}*/

onMounted(() => {
  // @ts-ignore
  chrome.runtime.onMessage.addListener((message: IMessage) => {
    if (message.event === EMessageEvent.ON_BK_TABS_COLLECTED) {
      tabs.value = message.payload
    }
  })
})
</script>


<style scoped lang="scss">

</style>
