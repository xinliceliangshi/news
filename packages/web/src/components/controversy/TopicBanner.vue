<script setup lang="ts">
import { computed } from 'vue'

import {
  getTopicMoodMeta,
  resolveTopicMood,
  type TopicMoodId
} from '../../constants/topicMoods'

const props = defineProps<{
  mood?: TopicMoodId
  tags?: string[]
  topicId?: number
  hotScore?: number
}>()

const moodId = computed(() =>
  props.mood ?? resolveTopicMood(props.tags ?? [], props.topicId ?? 0)
)

const moodMeta = computed(() => getTopicMoodMeta(moodId.value))
</script>

<template>
  <section class="topic-banner" :class="`topic-banner--${moodId}`" aria-label="议题情绪横幅">
    <div class="topic-banner__scene" aria-hidden="true">
      <template v-if="moodId === 'ai-office'">
        <span class="topic-banner__orb topic-banner__orb--a" />
        <span class="topic-banner__orb topic-banner__orb--b" />
        <div class="topic-banner__monitors">
          <span /><span /><span />
        </div>
        <div class="topic-banner__desk" />
      
      </template>

      <template v-else-if="moodId === 'cyber-net'">
        <div class="topic-banner__grid" />
        <span class="topic-banner__beam topic-banner__beam--left" />
        <span class="topic-banner__beam topic-banner__beam--right" />
        <span class="topic-banner__node" />
        <span class="topic-banner__node topic-banner__node--b" />
      </template>

      <template v-else-if="moodId === 'keyboard-war'">
        <span class="topic-banner__key topic-banner__key--red">Q</span>
        <span class="topic-banner__key topic-banner__key--blue">W</span>
        <span class="topic-banner__key topic-banner__key--red topic-banner__key--alt">A</span>
        <span class="topic-banner__key topic-banner__key--blue topic-banner__key--alt">S</span>
        <span class="topic-banner__slash" />
      </template>

      <template v-else>
        <div class="topic-banner__bubble topic-banner__bubble--a">🔥 前排吃瓜</div>
        <div class="topic-banner__bubble topic-banner__bubble--b">👎 对面急了</div>
        <div class="topic-banner__bubble topic-banner__bubble--c">💬 已开骂</div>
        <span class="topic-banner__heart">❤️</span>
        <span class="topic-banner__heart topic-banner__heart--b">😤</span>
      </template>
    </div>

    <div class="topic-banner__copy">
      <span class="topic-banner__label">{{ moodMeta.label }}</span>
      <p class="topic-banner__tagline">{{ moodMeta.tagline }}</p>
      <p v-if="hotScore !== undefined" class="topic-banner__meta">热度指数 {{ hotScore }}</p>
    </div>
  </section>
</template>

<style scoped>
.topic-banner {
  position: relative;
  overflow: hidden;
  min-height: 140px;
  padding: 18px 18px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(8, 12, 22, 0.55);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.topic-banner__scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.topic-banner__copy {
  position: relative;
  z-index: 1;
  max-width: 72%;
}

.topic-banner__label {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff4e5;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.topic-banner__tagline {
  margin: 12px 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: #fff7ee;
}

.topic-banner__meta {
  margin: 8px 0 0;
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.82rem;
}

/* AI办公室 */
.topic-banner--ai-office {
  background:
    radial-gradient(circle at 88% 18%, rgba(56, 232, 255, 0.22), transparent 34%),
    linear-gradient(135deg, rgba(10, 28, 42, 0.95), rgba(8, 16, 30, 0.92));
}

.topic-banner--ai-office .topic-banner__label {
  background: rgba(56, 232, 255, 0.14);
  color: #9ef6ff;
}

.topic-banner__monitors {
  position: absolute;
  top: 18px;
  right: 22px;
  display: grid;
  grid-template-columns: repeat(3, 34px);
  gap: 8px;
}

.topic-banner__monitors span {
  height: 44px;
  border-radius: 8px;
  border: 1px solid rgba(158, 246, 255, 0.35);
  background: linear-gradient(180deg, rgba(56, 232, 255, 0.28), rgba(12, 40, 58, 0.5));
  box-shadow: 0 0 18px rgba(56, 232, 255, 0.2);
}

.topic-banner__desk {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 150px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(56, 232, 255, 0.5), rgba(123, 174, 255, 0.2));
}

.topic-banner__chip {
  position: absolute;
  right: 118px;
  top: 64px;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #d8fbff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.topic-banner__orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
}

.topic-banner__orb--a {
  top: -24px;
  left: -18px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(56, 232, 255, 0.28), transparent 68%);
}

.topic-banner__orb--b {
  bottom: -40px;
  right: 40%;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(123, 174, 255, 0.2), transparent 70%);
}

/* 赛博互联网 */
.topic-banner--cyber-net {
  background:
    radial-gradient(circle at 12% 80%, rgba(255, 64, 196, 0.18), transparent 38%),
    linear-gradient(160deg, rgba(18, 8, 36, 0.96), rgba(8, 14, 34, 0.94));
}

