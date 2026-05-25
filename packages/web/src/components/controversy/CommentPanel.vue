<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  comments: string[]
  campLabel?: string
}>()

const expanded = ref(false)

const hasOverflow = computed(() => props.comments.length > 2)
const visibleComments = computed(() =>
  expanded.value || !hasOverflow.value ? props.comments : props.comments.slice(0, 2)
)

watch(
  () => props.comments,
  () => {
    expanded.value = false
  }
)
</script>

<template>
  <section class="comment-panel">
    <header class="comment-panel__header">
      <span class="comment-panel__title">对面阵营高赞发言</span>
      <p v-if="campLabel">来自「{{ campLabel }}」阵营的真实火力</p>
    </header>

    <ul>
      <li v-for="(comment, index) in visibleComments" :key="comment">
        <span class="comment-panel__rank">#{{ index + 1 }}</span>
        <p>{{ comment }}</p>
      </li>
    </ul>

    <button
      v-if="hasOverflow"
      type="button"
      class="comment-panel__toggle"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起火力' : `展开剩余 ${comments.length - 2} 条高赞发言` }}
    </button>
  </section>
</template>

<style scoped>
.comment-panel {
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
}

.comment-panel__header {
  display: grid;
  gap: 4px;
}

.comment-panel__title {
  color: rgba(199, 216, 255, 0.88);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.comment-panel__header p {
  margin: 0;
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.86rem;
}

.comment-panel ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.comment-panel li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.comment-panel__rank {
  color: rgba(255, 188, 156, 0.9);
  font-size: 12px;
  font-weight: 800;
}

.comment-panel li p {
  margin: 0;
  color: rgba(247, 241, 232, 0.82);
  line-height: 1.45;
}

.comment-panel__toggle {
  justify-self: start;
  padding: 0;
  border: 0;
  background: transparent;
  color: #c7d8ff;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
