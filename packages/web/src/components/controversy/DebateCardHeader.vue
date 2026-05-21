<script setup lang="ts">
defineProps<{
  title: string
  hasVoted: boolean
}>()
</script>

<template>
  <header class="card-header">
    <div>
      <span class="badge">🔥 争议实验室</span>
      <h2>{{ title }}</h2>
    </div>

    <div class="card-status" :class="{ 'card-status--result': hasVoted }">
      {{ hasVoted ? '多数派揭晓' : '等待站队' }}
    </div>
  </header>
</template>
