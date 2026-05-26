<script setup lang="ts">
import type { VoteSide } from '../../types/controversy'

defineProps<{
  disabled?: boolean
  selectedSide?: VoteSide | null
  supportText?: string
  opposeText?: string
}>()

const emit = defineEmits<{
  vote: [side: VoteSide]
}>()
</script>

<template>
  <section class="action-row">
    <el-button
      class="vote-button vote-button--support"
      :class="{ 'is-selected': selectedSide === 'support' }"
      size="large"
      round
      :disabled="disabled"
      :aria-pressed="selectedSide === 'support'"
      @click="emit('vote', 'support')"
    >
      {{ supportText ?? '🔴 加入红方' }}
    </el-button>
    <el-button
      class="vote-button vote-button--oppose"
      :class="{ 'is-selected': selectedSide === 'oppose' }"
      size="large"
      round
      :disabled="disabled"
      :aria-pressed="selectedSide === 'oppose'"
      @click="emit('vote', 'oppose')"
    >
      {{ opposeText ?? '🔵 加入蓝方' }}
    </el-button>
  </section>
</template>

<style scoped>
.action-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.vote-button {
  width: 100%;
  height: 54px;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease,
    opacity 0.2s ease;
}

.vote-button:not(:disabled):hover {
  transform: translateY(-2px);
}

.vote-button:disabled {
  opacity: 0.42;
  filter: grayscale(0.2);
}

.vote-button.is-selected {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);
  filter: saturate(1.1);
}

.vote-button--support {
  background: linear-gradient(135deg, #ff6d45, #ff9a6d);
  color: #fff7ee;
  box-shadow: 0 10px 24px rgba(255, 109, 69, 0.22);
}

.vote-button--oppose {
  background: linear-gradient(135deg, #5a8cff, #7baeff);
  color: #fff7ee;
  box-shadow: 0 10px 24px rgba(90, 140, 255, 0.22);
}

@media (max-width: 640px) {
  .action-row {
    grid-template-columns: 1fr;
  }
}
</style>
