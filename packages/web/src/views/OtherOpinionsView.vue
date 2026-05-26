<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import PageFrame from '../components/common/PageFrame.vue'
import { runCozeWorkflow } from '../api/coze'
import { HttpError } from '../api/client'
import { fetchTopicById } from '../api/topic'
import {
  getPersonaConfig,
  getPersonaThemeStyle,
  getRecommendedPersonaTypes,
  MBTI_TYPES,
  type MbtiType
} from '../constants/personas'
import { useVoteSession } from '../composables/useVoteSession'
import type { VoteSide } from '../types/controversy'
import type { Topic } from '../types/topic'
import { extractCozeOutput } from '../utils/cozeOutput'

type ViewMode = 'same-side' | 'opposite-side'

type OpinionCard = {
  mbti: MbtiType
  sideLabel: string
  output: string
  status: 'pending' | 'done' | 'error'
}

const router = useRouter()
const { voteSession } = useVoteSession()

const viewMode = ref<ViewMode>('same-side')
const topic = ref<Topic | null>(null)
const topicError = ref('')
const isLoadingTopic = ref(false)
const isGenerating = ref(false)
const opinionCards = ref<OpinionCard[]>([])

const hasSession = computed(() => voteSession.value !== null)

const recommendedTypes = computed<MbtiType[]>(() => {
  const mbti = voteSession.value?.mbti

  if (!mbti) {
    return []
  }

  return getRecommendedPersonaTypes(mbti) ?? MBTI_TYPES.filter((type) => type !== mbti).slice(0, 3)
})

const sessionPersona = computed(() =>
  voteSession.value?.mbti ? getPersonaConfig(voteSession.value.mbti) : null
)

const activeSideLabel = computed(() => {
  if (!voteSession.value) {
    return ''
  }

  if (viewMode.value === 'same-side') {
    return voteSession.value.sideLabel
  }

  return resolveOppositeSideLabel(voteSession.value.side)
})

const pageDescription = computed(() => {
  if (!voteSession.value) {
    return '先完成投票和 MBTI 选择，再查看其他人格会如何看待同一议题。'
  }

  return viewMode.value === 'same-side'
    ? '复用现有 Coze 工作流，查看其他人格站在你这边时会怎么组织论据和表达立场。'
    : '复用现有 Coze 工作流，查看其他人格站到对面阵营后，会如何反驳你当前的立场。'
})

function resolveOppositeSideLabel(side: VoteSide) {
  if (!topic.value) {
    return ''
  }

  return side === 'support' ? topic.value.sideB.label : topic.value.sideA.label
}

function goToVote() {
  void router.push({ name: 'vote' })
}

async function loadTopic() {
  const session = voteSession.value

  if (!session) {
    return
  }

  isLoadingTopic.value = true
  topicError.value = ''

  try {
    const result = await fetchTopicById(session.topicId)
    topic.value = result.data
  } catch (error: unknown) {
    topic.value = null
    topicError.value = error instanceof HttpError ? error.message : '议题信息加载失败'
  } finally {
    isLoadingTopic.value = false
  }
}

async function generateOpinions() {
  const session = voteSession.value
  const sideLabel = activeSideLabel.value

  if (!session || !sideLabel || recommendedTypes.value.length === 0) {
    opinionCards.value = []
    return
  }

  isGenerating.value = true
  opinionCards.value = recommendedTypes.value.map((mbti) => ({
    mbti,
    sideLabel,
    output: '',
    status: 'pending'
  }))

  try {
    await Promise.all(
      recommendedTypes.value.map(async (mbti, index) => {
        try {
          const result = await runCozeWorkflow({
            topic: session.topicTitle,
            side: sideLabel,
            mbti
          })

          opinionCards.value[index] = {
            mbti,
            sideLabel,
            output: extractCozeOutput(result.data),
            status: 'done'
          }
        } catch (error: unknown) {
          opinionCards.value[index] = {
            mbti,
            sideLabel,
            output: error instanceof HttpError ? error.message : '观点生成失败，请稍后重试',
            status: 'error'
          }
        }
      })
    )
  } finally {
    isGenerating.value = false
  }
}

