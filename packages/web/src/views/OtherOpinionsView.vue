<script setup lang="ts">
import PageFrame from '../components/common/PageFrame.vue'
</script>

<template>
  <PageFrame
    title="查看其他观点页"
    description="这里用来承接不同阵营的高赞观点、反驳摘录、观点流和情绪标签。"
  >
    <div class="placeholder-stack">
      <article class="placeholder-card">
        <span>对面阵营</span>
        <strong>高赞反驳观点</strong>
        <p>后续可以展示不同观点流、引用卡片和热评排序。</p>
      </article>

      <article class="placeholder-card">
        <span>中立视角</span>
        <strong>补充论据与事实背景</strong>
        <p>后续可以承接人工编辑摘要或 AI 整理结果。</p>
      </article>
    </div>
  </PageFrame>
</template>
