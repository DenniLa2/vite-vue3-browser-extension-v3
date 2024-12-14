<template>
  <div class="text-center m-4 flex flex-col gap-y-2">
    <h1 class="text-3xl font-bold pb-6">Baza-knig parser</h1>

    <p>Vesion: {{ version }}</p>
    <p>Display name: {{ displayName }}</p>

    <h2>Book</h2>

    <div class="flex gap-x-2 justify-center">
      <button
        class="btn btn-info btn-sm"
        @click="onProcessBook"
      >Process</button>
    </div>

    <div class="flex gap-x-2 justify-center">
      <button
        class="btn btn-info btn-sm"
        @click="onOptions"
      >Options</button>
    </div>

    <!--    <hr />-->
    <!--    <div class="flex gap-x-2 justify-center">
      <button
        class="btn btn-primary"
        @click="store.increment"
      >
        Increment
      </button>
      <button
        class="btn btn-primary"
        @click="store.decrement"
      >
        Decrement
      </button>
    </div>-->

    <!--    <RouterLink
      class="underline"
      to="/common/about"
    >
      About
    </RouterLink>-->
  </div>
</template>

<script setup lang="ts">
// import { useAppStore } from '@/stores/app.store'

import { useProcessBookStore } from '@/stores/process-book.store'
import { EMessageEvent } from '@/types/enums'


const version = __VERSION__
const displayName = __DISPLAY_NAME__

// const store = useAppStore()
const processBookStore = useProcessBookStore()

const onProcessBook = () => {
  // chrome.runtime.sendMessage({ action: 'processBook' })
  processBookStore.start()
}

const onOptions = () => {
  chrome.runtime.sendMessage({ event: EMessageEvent.OPEN_OPTIONS_WINDOW })
}

</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md bg-blue-500 text-white;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
