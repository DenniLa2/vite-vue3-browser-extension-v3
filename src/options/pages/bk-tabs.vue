<template>
  <div>
    <!--  class="text-3xl font-bold underline pb-6" -->
    <h1>
      BK-TABS!
    </h1>

    <!--  class="flex" -->
    <div>
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

import type { IMessage } from '@/types'
import { EMessageEvent } from '@/types/enums'
import { onMounted } from 'vue'
import ITab = chrome.tabs.Tab
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
/** Created by Denis Abramyan (dennila2@gmail.com) on 13.12.2024 */


<style scoped lang="scss">

</style>
