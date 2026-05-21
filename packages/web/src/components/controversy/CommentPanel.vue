<script setup lang="ts">
defineProps<{
  comments: string[]
}>()
</script>

<template>
  <section class="comment-panel">
    <span class="comment-panel__title">对面阵营高赞发言</span>
    <ul>
      <li v-for="comment in comments" :key="comment">{{ comment }}</li>
    </ul>
  </section>
</template>
