<script setup lang="ts">
defineProps<{
  supportLabel: string
  opposeLabel: string
  supportRate: number
  opposeRate: number
  userSide?: 'support' | 'oppose' | null
}>()
</script>

<template>
  <section class="result-panel">
    <header class="result-panel__header">
      <span>战局揭晓</span>
      <strong>多数派压力已刷新</strong>
    </header>

    <div class="result-row">
      <div class="result-label">
        <span>{{ supportLabel }}</span>
        <strong :class="{ 'is-user': userSide === 'support' }">{{ supportRate }}%</strong>
      </div>
      <div class="result-bar">
        <div class="result-bar__fill result-bar__fill--support" :style="{ width: `${supportRate}%` }" />
      </div>
    </div>

    <div class="result-row">
      <div class="result-label">
        <span>{{ opposeLabel }}</span>
        <strong :class="{ 'is-user': userSide === 'oppose' }">{{ opposeRate }}%</strong>
      </div>
      <div class="result-bar">
        <div class="result-bar__fill result-bar__fill--oppose" :style="{ width: `${opposeRate}%` }" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.result-panel {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
}

.result-panel__header {
  display: grid;
  gap: 4px;
}

.result-panel__header span {
  color: rgba(199, 216, 255, 0.72);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.result-panel__header strong {
  font-size: 1.05rem;
}

.result-row {
  display: grid;
  gap: 8px;
}

.result-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.result-label span {
  color: rgba(247, 241, 232, 0.78);
  font-size: 0.9rem;
}

.result-label strong {
  font-size: 1.2rem;
}

.result-label strong.is-user {
  color: #fff4e5;
  text-shadow: 0 0 16px rgba(255, 180, 140, 0.35);
}

.result-bar {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}

.result-bar__fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.45s ease;
}

.result-bar__fill--support {
  background: linear-gradient(90deg, #ff6d45, #ff9a6d);
}

.result-bar__fill--oppose {
  background: linear-gradient(90deg, #5a8cff, #7baeff);
}
</style>
