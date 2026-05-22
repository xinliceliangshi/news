<script setup lang="ts">
defineProps<{
  isMinority: boolean
  iqLeft: number
  userLabel: string
  majorityLabel: string
}>()
</script>

<template>
  <section class="outcome-box" :class="{ 'outcome-box--minority': isMinority }">
    <div class="outcome-box__meta">
      <span class="outcome-box__tag">{{ isMinority ? '少数派' : '多数派' }}</span>
      <span class="outcome-box__camp">你的阵营 · {{ userLabel }}</span>
    </div>

    <template v-if="isMinority">
      <strong>你站了少数派，对面正在集结火力</strong>
      <p>本轮 -20 智商税，剩余 {{ iqLeft }} 分。多数派「{{ majorityLabel }}」暂时占上风。</p>
    </template>

    <template v-else>
      <strong>你和多数派站在一起</strong>
      <p>阵营压力暂时甩给「{{ majorityLabel }}」那边，但战局随时可能翻盘。</p>
    </template>
  </section>
</template>

<style scoped>
.outcome-box {
  display: grid;
  gap: 10px;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid rgba(123, 174, 255, 0.28);
  background: linear-gradient(135deg, rgba(90, 140, 255, 0.12), rgba(255, 255, 255, 0.03));
}

.outcome-box--minority {
  border-color: rgba(255, 110, 69, 0.34);
  background: linear-gradient(135deg, rgba(255, 109, 69, 0.14), rgba(255, 255, 255, 0.03));
}

.outcome-box__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.outcome-box__tag,
.outcome-box__camp {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.outcome-box__tag {
  background: rgba(255, 255, 255, 0.1);
  color: #fff4e5;
}

.outcome-box__camp {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(199, 216, 255, 0.88);
}

.outcome-box strong {
  font-size: 1.08rem;
  line-height: 1.35;
}

.outcome-box p {
  margin: 0;
  color: rgba(247, 241, 232, 0.72);
}
</style>
