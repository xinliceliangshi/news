<script setup lang="ts">
import { PERSONA_CONFIGS, getPersonaThemeStyle, type MbtiType } from '../../constants/personas'

const model = defineModel<MbtiType | null>({ required: true })
</script>

<template>
  <section class="mbti-selector">
    <header class="mbti-selector__header">
      <span>你的 MBTI</span>
      <strong>{{ model ?? '请先选择' }}</strong>
    </header>
    <p class="mbti-selector__hint">站队前选好人格类型，投票后会按议题、阵营和 MBTI 生成锐评。</p>
    <div class="mbti-selector__grid">
      <button
        v-for="persona in PERSONA_CONFIGS"
        :key="persona.mbti"
        type="button"
        class="mbti-chip"
        :class="{ 'mbti-chip--active': model === persona.mbti }"
        :style="getPersonaThemeStyle(persona.mbti)"
        @click="model = persona.mbti"
      >
        <strong>{{ persona.mbti }}</strong>
        <span>{{ persona.label }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.mbti-selector {
  display: grid;
  gap: 12px;
}

.mbti-selector__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 0 2px;
}

.mbti-selector__header span {
  color: rgba(199, 216, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mbti-selector__header strong {
  font-size: 1.1rem;
  color: #fff4e5;
}

.mbti-selector__hint {
  margin: 0;
  color: rgba(247, 241, 232, 0.68);
  font-size: 0.86rem;
}

.mbti-selector__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.mbti-chip {
  display: grid;
  gap: 4px;
  padding: 11px 0;
  border: 1px solid var(--persona-border, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
  background:
    radial-gradient(circle at top, var(--persona-glow, rgba(255, 255, 255, 0.08)), transparent 72%),
    rgba(255, 255, 255, 0.03);
  color: rgba(247, 241, 232, 0.88);
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.mbti-chip strong,
.mbti-chip span {
  display: block;
}

.mbti-chip strong {
  font-size: 0.84rem;
  font-weight: 800;
}

.mbti-chip span {
  color: var(--persona-text, rgba(247, 241, 232, 0.58));
  opacity: 0.72;
  font-size: 0.72rem;
  font-weight: 600;
}

.mbti-chip:hover {
  border-color: var(--persona-accent, rgba(255, 138, 93, 0.42));
  transform: translateY(-1px);
}

.mbti-chip--active {
  border-color: var(--persona-accent, rgba(255, 138, 93, 0.55));
  background:
    radial-gradient(circle at top, var(--persona-glow, rgba(255, 255, 255, 0.14)), transparent 72%),
    var(--persona-soft, rgba(255, 110, 69, 0.16));
  color: var(--persona-text, #fff4e5);
  box-shadow: 0 14px 28px var(--persona-soft, rgba(255, 110, 69, 0.14));
}

.mbti-chip--active span {
  color: var(--persona-text, rgba(255, 244, 229, 0.82));
  opacity: 0.9;
}

@media (max-width: 640px) {
  .mbti-selector__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