async function refreshOpinions() {
  if (!voteSession.value) {
    opinionCards.value = []
    return
  }

  if (!topic.value && !isLoadingTopic.value) {
    await loadTopic()
  }

  if (viewMode.value === 'opposite-side' && !activeSideLabel.value) {
    ElMessage.warning('当前议题还没加载完成，暂时无法生成对立阵营观点')
    return
  }

  await generateOpinions()
}

watch(viewMode, () => {
  if (voteSession.value) {
    void refreshOpinions()
  }
})

watch(
  () => voteSession.value?.topicId,
  () => {
    topic.value = null
    if (voteSession.value) {
      void refreshOpinions()
    } else {
      opinionCards.value = []
    }
  }
)

onMounted(() => {
  if (voteSession.value) {
    void refreshOpinions()
  }
})
</script>

<template>
  <PageFrame title="查看其他观点页" :description="pageDescription">
    <div v-if="!hasSession" class="opinions-empty">
      <article class="opinions-panel">
        <span class="opinions-eyebrow">还没有投票记录</span>
        <strong>先去投票并选择 MBTI</strong>
        <p>完成站队后，这里会帮你生成其他人格对同一议题的不同表达方式。</p>
        <el-button type="primary" round @click="goToVote">去投票页</el-button>
      </article>
    </div>

    <div v-else class="opinions-layout">
      <section class="opinions-panel opinions-panel--hero">
        <div>
          <span
            class="opinions-eyebrow"
            :style="voteSession?.mbti ? getPersonaThemeStyle(voteSession.mbti) : undefined"
          >
            当前上下文
          </span>
          <h3>{{ voteSession?.topicTitle }}</h3>
          <p>
            我的人格：{{ voteSession?.mbti }} · {{ sessionPersona?.label }} ｜ 我的立场：{{ voteSession?.sideLabel }}
          </p>
        </div>

        <div class="opinions-toggle" role="tablist" aria-label="观点模式切换">
          <button
            type="button"
            class="opinions-toggle__item"
            :class="{ 'is-active': viewMode === 'same-side' }"
            @click="viewMode = 'same-side'"
          >
            同阵营人格
          </button>
          <button
            type="button"
            class="opinions-toggle__item"
            :class="{ 'is-active': viewMode === 'opposite-side' }"
            @click="viewMode = 'opposite-side'"
          >
            对立阵营人格
          </button>
        </div>
      </section>

      <section class="opinions-panel opinions-panel--meta">
        <div>
          <span class="opinions-eyebrow">推荐人格</span>
          <div class="opinions-chip-list">
            <span
              v-for="mbti in recommendedTypes"
              :key="mbti"
              class="opinions-chip"
              :style="getPersonaThemeStyle(mbti)"
            >
              {{ mbti }} · {{ getPersonaConfig(mbti).label }}
            </span>
          </div>
        </div>

        <div class="opinions-meta__actions">
          <p v-if="topicError" class="opinions-error">{{ topicError }}</p>
          <p v-else>当前生成阵营：{{ activeSideLabel || '加载中…' }}</p>
          <el-button round :loading="isGenerating" @click="refreshOpinions">重新生成</el-button>
        </div>
      </section>

      <section class="opinions-grid">
        <article
          v-for="card in opinionCards"
          :key="`${viewMode}-${card.mbti}`"
          class="opinions-card"
          :style="getPersonaThemeStyle(card.mbti)"
        >
          <header class="opinions-card__header">
            <div>
              <span class="opinions-eyebrow">{{ card.mbti }}</span>
              <strong>{{ getPersonaConfig(card.mbti).label }} · {{ card.sideLabel }}</strong>
            </div>
            <span class="opinions-status" :class="`opinions-status--${card.status}`">
              {{
                card.status === 'pending'
                  ? '生成中'
                  : card.status === 'done'
                    ? '已生成'
                    : '失败'
              }}
            </span>
          </header>

          <p v-if="card.status === 'pending'" class="opinions-card__placeholder">
            正在整理这个人格的表达方式和论据重点…
          </p>
          <p v-else class="opinions-card__content">{{ card.output }}</p>
        </article>
      </section>
    </div>
  </PageFrame>
