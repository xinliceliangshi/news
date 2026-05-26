<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import PageFrame from '../components/common/PageFrame.vue'
import CampBattleMeter from '../components/controversy/CampBattleMeter.vue'
import CommentPanel from '../components/controversy/CommentPanel.vue'
import DebateCardHeader from '../components/controversy/DebateCardHeader.vue'
import TopicBanner from '../components/controversy/TopicBanner.vue'
import { getTopicMoodMeta, resolveTopicMood } from '../constants/topicMoods'
import OutcomeBox from '../components/controversy/OutcomeBox.vue'
import ResultPanel from '../components/controversy/ResultPanel.vue'
import StancePanel from '../components/controversy/StancePanel.vue'
import MbtiSelector from '../components/controversy/MbtiSelector.vue'
import VoteActions from '../components/controversy/VoteActions.vue'
import { runCozeWorkflow } from '../api/coze'
import { fetchTopicById, fetchTopics, voteOnTopic } from '../api/topic'
import { useVoteSession } from '../composables/useVoteSession'
import { getPersonaConfig, type MbtiType } from '../constants/personas'
import { HttpError } from '../api/client'
import { buildOpposingCampComments } from '../utils/campComments'
import type { VoteSide } from '../types/controversy'
import type { Topic, TopicSideKey, TopicSideStats } from '../types/topic'

const router = useRouter()
const { setVoteSession, patchCozeOutput, patchCozeStatus } = useVoteSession()

const topics = ref<Topic[]>([])
const selectedTopicId = ref<number | null>(null)
const selectedSide = ref<VoteSide | null>(null)
const previewSide = ref<VoteSide | null>(null)
const selectedMbti = ref<MbtiType | null>(null)
const sideStats = ref<TopicSideStats | null>(null)
const isLoading = ref(true)
const isTopicLoading = ref(false)
const isVoting = ref(false)
const loadError = ref('')

const activeTopic = computed(() => {
  if (!selectedTopicId.value) {
    return null
  }

  return topics.value.find((topic) => topic.id === selectedTopicId.value) ?? null
})

const hasVoted = computed(() => selectedSide.value !== null)
const canVote = computed(() => selectedMbti.value !== null)
const hasPreviewSide = computed(() => previewSide.value !== null)

const supportRate = computed(() => sideStats.value?.sideA.percent ?? 50)
const opposeRate = computed(() => sideStats.value?.sideB.percent ?? 50)

const isMinority = computed(() => {
  if (!selectedSide.value || !sideStats.value) {
    return false
  }

  const userIsSupport = selectedSide.value === 'support'
  const supportWins = sideStats.value.sideA.percent >= sideStats.value.sideB.percent

  return userIsSupport ? !supportWins : supportWins
})

const majorityLabel = computed(() => {
  if (!activeTopic.value || !sideStats.value) {
    return ''
  }

  return sideStats.value.sideA.percent >= sideStats.value.sideB.percent
    ? activeTopic.value.sideA.label
    : activeTopic.value.sideB.label
})

const userCampLabel = computed(() => {
  if (!activeTopic.value || !selectedSide.value) {
    return ''
  }

  return selectedSide.value === 'support'
    ? activeTopic.value.sideA.label
    : activeTopic.value.sideB.label
})

const opposingCamp = computed(() => {
  if (!activeTopic.value || !selectedSide.value) {
    return { campLabel: '', comments: [] as string[] }
  }

  return buildOpposingCampComments(activeTopic.value, selectedSide.value)
})

const formattedVoteCount = computed(() => {
  if (!activeTopic.value) {
    return '—'
  }

  return new Intl.NumberFormat('zh-CN').format(activeTopic.value.voteCount)
})

const selectedPersona = computed(() =>
  selectedMbti.value ? getPersonaConfig(selectedMbti.value) : null
)

const voteHint = computed(() => {
  if (!selectedMbti.value) {
    return '先选 MBTI，再锁定你准备下注的阵营。'
  }

  if (!previewSide.value) {
    return '先点一下红方或蓝方卡片，按钮会切到更明确的入场动作。'
  }

  return previewSide.value === 'support'
    ? '已锁定红方预选，点击主按钮后会立即计票并刷新战局。'
    : '已锁定蓝方预选，准备逆风上票，点击主按钮立即入场。'
})

