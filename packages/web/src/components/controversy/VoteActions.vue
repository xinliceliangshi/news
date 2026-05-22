<script setup lang="ts">
import type { VoteSide } from '../../types/controversy'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  vote: [side: VoteSide]
}>()
</script>

<template>
  <section class="action-row">
    <el-button
      class="vote-button vote-button--support"
      size="large"
      round
      :disabled="disabled"
      @click="emit('vote', 'support')"
    >
      🔴 加入红方
    </el-button>
    <el-button
      class="vote-button vote-button--oppose"
      size="large"
      round
      :disabled="disabled"
      @click="emit('vote', 'oppose')"
    >
      🔵 加入蓝方
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
  height: 52px;
  border: 0;
  font-weight: 700;
}

.vote-button--support {
  background: linear-gradient(135deg, #ff6d45, #ff9a6d);
  color: #fff7ee;
}

.vote-button--oppose {
  background: linear-gradient(135deg, #5a8cff, #7baeff);
  color: #fff7ee;
}

@media (max-width: 640px) {
  .action-row {
    grid-template-columns: 1fr;
  }
}
</style>
