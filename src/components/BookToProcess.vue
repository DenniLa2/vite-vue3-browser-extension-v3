<template>
  <div
    class="tb p-2"
    style="border-radius: 4px;"
  >
    <h2><span style="color: gray;">bookName:</span> {{ bookToProcess.bookName }}</h2>
    <h3><span style="color: gray;">authors:</span> {{ authors }}</h3>
    <p><span style="color: gray;">series:</span> {{ bookToProcess.series }}</p>
    <p><span style="color: gray;">numberInSeries:</span> {{ bookToProcess.numberInSeries }}</p>

    <button
      class="btn btn-neutral mt-2 btn-xs"
      @click="emit('process', bookToProcess)">Process book</button>
  </div>
</template>


<script setup lang="ts">
/** Created by Denis Abramyan (dennila2@gmail.com) on 15.12.2024 */

import type { IBookInfo } from '@/types'


interface Props {
  bookToProcess: IBookInfo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  process: [bookToProcess: IBookInfo]
}>()

const authors = computed(() => props.bookToProcess.authors.map((author) => author.trueName ?? author.name).join(', '))

</script>


<style scoped lang="scss">

</style>
