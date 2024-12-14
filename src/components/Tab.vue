<template>
  <div
    class="tab-wrapper"
    :class="`tab-wrapper-${type}`"
  >
    <button
      class="btn btn-circle btn-xs btn-warning close-button"
      @click="closeTab"
    >
      x
    </button>
    <div>type: {{ type }}</div>
    <div>title: {{ title }}</div>
    <div>url: {{ tab.url }}</div>
  </div>
  <!--  <pre>{{ tab }}</pre>-->
</template>

<script setup lang="ts">
/** Created by Denis Abramyan (dennila2@gmail.com) on 13.12.2024 */

import ITab = chrome.tabs.Tab


interface Props {
  tab: ITab
}

const props = defineProps<Props>()

const type = computed(() => {
  if ((props.tab.title ?? '').includes('Аудиокниги')) {
    return 'books'
  }
  if ((props.tab.title ?? '').includes('Аудиокнига')) {
    return 'book'
  }
  return 'unknown'
})

const title = computed(() => {
  if (type.value === 'books') {
    const parts = props.tab.title!.split(' слушать')
    return parts[0]
  }

  if (type.value === 'book') {
    const pattern: RegExp = /Аудиокнига (.+?) слушать/

    const match = props.tab.title!.match(pattern)

    if (match && match[1]) {
      return match[1]
    }
    else {
      return props.tab.title
    }
  }

  return 'XZ'
})

const closeTab = () => {
  chrome.tabs.remove(props.tab.id!)
}
</script>

<style scoped lang="scss">
.tab-wrapper {
  position: relative;
  height: auto;
  width: 200px;
  border-radius: 4px;
  padding: 16px 8px 8px;
  margin: 10px;

  &-books {
    $color: #06359f;
    border: 1px solid $color;
    color: $color;
    background-color: rgb(64, 106, 196);
  }

  &-book {
    $color: #00766a;
    border: 1px solid $color;
    color: $color;
    background-color: rgb(64, 196, 181);
  }

  &-unknown {
    $color: red;
    border: 1px solid $color;
    color: $color;
    background-color: #dc7e73;
  }
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  //width: 24px;
  //height: 24px;
  //display: flex;
  //align-items: center;
  //justify-content: center;
}
</style>
