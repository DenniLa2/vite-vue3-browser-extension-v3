<template>
  <div>
    <!-- class="text-3xl font-bold underline pb-6" -->
    <h1>
      ORDER BOOKS!
    </h1>

    <!-- class="flex flex-col gap-2" -->
    <div>
      <BookToProcess
        v-for="(bookToProcess, i) in booksToProcess"
        :key="i"
        :book-to-process="bookToProcess"
        @process="onProcess"
      />
    </div>

    <!--      class="btn btn-default btn-outline mt-2 btn-sm mx-4"-->
    <button
      @click="onProcessBooks"
    >
      Process books
    </button>
  </div>
</template>


<script setup lang="ts">
/** Created by Denis Abramyan (dennila2@gmail.com) on 13.12.2024 */

import type { IBookInfo, IMessage } from '@/types'
import { fetchBooksToProcessList } from '@/api'
import { MESSAGE_EVENT } from '@/constants'
import { onMounted } from 'vue'

// interface Props {
// }
//
// const props = defineProps<Props>()


const booksToProcess = ref([])

const onProcess = (bookToProcess: IBookInfo) => {
  chrome.runtime.sendMessage({
    event: MESSAGE_EVENT.OPTIONS._to_BG.PROCESS_BOOKS,
    payload: { booksToProcess: [bookToProcess] },
  })
}

const onProcessBooks = () => {
  chrome.runtime.sendMessage({
    event: MESSAGE_EVENT.OPTIONS._to_BG.PROCESS_BOOKS,
    payload: { booksToProcess: booksToProcess.value },
  })
}

onMounted(async () => {
  // @ts-ignore
  chrome.runtime.onMessage.addListener((message: IMessage) => {
    if (message.event === MESSAGE_EVENT.BG._to_OPTIONS.ON_BOOKS_PROCESS_PROGRESS) {
      console.log(message.payload)
    }
  })

  const res = await fetchBooksToProcessList()

  booksToProcess.value = res
})
</script>


<style scoped lang="scss">

</style>
