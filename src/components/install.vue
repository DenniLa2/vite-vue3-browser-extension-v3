<template>
  <!--  class="w-full h-full flex flex-col gap-y-4 justify-center items-center"-->
  <div>
    <!--   class="text-4xl font-bold"  -->
    <h1>
      🎉 Installed! 🚀
    </h1>
    <!--   class="text-xl" -->
    <p>
      Thank you for installing {{ displayName }}! ❤️
    </p>
    <!-- class="text-lg" -->
    <p>
      Now you can close this tab and start using the extension.
    </p>
    <p>Version: {{ version }}</p>
  </div>
</template>

<script setup lang="ts">
const displayName = __DISPLAY_NAME__
const version = __VERSION__
</script>

<style lang="scss" scoped></style>
