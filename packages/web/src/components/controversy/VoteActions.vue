<script setup lang="ts">
import type { VoteSide } from '../../types/controversy'

const emit = defineEmits<{
  vote: [side: VoteSide]
}>()
</script>

<template>
  <section class="action-row">
    <el-button class="vote-button vote-button--support" size="large" round @click="emit('vote', 'support')">
      🔴 我站支持
    </el-button>
    <el-button class="vote-button vote-button--oppose" size="large" round @click="emit('vote', 'oppose')">
      🔵 我站反对
    </el-button>
  </section>
</template>
