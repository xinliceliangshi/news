<script setup lang="ts">
defineProps<{
  supportLabel: string
  opposeLabel: string
}>()
</script>

<template>
  <section class="stance-panel">
    <div class="stance stance--support">
      <span class="stance__badge">红方阵营</span>
      <strong>{{ supportLabel }}</strong>
      <p>站这边，你默认站在情绪更热的一侧。</p>
    </div>

    <div class="stance__divider" aria-hidden="true">
      <span>VS</span>
    </div>

    <div class="stance stance--oppose">
      <span class="stance__badge">蓝方阵营</span>
      <strong>{{ opposeLabel }}</strong>
      <p>站这边，你准备和多数派正面对线。</p>
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

.stance--oppose {
  border: 1px solid rgba(90, 140, 255, 0.32);
  box-shadow: inset 0 0 24px rgba(90, 140, 255, 0.08);
}

.stance--oppose strong {
  color: #c7d8ff;
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