const supportButtonText = computed(() =>
  previewSide.value === 'support' ? '确认加入红方' : '🔴 加入红方'
)

const opposeButtonText = computed(() =>
  previewSide.value === 'oppose' ? '确认加入蓝方' : '🔵 加入蓝方'
)

const iqLeft = computed(() => {
  if (!isMinority.value) {
    return 95
  }

  const gap = Math.abs(supportRate.value - opposeRate.value)
  return Math.max(42, 95 - Math.round(gap / 2))
})

function mapVoteSideToTopicSide(side: VoteSide): TopicSideKey {
  return side === 'support' ? 'A' : 'B'
}

function mapTopicSideToVoteSide(side: TopicSideKey): VoteSide {
  return side === 'A' ? 'support' : 'oppose'
}

function replaceTopic(updated: Topic) {
  const index = topics.value.findIndex((topic) => topic.id === updated.id)

  if (index >= 0) {
    topics.value[index] = updated
  }
}

async function loadTopicDetail(id: number) {
  isTopicLoading.value = true

  try {
    const result = await fetchTopicById(id)
    replaceTopic(result.data)
    sideStats.value = result.data.sideStats ?? null
  } catch {
    sideStats.value = null
  } finally {
    isTopicLoading.value = false
  }
}

async function loadTopics() {
  isLoading.value = true
  loadError.value = ''

  try {
    const result = await fetchTopics({ limit: 12 })
    topics.value = result.data

    if (!selectedTopicId.value && result.data.length > 0) {
      selectedTopicId.value = result.data[0].id
    }
  } catch (error: unknown) {
    loadError.value = error instanceof HttpError ? error.message : '议题加载失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

function resolveSideLabel(side: VoteSide) {
  if (!activeTopic.value) {
    return ''
  }

  return side === 'support' ? activeTopic.value.sideA.label : activeTopic.value.sideB.label
}

async function triggerCozeWorkflow(side: VoteSide) {
  if (!activeTopic.value || !selectedMbti.value) {
    return
  }

  const sideLabel = resolveSideLabel(side)

  setVoteSession({
    topicId: activeTopic.value.id,
    topicTitle: activeTopic.value.title,
    side,
    sideLabel,
    mbti: selectedMbti.value,
    cozeStatus: 'pending'
  })

  try {
    const result = await runCozeWorkflow({
      topic: activeTopic.value.title,
      side: sideLabel,
      mbti: selectedMbti.value
    })

    patchCozeOutput(result.data)
  } catch (error: unknown) {
    patchCozeStatus('error')
    const message = error instanceof HttpError ? error.message : '锐评生成失败，可稍后在锐评页重试'
    ElMessage.warning(message)
  }
}

async function handleVote(side: VoteSide) {
  if (!activeTopic.value || isVoting.value) {
    return
  }

  if (!selectedMbti.value) {
    ElMessage.warning('请先选择你的 MBTI')
    return
  }

  isVoting.value = true

  try {
    const result = await voteOnTopic(activeTopic.value.id, {
      side: mapVoteSideToTopicSide(side)
    })

    replaceTopic(result.data.topic)
    sideStats.value = result.data.sideStats
    selectedSide.value = mapTopicSideToVoteSide(result.data.side)
    previewSide.value = selectedSide.value
    ElMessage.success(result.message)
    void triggerCozeWorkflow(side)
  } catch (error: unknown) {
    ElMessage.error(error instanceof HttpError ? error.message : '投票失败，请稍后重试')
  } finally {
    isVoting.value = false
  }
}

function resetVote() {
  selectedSide.value = null
  previewSide.value = null
}

function selectTopic(id: number) {
  selectedTopicId.value = id
}

function selectPreviewSide(side: VoteSide) {
  previewSide.value = side
}

function goToPersonaRoast() {
  void router.push({ name: 'personaRoast' })
}

function goToOpinions() {
  void router.push({ name: 'otherOpinions' })
}

watch(selectedTopicId, (topicId) => {
  selectedSide.value = null
  previewSide.value = null

  if (topicId) {
    void loadTopicDetail(topicId)
  }
})

onMounted(() => {
  void loadTopics()
})
</script>

<template>
  <PageFrame
    title="阵营对抗"
    description="先选议题、再站队下注。投票后实时查看红蓝双方战局、少数派压力和对面高赞火力。"
  >
    <div v-if="isLoading" class="vote-state">正在加载今日议题…</div>

    <div v-else-if="loadError" class="vote-state vote-state--error">
      <p>{{ loadError }}</p>
      <el-button type="primary" round @click="loadTopics">重新加载</el-button>
    </div>

    <div v-else-if="topics.length === 0" class="vote-state">暂无已发布议题，请稍后再来。</div>

    <div v-else class="vote-layout">
      <aside class="vote-topic-list">
        <header class="vote-topic-list__header">
          <span>今日议题</span>
          <strong>{{ topics.length }} 条</strong>
        </header>

        <button
          v-for="topic in topics"
          :key="topic.id"
          type="button"
          class="vote-topic-item"
          :class="{ 'vote-topic-item--active': topic.id === selectedTopicId }"
          @click="selectTopic(topic.id)"
        >
          <span>{{ getTopicMoodMeta(resolveTopicMood(topic.tags, topic.id)).label }}</span>
          <strong>{{ topic.title }}</strong>
          <p>热度 {{ topic.hotScore }} · {{ new Intl.NumberFormat('zh-CN').format(topic.voteCount) }} 票</p>
        </button>
      </aside>

      <article v-if="activeTopic" class="vote-card">
        <div class="vote-card__glow" aria-hidden="true" />

        <TopicBanner
          :tags="activeTopic.tags"
          :topic-id="activeTopic.id"
          :hot-score="activeTopic.hotScore"
        />

        <DebateCardHeader
          :title="activeTopic.title"
          :has-voted="hasVoted"
          :hot-score="activeTopic.hotScore"
        />

        <p class="vote-card__description">{{ activeTopic.description }}</p>

        <div class="vote-card__tags">
          <span v-for="tag in activeTopic.tags" :key="tag">{{ tag }}</span>
        </div>

        <CampBattleMeter
          v-if="sideStats"
          :support-label="activeTopic.sideA.label"
          :oppose-label="activeTopic.sideB.label"
          :support-percent="supportRate"
          :oppose-percent="opposeRate"
          :support-count="sideStats.sideA.count"
          :oppose-count="sideStats.sideB.count"
          :highlight-side="hasVoted ? selectedSide : null"
          :compact="!hasVoted"
        />

        <div v-else-if="isTopicLoading" class="vote-card__loading">正在同步战局数据…</div>

        <template v-if="!hasVoted">
          <MbtiSelector v-model="selectedMbti" />

          <StancePanel
            :support-label="activeTopic.sideA.label"
            :oppose-label="activeTopic.sideB.label"
            :selected-side="previewSide"
            interactive
            @select="selectPreviewSide"
          />

          <section class="vote-strip">
            <div>
              <span>当前参战人数</span>
              <strong>{{ formattedVoteCount }}</strong>
            </div>
            <p>{{ voteHint }}</p>
          </section>

          <VoteActions
            :disabled="isVoting || isTopicLoading || !canVote || !hasPreviewSide"
            :selected-side="previewSide"
            :support-text="supportButtonText"
            :oppose-text="opposeButtonText"
            @vote="handleVote"
          />
          <p v-if="!canVote || !hasPreviewSide" class="vote-card__mbti-hint">
            {{ !canVote ? '选好 MBTI 后才能加入红方或蓝方。' : '先点选阵营卡片，再用按钮完成站队。' }}
          </p>
          <section v-if="selectedPersona" class="vote-card__persona-tip">
            <strong>{{ selectedPersona.mbti }} · {{ selectedPersona.label }}</strong>
            <p>{{ selectedPersona.summary }}</p>
          </section>
        </template>

        <template v-else>
          <ResultPanel
            :support-label="activeTopic.sideA.label"
            :oppose-label="activeTopic.sideB.label"
            :support-rate="supportRate"
            :oppose-rate="opposeRate"
            :user-side="selectedSide"
            reveal
          />

          <OutcomeBox
            :is-minority="isMinority"
            :iq-left="iqLeft"
            :user-label="userCampLabel"
            :majority-label="majorityLabel"
          />

          <CommentPanel :comments="opposingCamp.comments" :camp-label="opposingCamp.campLabel" />

          <section v-if="selectedMbti" class="vote-card__mbti-badge">
            你的人格：<strong>{{ selectedMbti }} · {{ getPersonaConfig(selectedMbti).label }}</strong>
          </section>

          <section class="vote-result-actions">
            <el-button class="watch-button" size="large" round @click="goToPersonaRoast">
              🧠 查看人格锐评
            </el-button>
            <el-button class="watch-button watch-button--secondary" size="large" round @click="goToOpinions">
              😤 看对面怎么骂的
            </el-button>
            <el-button class="vote-reset" size="large" round plain @click="resetVote">
              换一个议题继续站队
            </el-button>
          </section>
        </template>
      </article>
    </div>
  </PageFrame>
</template>

<style scoped>
.vote-state {
  padding: 28px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(247, 241, 232, 0.78);
  text-align: center;
}

.vote-state--error p {
  margin: 0 0 16px;
}

.vote-layout {
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
  gap: 18px;
}

.vote-topic-list {
  display: grid;
  gap: 12px;
  align-content: start;
}

.vote-topic-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  color: rgba(199, 216, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.vote-topic-list__header strong {
  color: #fff4e5;
  font-size: 0.95rem;
  letter-spacing: normal;
  text-transform: none;
}

.vote-topic-item {
  display: grid;
  gap: 6px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.vote-topic-item span,
.vote-topic-item strong,
.vote-topic-item p {
  display: block;
}

.vote-topic-item span {
  color: rgba(199, 216, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
}

.vote-topic-item strong {
  font-size: 0.98rem;
  line-height: 1.35;
}

.vote-topic-item p {
  margin: 0;
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.86rem;
}

.vote-topic-item--active,
.vote-topic-item:hover {
  border-color: rgba(255, 138, 93, 0.42);
  background: rgba(255, 110, 69, 0.1);
  transform: translateY(-1px);
}

.vote-card {
  position: relative;
  display: grid;
  gap: 18px;
  padding: 22px 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
    rgba(255, 255, 255, 0.02);
}

.vote-card__glow {
  position: absolute;
  top: -80px;
  right: -40px;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 138, 93, 0.18), transparent 68%);
  pointer-events: none;
}

.vote-card__description {
  margin: 0;
  color: rgba(247, 241, 232, 0.72);
}

.vote-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.vote-card__tags span {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(199, 216, 255, 0.88);
  font-size: 12px;
}

.vote-card__loading {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(247, 241, 232, 0.68);
  font-size: 0.9rem;
}

.vote-strip {
  display: grid;
  gap: 8px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.vote-strip span {
  color: rgba(199, 216, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.vote-strip strong {
  display: block;
  margin-top: 4px;
  font-size: 1.4rem;
}

.vote-strip p {
  margin: 0;
  color: rgba(247, 241, 232, 0.68);
  font-size: 0.86rem;
}

.vote-card__mbti-hint {
  margin: -6px 0 0;
  color: rgba(255, 196, 164, 0.88);
  font-size: 0.84rem;
  text-align: center;
}

.vote-card__persona-tip {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
}

.vote-card__persona-tip strong {
  color: #fff4e5;
  font-size: 0.94rem;
}

.vote-card__persona-tip p {
  margin: 0;
  color: rgba(247, 241, 232, 0.64);
  font-size: 0.84rem;
}

.vote-card__mbti-badge {
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(247, 241, 232, 0.72);
  font-size: 0.9rem;
}

.vote-card__mbti-badge strong {
  color: #fff4e5;
}

.vote-result-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.vote-result-actions .vote-reset {
  grid-column: 1 / -1;
}

.watch-button--secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #fff4e5;
}

.watch-button {
  border: 0;
  background: linear-gradient(135deg, rgba(255, 109, 69, 0.92), rgba(255, 154, 109, 0.92));
  color: #fff7ee;
  font-weight: 700;
}

.vote-reset {
  justify-self: stretch;
}

@media (max-width: 960px) {
  .vote-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .vote-result-actions {
    grid-template-columns: 1fr;
  }
}
</style>
