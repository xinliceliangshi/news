<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <section class="page-frame">
    <header class="page-frame__header">
      <span class="badge">基础框架</span>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </header>

    <div class="page-frame__body">
      <slot />
    </div>
  </section>
</template>
