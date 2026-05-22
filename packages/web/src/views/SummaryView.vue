<script setup lang="ts">
import PageFrame from '../components/common/PageFrame.vue'
</script>

<template>
  <PageFrame
    title="总结页"
    description="这里用于收拢一次完整的争议消费流程，比如投票结果、个人立场、他人观点和最终结论。"
  >
    <div class="placeholder-grid">
      <article class="placeholder-card">
        <span>总结 A</span>
        <strong>你的站队路径</strong>
        <p>回顾用户进入、投票、看观点、生成锐评的完整轨迹。</p>
      </article>

      <article class="placeholder-card">
        <span>总结 B</span>
        <strong>争议最终摘要</strong>
        <p>后续可接 `/summary` 一类接口或本地聚合组件。</p>
      </article>
    </div>
  </PageFrame>
</template>
