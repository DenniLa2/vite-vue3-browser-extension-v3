<template>
  <div style="grid-area: content">
    <!--      class="self-start"-->
    <div
      style="grid-area: version"
    >
      <p>
        Version: {{ version }}
        <a
          :href="commitURL"
          target="_blank"
        >
          (#{{ gitCommit }})
        </a>
      </p>
      <h1>Changelog</h1>
    </div>
    <!-- eslint-disable vue/no-v-html -->
    <!--      class="prose changelog"-->
    <div
      v-html="marked(changelog)"
    />
    <!--eslint-enable-->
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'


const version = __VERSION__
const changelog = __CHANGELOG__
const gitCommit = __GIT_COMMIT__
const gitURL = __GITHUB_URL__
const commitURL = `${gitURL}/commit/${gitCommit}`
</script>

<style lang="scss" scoped>
//:deep(.changelog) {
//  input[type='checkbox'] {
//    @apply checkbox checkbox-info disabled:opacity-100;
//  }
//
//  table {
//    @apply table table-zebra;
//  }
//}
</style>
