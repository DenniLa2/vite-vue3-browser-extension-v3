<template>
  <!--  <header
      aria-label="Site Header"
      class="bg-gray-50"
    >
      Options Header
    </header>-->

  <!--  class="flex gap-x-2"-->
  <div>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/options/bk-tabs">Tabs</RouterLink>
    <RouterLink to="/options/process-books">Process books</RouterLink>
  </div>

  <Button>Some</Button>

  <RouterView />

  <!--  <p>Count: {{ count }}</p>-->

  <!--  <footer
      aria-label="Site Footer"
      class="bg-gray-50"
    >
      Options Footer
    </footer>-->
</template>

<script setup lang="ts">
// import { useAppStore } from '@/stores/app.store'


// const store = useAppStore()

// const count = computed(() => store.count)
</script>

<style scoped></style>
