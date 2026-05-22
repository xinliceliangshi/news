<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/login', label: '登录注册', kicker: 'Entry' },
  { path: '/vote', label: '投票页', kicker: 'Vote' },
  { path: '/persona-roast', label: '性格生成锐评页', kicker: 'Roast' },
  { path: '/other-opinions', label: '查看其他观点页', kicker: 'Opinions' },
  { path: '/summary', label: '总结页', kicker: 'Summary' }
]

const pageTitle = computed(() =>
  typeof route.meta.title === 'string' ? route.meta.title : 'Debate News'
)
</script>

<template>
  <div class="shell-layout">
    <aside class="shell-sidebar">
      <div class="shell-brand">
        <span class="shell-brand__badge">Debate News</span>
        <h1>争议内容实验室</h1>
        <p>先把页面骨架和流转路径跑通，再逐个补业务内容和接口状态。</p>
      </div>

      <nav class="shell-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="shell-nav__item"
          :class="{ 'is-active': route.path === item.path }"
        >
          <span>{{ item.kicker }}</span>
          <strong>{{ item.label }}</strong>
        </RouterLink>
      </nav>
    </aside>

    <main class="shell-main">
      <header class="shell-main__header">
        <span class="kicker">Workflow</span>
        <h2>{{ pageTitle }}</h2>
      </header>

      <section class="shell-main__content">
        <RouterView />
      </section>
    </main>
  </div>
</template>
