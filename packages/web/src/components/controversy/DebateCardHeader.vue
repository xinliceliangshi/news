<script setup lang="ts">
defineProps<{
  title: string
  hasVoted: boolean
  hotScore?: number
}>()
</script>

<template>
  <header class="card-header">
    <div>
      <span class="badge">⚔️ 阵营对抗</span>
      <h2>{{ title }}</h2>
      <p v-if="hotScore !== undefined" class="card-header__meta">热度指数 {{ hotScore }}</p>
    </div>

    <div class="card-status" :class="{ 'card-status--result': hasVoted }">
      {{ hasVoted ? '战局揭晓' : '等待站队' }}
    </div>
  </header>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.card-header h2 {
  margin: 14px 0 0;
  font-size: clamp(1.35rem, 3vw, 1.9rem);
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.card-header__meta {
  margin: 8px 0 0;
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.86rem;
}

.card-status {
  flex-shrink: 0;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 110, 69, 0.14);
  color: #ffbc9c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.card-status--result {
  background: rgba(90, 140, 255, 0.16);
  color: #c7d8ff;
}

@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
  }
}
</style>
