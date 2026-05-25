<script setup lang="ts">
import type { VoteSide } from '../../types/controversy'

defineProps<{
  supportLabel: string
  opposeLabel: string
  selectedSide?: VoteSide | null
  interactive?: boolean
}>()

const emit = defineEmits<{
  select: [side: VoteSide]
}>()

function handleSelect(side: VoteSide) {
  emit('select', side)
}
</script>

<template>
  <section class="stance-panel">
    <div
      class="stance stance--support"
      :class="{
        'is-selected': selectedSide === 'support',
        'is-interactive': interactive
      }"
      :tabindex="interactive ? 0 : undefined"
      :aria-pressed="interactive ? selectedSide === 'support' : undefined"
      @click="interactive && handleSelect('support')"
      @keydown.enter.prevent="interactive && handleSelect('support')"
      @keydown.space.prevent="interactive && handleSelect('support')"
    >
      <span class="stance__badge">红方阵营</span>
      <strong>{{ supportLabel }}</strong>
      <p>
        {{ selectedSide === 'support' ? '已锁定红方预选，点击下方按钮即可入场。' : '站这边，你默认站在情绪更热的一侧。' }}
      </p>
    </div>

    <div class="stance__divider" aria-hidden="true">
      <span>VS</span>
    </div>

    <div
      class="stance stance--oppose"
      :class="{
        'is-selected': selectedSide === 'oppose',
        'is-interactive': interactive
      }"
      :tabindex="interactive ? 0 : undefined"
      :aria-pressed="interactive ? selectedSide === 'oppose' : undefined"
      @click="interactive && handleSelect('oppose')"
      @keydown.enter.prevent="interactive && handleSelect('oppose')"
      @keydown.space.prevent="interactive && handleSelect('oppose')"
    >
      <span class="stance__badge">蓝方阵营</span>
      <strong>{{ opposeLabel }}</strong>
      <p>
        {{ selectedSide === 'oppose' ? '已锁定蓝方预选，准备和多数派正面对线。' : '站这边，你准备和多数派正面对线。' }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.stance-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
}

.stance {
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.stance.is-interactive {
  cursor: pointer;
}

.stance.is-interactive:hover,
.stance.is-interactive:focus-visible {
  transform: translateY(-2px);
  outline: none;
}

.stance.is-selected {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.07);
}

.stance__badge {
  color: rgba(199, 216, 255, 0.72);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stance strong {
  font-size: 1rem;
  line-height: 1.35;
}

.stance p {
  margin: 0;
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.84rem;
}

.stance--support {
  border: 1px solid rgba(255, 110, 69, 0.32);
  box-shadow: inset 0 0 24px rgba(255, 109, 69, 0.08);
}

.stance--support strong {
  color: #ffbc9c;
}

.stance--support.is-selected {
  border-color: rgba(255, 138, 93, 0.6);
  box-shadow:
    inset 0 0 28px rgba(255, 109, 69, 0.12),
    0 14px 36px rgba(255, 109, 69, 0.12);
}

.stance--oppose {
  border: 1px solid rgba(90, 140, 255, 0.32);
  box-shadow: inset 0 0 24px rgba(90, 140, 255, 0.08);
}

.stance--oppose strong {
  color: #c7d8ff;
}

.stance--oppose.is-selected {
  border-color: rgba(123, 174, 255, 0.62);
  box-shadow:
    inset 0 0 28px rgba(90, 140, 255, 0.12),
    0 14px 36px rgba(90, 140, 255, 0.12);
}

.stance__divider {
  display: grid;
  place-items: center;
}

.stance__divider span {
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff4e5;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

@media (max-width: 720px) {
  .stance-panel {
    grid-template-columns: 1fr;
  }

  .stance__divider {
    padding: 2px 0;
  }
}
</style>
