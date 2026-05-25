<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  {
    path: '/vote',
    label: '阵营对抗',
    kicker: 'Battle',
    summary: '选议题、选人格、先完成站队。',
    stepLabel: '01'
  },
  {
    path: '/persona-roast',
    label: '性格锐评',
    kicker: 'Roast',
    summary: '查看投票后生成的人格画像与调侃。',
    stepLabel: '02'
  },
  {
    path: '/other-opinions',
    label: '其他观点',
    kicker: 'Opinions',
    summary: '切换同阵营或对立阵营的表达方式。',
    stepLabel: '03'
  },
  {
    path: '/summary',
    label: '争议总结',
    kicker: 'Summary',
    summary: '回看这次站队路径和最终结论。',
    stepLabel: '04'
  }
]

const pageTitle = computed(() =>
  typeof route.meta.title === 'string' ? route.meta.title : 'Debate News'
)

const activeIndex = computed(() => navItems.findIndex((item) => item.path === route.path))

const activeItem = computed(() => navItems[activeIndex.value] ?? null)
const previousItem = computed(() =>
  activeIndex.value > 0 ? navItems[activeIndex.value - 1] : null
)
const nextItem = computed(() =>
  activeIndex.value >= 0 && activeIndex.value < navItems.length - 1 ? navItems[activeIndex.value + 1] : null
)
</script>

<template>
  <div class="shell-layout">
    <aside class="shell-sidebar">
      <div class="shell-brand">
        <span class="shell-brand__badge">Debate News</span>
        <h1>争议内容实验室</h1>
        <p>从站队到总结，按流程推进每个模块，减少跳页迷失感。</p>
      </div>

      <nav class="shell-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="shell-nav__item"
          :class="{ 'is-active': route.path === item.path }"
          :aria-current="route.path === item.path ? 'page' : undefined"
        >
          <span>{{ item.kicker }}</span>
          <strong>{{ item.stepLabel }} · {{ item.label }}</strong>
          <small>{{ item.summary }}</small>
        </RouterLink>
      </nav>

      <section v-if="activeItem" class="shell-flow-card">
        <span class="shell-flow-card__eyebrow">当前步骤</span>
        <strong>{{ activeItem.stepLabel }} · {{ activeItem.label }}</strong>
        <p>{{ activeItem.summary }}</p>

        <div class="shell-flow-card__actions">
          <RouterLink v-if="previousItem" :to="previousItem.path" class="shell-flow-card__link">
            ← {{ previousItem.label }}
          </RouterLink>
          <span v-else class="shell-flow-card__placeholder">流程起点</span>

          <RouterLink v-if="nextItem" :to="nextItem.path" class="shell-flow-card__link">
            {{ nextItem.label }} →
          </RouterLink>
          <span v-else class="shell-flow-card__placeholder">最后一步</span>
        </div>
      </section>
    </aside>

    <main class="shell-main">
      <header class="shell-main__header">
        <span class="kicker">Workflow</span>
        <h2>{{ pageTitle }}</h2>
        <p v-if="activeItem" class="shell-main__lede">{{ activeItem.summary }}</p>
      </header>

      <section class="shell-main__content">
        <RouterView />
      </section>
    </main>
  </div>
</template>
