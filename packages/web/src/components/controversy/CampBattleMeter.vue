<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  supportLabel: string
  opposeLabel: string
  supportPercent: number
  opposePercent: number
  supportCount?: number
  opposeCount?: number
  highlightSide?: 'support' | 'oppose' | null
  compact?: boolean
}>()

const supportWidth = computed(() => `${Math.min(100, Math.max(0, props.supportPercent))}%`)
const opposeWidth = computed(() => `${Math.min(100, Math.max(0, props.opposePercent))}%`)

const tensionLabel = computed(() => {
  const gap = Math.abs(props.supportPercent - props.opposePercent)

  if (gap >= 30) {
    return '战局胶着，一方明显占优'
  }

  if (gap >= 12) {
    return '势均力敌，随时可能翻盘'
  }

  return '五五开，对面随时反扑'
})
</script>

<template>
  <section class="camp-meter" :class="{ 'camp-meter--compact': compact }">
    <div class="camp-meter__teams">
      <div
        class="camp-meter__team camp-meter__team--support"
        :class="{ 'camp-meter__team--active': highlightSide === 'support' }"
      >
        <span>红方 · 支持</span>
        <strong>{{ supportLabel }}</strong>
        <p v-if="supportCount !== undefined">{{ supportCount }} 票 · {{ supportPercent }}%</p>
        <p v-else>{{ supportPercent }}%</p>
      </div>

      <div class="camp-meter__vs" aria-hidden="true">VS</div>

      <div
        class="camp-meter__team camp-meter__team--oppose"
        :class="{ 'camp-meter__team--active': highlightSide === 'oppose' }"
      >
        <span>蓝方 · 反对</span>
        <strong>{{ opposeLabel }}</strong>
        <p v-if="opposeCount !== undefined">{{ opposeCount }} 票 · {{ opposePercent }}%</p>
        <p v-else>{{ opposePercent }}%</p>
      </div>
    </div>

    <div class="camp-meter__track" role="img" :aria-label="`支持 ${supportPercent}%，反对 ${opposePercent}%`">
      <div class="camp-meter__fill camp-meter__fill--support" :style="{ width: supportWidth }" />
      <div class="camp-meter__fill camp-meter__fill--oppose" :style="{ width: opposeWidth }" />
      <span class="camp-meter__midline" />
    </div>

    <p v-if="!compact" class="camp-meter__tension">{{ tensionLabel }}</p>
  </section>
</template>

<style scoped>
.camp-meter {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    rgba(255, 255, 255, 0.03);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.camp-meter--compact {
  gap: 10px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.camp-meter__teams {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.camp-meter__team {
  display: grid;
  gap: 4px;
}

.camp-meter__team span {
  color: rgba(199, 216, 255, 0.72);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.camp-meter__team strong {
  font-size: 0.95rem;
  line-height: 1.35;
}

.camp-meter__team p {
  margin: 0;
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.82rem;
}

.camp-meter__team--support strong {
  color: #ffbc9c;
}

.camp-meter__team--oppose {
  text-align: right;
}

.camp-meter__team--oppose strong {
  color: #c7d8ff;
}

.camp-meter__team--active {
  transform: translateY(-1px);
}

.camp-meter__team--support.camp-meter__team--active strong {
  color: #fff4e5;
  text-shadow: 0 0 16px rgba(255, 180, 140, 0.35);
}

.camp-meter__team--oppose.camp-meter__team--active strong {
  color: #fff4e5;
  text-shadow: 0 0 16px rgba(123, 174, 255, 0.32);
}

.camp-meter__vs {
  align-self: center;
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(199, 216, 255, 0.82);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.camp-meter__track {
  position: relative;
  display: flex;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}

.camp-meter__fill {
  height: 100%;
  transition: width 0.45s ease;
}

.camp-meter__fill--support {
  background: linear-gradient(90deg, #ff6d45, #ff9a6d);
}

.camp-meter__fill--oppose {
  margin-left: auto;
  background: linear-gradient(270deg, #5a8cff, #7baeff);
}

.camp-meter__midline {
  position: absolute;
  top: 1px;
  bottom: 1px;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
}

.camp-meter__tension {
  margin: 0;
  color: rgba(247, 241, 232, 0.68);
  font-size: 0.86rem;
  text-align: center;
}

@media (max-width: 640px) {
  .camp-meter__teams {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .camp-meter__vs {
    justify-self: center;
  }

  .camp-meter__team--oppose {
    text-align: left;
  }
}
</style>
