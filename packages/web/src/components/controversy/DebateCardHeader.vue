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
  padding-bottom: 4px;
}

.card-header .badge {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 244, 229, 0.92);
}

.card-header h2 {
  margin: 12px 0 0;
  max-width: 18ch;
  font-size: clamp(1.4rem, 3.2vw, 2rem);
  line-height: 1.12;
  letter-spacing: -0.04em;
}

.card-header__meta {
  margin: 8px 0 0;
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.86rem;
}

.card-status {
  flex-shrink: 0;
  padding: 10px 14px;
  border: 1px solid rgba(255, 138, 93, 0.28);
  border-radius: 999px;
  background: rgba(255, 110, 69, 0.12);
  color: #ffbc9c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: 0 8px 24px rgba(255, 109, 69, 0.12);
}

.card-status--result {
  border-color: rgba(123, 174, 255, 0.32);
  background: rgba(90, 140, 255, 0.14);
  color: #c7d8ff;
  box-shadow: 0 8px 24px rgba(90, 140, 255, 0.12);
}

@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
  }
}
</style>
