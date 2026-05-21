<script setup lang="ts">
defineProps<{
  supportLabel: string
  opposeLabel: string
}>()
</script>

<template>
  <section class="stance-panel">
    <div class="stance stance--support">
      <span>支持方</span>
      <strong>{{ supportLabel }}</strong>
    </div>

    <div class="stance stance--oppose">
      <span>反对方</span>
      <strong>{{ opposeLabel }}</strong>
    </div>
  </section>
</template>
