<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    eyebrow?: string
    variant?: 'default' | 'battle'
  }>(),
  {
    eyebrow: '基础框架',
    variant: 'default'
  }
)
</script>

<template>
  <section class="page-frame" :class="`page-frame--${variant}`">
    <header class="page-frame__header">
      <span class="badge" :class="{ 'badge--battle': variant === 'battle' }">{{ eyebrow }}</span>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </header>

    <div class="page-frame__body">
      <slot />
    </div>
  </section>
</template>
