<script setup lang="ts">
defineProps<{
  supportRate: number
  opposeRate: number
}>()
</script>

<template>
  <section class="result-panel">
    <div class="result-row">
      <div class="result-label">
        <span>支持</span>
        <strong>{{ supportRate }}%</strong>
      </div>
      <div class="result-bar">
        <div class="result-bar__fill result-bar__fill--support" :style="{ width: `${supportRate}%` }" />
      </div>
    </div>

    <div class="result-row">
      <div class="result-label">
        <span>反对</span>
        <strong>{{ opposeRate }}%</strong>
      </div>
      <div class="result-bar">
        <div class="result-bar__fill result-bar__fill--oppose" :style="{ width: `${opposeRate}%` }" />
      </div>
    </div>
  </section>
</template>
