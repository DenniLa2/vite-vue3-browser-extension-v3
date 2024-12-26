<template>
  <div>
    <!--      class="flex flex-col gap-y-4"-->
    <div
      style="grid-area: title"
    >
      <!--  class="text-4xl font-bold text-center" -->
      <h1>
        🎉 Updated! 🎉
      </h1>
      <!--  class="text-lg" -->
      <p>
        {{ displayName }} has been updated to the latest version. 🎉
      </p>
      <!--  class="text-lg" -->
      <p>
        Version: {{ version }}
      </p>

      <!--  class="text-2xl font-bold" -->
      <h1>
        What's new?
      </h1>
    </div>

    <p>Icons</p>
    <!--    <div>
          <i-fa-solid-dice-five />
          <i-heroicons-outline:menu-alt-2 />
          <i-heroicons-outline-menu-alt-2 />
        </div>-->

    <Changelog />
  </div>
</template>

<script setup lang="ts">
const displayName = __DISPLAY_NAME__
const version = __VERSION__
</script>

<style lang="scss" scoped>
.update-grid {
  grid-template-areas:
    '. . .'
    '. title .'
    '. . .'
    '. content .';
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
