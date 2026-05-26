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
  gap: 14px;
  align-items: stretch;
}

.stance {
  position: relative;
  display: grid;
  gap: 8px;
  padding: 18px 16px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.stance::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  border-radius: 20px 20px 0 0;
  opacity: 0.7;
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
  border: 1px solid rgba(255, 110, 69, 0.28);
  box-shadow: inset 0 -24px 40px rgba(255, 109, 69, 0.06);
}

.stance--support::after {
  background: linear-gradient(90deg, #ff6d45, #ff9a6d);
}

.stance--support strong {
  color: #ffbc9c;
}

.stance--support.is-selected {
  border-color: rgba(255, 138, 93, 0.55);
  background: linear-gradient(180deg, rgba(255, 109, 69, 0.14), rgba(255, 255, 255, 0.04));
  box-shadow:
    inset 0 0 32px rgba(255, 109, 69, 0.1),
    0 16px 40px rgba(255, 109, 69, 0.14);
}

.stance--oppose {
  border: 1px solid rgba(90, 140, 255, 0.28);
  box-shadow: inset 0 -24px 40px rgba(90, 140, 255, 0.06);
}

.stance--oppose::after {
  background: linear-gradient(90deg, #5a8cff, #7baeff);
}

.stance--oppose strong {
  color: #c7d8ff;
}

.stance--oppose.is-selected {
  border-color: rgba(123, 174, 255, 0.55);
  background: linear-gradient(180deg, rgba(90, 140, 255, 0.14), rgba(255, 255, 255, 0.04));
  box-shadow:
    inset 0 0 32px rgba(90, 140, 255, 0.1),
    0 16px 40px rgba(90, 140, 255, 0.14);
}

.stance__divider {
  display: grid;
  place-items: center;
}

.stance__divider span {
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgba(255, 109, 69, 0.16), rgba(90, 140, 255, 0.16)),
    rgba(255, 255, 255, 0.06);
  color: #fff4e5;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
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
