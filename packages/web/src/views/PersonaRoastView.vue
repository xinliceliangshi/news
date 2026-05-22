<script setup lang="ts">
import PageFrame from '../components/common/PageFrame.vue'
</script>

<template>
  <PageFrame
    title="性格生成锐评页"
    description="这里可以承接投票结果后的画像生成、阵营调侃文案和更强情绪反馈。"
  >
    <div class="placeholder-stack">
      <article class="placeholder-card">
        <span>人格标签</span>
        <strong>少数派理性辩手</strong>
        <p>后续可根据投票记录和站队偏好生成用户画像。</p>
      </article>

      <article class="placeholder-card">
        <span>锐评文案</span>
        <strong>你的观点不一定讨喜，但很能激怒对面。</strong>
        <p>后续可接 AI 文案服务或规则模板。</p>
      </article>
    </div>
  </PageFrame>
</template>
