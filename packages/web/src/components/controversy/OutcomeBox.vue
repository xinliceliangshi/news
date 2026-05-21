<script setup lang="ts">
defineProps<{
  isMinority: boolean
  iqLeft: number
}>()
</script>

<template>
  <section class="outcome-box" :class="{ 'outcome-box--minority': isMinority }">
    <template v-if="isMinority">
      <span class="outcome-box__title">😬 你站了少数派</span>
      <strong>-20 智商税</strong>
      <p>剩余：{{ iqLeft }} 分</p>
    </template>

    <template v-else>
      <span class="outcome-box__title">😏 你站在多数派</span>
      <strong>本轮免税</strong>
      <p>阵营压力暂时在对面。</p>
    </template>
  </section>
</template>