</template>

<style scoped>
.opinions-empty,
.opinions-layout {
  display: grid;
  gap: 18px;
}

.opinions-layout {
  grid-template-columns: 1fr;
}

.opinions-panel,
.opinions-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(18px);
}

.opinions-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
}

.opinions-panel--hero {
  align-items: flex-start;
}

.opinions-panel--hero h3 {
  margin: 10px 0 8px;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  letter-spacing: -0.04em;
}

.opinions-panel--hero p,
.opinions-panel--meta p {
  margin: 0;
  color: rgba(247, 241, 232, 0.7);
}

.opinions-eyebrow {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  background: var(--persona-soft, rgba(255, 110, 69, 0.12));
  color: var(--persona-text, #ffbc9c);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.opinions-toggle {
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: min(100%, 360px);
  padding: 8px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.05);
}

.opinions-toggle__item {
  padding: 12px 16px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: rgba(247, 241, 232, 0.72);
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.opinions-toggle__item.is-active {
  background: linear-gradient(135deg, rgba(255, 109, 69, 0.2), rgba(90, 140, 255, 0.2));
  color: #fff8f0;
}

.opinions-toggle__item:hover {
  transform: translateY(-1px);
}

.opinions-panel--meta {
  flex-wrap: wrap;
}

.opinions-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.opinions-chip {
  display: inline-flex;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid var(--persona-border, rgba(255, 255, 255, 0.08));
  border-radius: 999px;
  background:
    linear-gradient(135deg, var(--persona-soft, rgba(255, 255, 255, 0.06)), rgba(255, 255, 255, 0.04)),
    rgba(255, 255, 255, 0.04);
  color: var(--persona-text, #f7f1e8);
  font-weight: 700;
}

.opinions-meta__actions {
  display: grid;
  justify-items: end;
  gap: 10px;
}

.opinions-error {
  color: #ffb7b7;
}

.opinions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.opinions-card {
  display: grid;
  gap: 18px;
  padding: 22px;
  border-color: var(--persona-border, rgba(255, 255, 255, 0.08));
  background:
    radial-gradient(circle at 88% 16%, var(--persona-glow, rgba(255, 255, 255, 0.14)), transparent 24%),
    linear-gradient(180deg, var(--persona-soft, rgba(255, 255, 255, 0.06)), rgba(255, 255, 255, 0.03));
}

.opinions-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.opinions-card__header strong {
  display: block;
  margin-top: 10px;
  font-size: 1.05rem;
}

.opinions-status {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.opinions-status--pending {
  background: rgba(255, 206, 112, 0.14);
  color: #ffd794;
}

.opinions-status--done {
  background: rgba(116, 214, 159, 0.14);
  color: #b2f0c7;
}

.opinions-status--error {
  background: rgba(255, 115, 115, 0.14);
  color: #ffb7b7;
}

.opinions-card__placeholder,
.opinions-card__content {
  margin: 0;
  color: rgba(247, 241, 232, 0.84);
  white-space: pre-wrap;
  word-break: break-word;
}

.opinions-card__placeholder {
  color: rgba(247, 241, 232, 0.56);
}

@media (max-width: 900px) {
  .opinions-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .opinions-meta__actions {
    width: 100%;
    justify-items: start;
  }

  .opinions-toggle {
    width: 100%;
  }
}
</style>
