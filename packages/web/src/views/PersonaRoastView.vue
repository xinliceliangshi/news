<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import PageFrame from '../components/common/PageFrame.vue'
import { useVoteSession } from '../composables/useVoteSession'

const router = useRouter()
const { voteSession } = useVoteSession()

const hasSession = computed(() => voteSession.value !== null)

const roastText = computed(() => {
  const output = voteSession.value?.cozeOutput

  if (!output) {
    return ''
  }

  if (typeof output === 'string') {
    return output
  }

  if (typeof output === 'object' && output !== null) {
    const record = output as Record<string, unknown>
    const data = record.data

    if (typeof data === 'string') {
      return data
    }

    if (typeof data === 'object' && data !== null) {
      const nested = data as Record<string, unknown>

      if (typeof nested.output === 'string') {
        return nested.output
      }
    }
  }

  return JSON.stringify(output, null, 2)
})

const isGenerating = computed(() => hasSession.value && !roastText.value)

function goToVote() {
  void router.push({ name: 'vote' })
}
</script>

<template>
  <PageFrame
    title="性格生成锐评页"
    description="根据你在投票页选择的 MBTI、议题和阵营，调用 Coze 工作流生成画像与调侃文案。"
  >
    <div v-if="!hasSession" class="placeholder-stack">
      <article class="placeholder-card">
        <span>还没有投票记录</span>
        <strong>先去投票页站队并选择 MBTI</strong>
        <p>完成投票后，这里会展示 Coze 工作流返回的锐评结果。</p>
        <el-button type="primary" round @click="goToVote">去投票页</el-button>
      </article>
    </div>

    <div v-else class="placeholder-stack">
      <article class="placeholder-card">
        <span>人格标签</span>
        <strong>{{ voteSession?.mbti }} · {{ voteSession?.sideLabel }}</strong>
        <p>议题：{{ voteSession?.topicTitle }}</p>
      </article>

      <article class="placeholder-card">
        <span>锐评文案</span>
        <strong v-if="isGenerating">正在生成，请稍候刷新…</strong>
        <p v-else class="roast-output">{{ roastText }}</p>
      </article>
    </div>
  </PageFrame>
</template>

<style scoped>
.roast-output {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