.topic-banner--cyber-net .topic-banner__label {
  background: rgba(255, 64, 196, 0.14);
  color: #ffc4ec;
}

.topic-banner__grid {
  position: absolute;
  right: -10px;
  bottom: -28px;
  width: 220px;
  height: 120px;
  transform: perspective(280px) rotateX(58deg);
  background:
    linear-gradient(90deg, rgba(255, 64, 196, 0.45) 1px, transparent 1px),
    linear-gradient(rgba(56, 232, 255, 0.42) 1px, transparent 1px);
  background-size: 18px 18px;
  mask-image: linear-gradient(180deg, transparent, #000 35%, #000 85%, transparent);
  opacity: 0.75;
}

.topic-banner__beam {
  position: absolute;
  width: 2px;
  height: 88px;
  background: linear-gradient(180deg, transparent, rgba(56, 232, 255, 0.9), transparent);
}

.topic-banner__beam--left {
  top: 12px;
  right: 96px;
  transform: rotate(18deg);
}

.topic-banner__beam--right {
  top: 8px;
  right: 42px;
  background: linear-gradient(180deg, transparent, rgba(255, 64, 196, 0.9), transparent);
  transform: rotate(-14deg);
}

.topic-banner__node {
  position: absolute;
  top: 34px;
  right: 72px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #38e8ff;
  box-shadow: 0 0 16px rgba(56, 232, 255, 0.8);
}

.topic-banner__node--b {
  top: 72px;
  right: 28px;
  background: #ff40c4;
  box-shadow: 0 0 16px rgba(255, 64, 196, 0.75);
}

/* 键盘战争 */
.topic-banner--keyboard-war {
  background:
    radial-gradient(circle at 78% 24%, rgba(255, 88, 88, 0.2), transparent 36%),
    radial-gradient(circle at 92% 70%, rgba(90, 140, 255, 0.22), transparent 34%),
    linear-gradient(145deg, rgba(24, 10, 16, 0.96), rgba(10, 14, 30, 0.94));
}

.topic-banner--keyboard-war .topic-banner__label {
  background: rgba(255, 255, 255, 0.1);
  color: #ffd0c8;
}

.topic-banner__key {
  position: absolute;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
}

.topic-banner__key--red {
  top: 22px;
  right: 88px;
  border: 1px solid rgba(255, 120, 96, 0.5);
  background: linear-gradient(180deg, rgba(255, 109, 69, 0.55), rgba(120, 24, 24, 0.65));
  color: #ffe8df;
}

.topic-banner__key--blue {
  top: 54px;
  right: 34px;
  border: 1px solid rgba(123, 174, 255, 0.5);
  background: linear-gradient(180deg, rgba(90, 140, 255, 0.55), rgba(24, 40, 120, 0.65));
  color: #e8f0ff;
}

.topic-banner__key--alt {
  transform: rotate(-8deg);
}

.topic-banner__key--blue.topic-banner__key--alt {
  top: 18px;
  right: 28px;
  transform: rotate(10deg);
}

.topic-banner__slash {
  position: absolute;
  top: 38px;
  right: 62px;
  width: 3px;
  height: 72px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 109, 69, 0.2), #fff4e5, rgba(90, 140, 255, 0.2));
  transform: rotate(24deg);
  opacity: 0.85;
}

/* 评论区风格 */
.topic-banner--comment-zone {
  background:
    radial-gradient(circle at 86% 30%, rgba(255, 196, 92, 0.16), transparent 34%),
    linear-gradient(155deg, rgba(20, 16, 12, 0.96), rgba(14, 18, 28, 0.94));
}

.topic-banner--comment-zone .topic-banner__label {
  background: rgba(255, 196, 92, 0.14);
  color: #ffe2a8;
}

.topic-banner__bubble {
  position: absolute;
  padding: 8px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 244, 229, 0.92);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  backdrop-filter: blur(6px);
}

.topic-banner__bubble--a {
  top: 18px;
  right: 24px;
  transform: rotate(-4deg);
}

.topic-banner__bubble--b {
  top: 58px;
  right: 72px;
  transform: rotate(5deg);
}

.topic-banner__bubble--c {
  top: 34px;
  right: 8px;
  transform: rotate(2deg);
  opacity: 0.82;
}

.topic-banner__heart {
  position: absolute;
  right: 148px;
  bottom: 18px;
  font-size: 18px;
  filter: drop-shadow(0 0 10px rgba(255, 110, 69, 0.35));
}

.topic-banner__heart--b {
  right: 118px;
  bottom: 42px;
  font-size: 16px;
}

@media (max-width: 640px) {
  .topic-banner {
    min-height: 132px;
    padding: 16px;
  }

  .topic-banner__copy {
    max-width: 100%;
  }

  .topic-banner__tagline {
    font-size: 0.98rem;
  }
}
</style>
