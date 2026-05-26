<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import PageFrame from '../components/common/PageFrame.vue'
import { runCozeWorkflow } from '../api/coze'
import { HttpError } from '../api/client'
import { useVoteSession } from '../composables/useVoteSession'
import { getPersonaConfig } from '../constants/personas'
import { extractCozeOutput } from '../utils/cozeOutput'

const router = useRouter()
const { voteSession, patchCozeOutput, patchCozeStatus } = useVoteSession()

const isRetrying = ref(false)

const hasSession = computed(() => voteSession.value !== null)

const roastText = computed(() => {
  const output = voteSession.value?.cozeOutput

  if (!output) {
    return ''
  }

  return extractCozeOutput(output)
})

const cozeStatus = computed(() => voteSession.value?.cozeStatus ?? (roastText.value ? 'done' : 'idle'))

const isGenerating = computed(
  () => hasSession.value && (cozeStatus.value === 'pending' || isRetrying.value)
)

const hasFailed = computed(() => hasSession.value && cozeStatus.value === 'error' && !isRetrying.value)
const personaConfig = computed(() =>
  voteSession.value?.mbti ? getPersonaConfig(voteSession.value.mbti) : null
)

function goToVote() {
  void router.push({ name: 'vote' })
}

async function retryGenerate() {
  const session = voteSession.value

  if (!session || isRetrying.value) {
    return
  }

  isRetrying.value = true
  patchCozeStatus('pending')

  try {
    const result = await runCozeWorkflow({
      topic: session.topicTitle,
      side: session.sideLabel,
      mbti: session.mbti
    })

    patchCozeOutput(result.data)
  } catch (error: unknown) {
    patchCozeStatus('error')
    const message = error instanceof HttpError ? error.message : '锐评生成失败，请稍后重试'
    ElMessage.warning(message)
  } finally {
    isRetrying.value = false
  }
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
        <strong>{{ voteSession?.mbti }} · {{ personaConfig?.label }} · {{ voteSession?.sideLabel }}</strong>
        <p>{{ personaConfig?.summary }}</p>
        <p>议题：{{ voteSession?.topicTitle }}</p>
      </article>

      <article class="placeholder-card">
        <span>锐评文案</span>
        <strong v-if="isGenerating">正在生成，请稍候…</strong>
        <template v-else-if="hasFailed">
          <strong>生成失败</strong>
          <p>Coze 工作流暂时不可用，你可以稍后重试。</p>
          <el-button type="primary" round :loading="isRetrying" @click="retryGenerate">
            重新生成
          </el-button>
        </template>
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
