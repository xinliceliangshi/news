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
import { getPersonaConfig, getPersonaThemeStyle, type MbtiType } from '../constants/personas'
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
    variant="battle"
    eyebrow="实时战局"
    title="阵营对抗"
    description="先选议题、再选人格、最后站队下注。投票后实时查看红蓝战局、少数派压力与对面火力。"
  >
    <div v-if="isLoading" class="vote-state">正在加载今日议题…</div>

    <div v-else-if="loadError" class="vote-state vote-state--error">
      <p>{{ loadError }}</p>
      <el-button type="primary" round @click="loadTopics">重新加载</el-button>
    </div>

    <div v-else-if="topics.length === 0" class="vote-state">暂无已发布议题，请稍后再来。</div>

    <div v-else class="vote-arena">
      <aside class="vote-topic-rail">
        <header class="vote-topic-rail__header">
          <div>
            <span class="vote-topic-rail__eyebrow">今日议题</span>
            <strong>选择战场</strong>
          </div>
          <span class="vote-topic-rail__count">{{ topics.length }}</span>
        </header>

        <div class="vote-topic-rail__list">
          <button
            v-for="topic in topics"
            :key="topic.id"
            type="button"
            class="vote-topic-chip"
            :class="{ 'vote-topic-chip--active': topic.id === selectedTopicId }"
            @click="selectTopic(topic.id)"
          >
            <span class="vote-topic-chip__mood">
              {{ getTopicMoodMeta(resolveTopicMood(topic.tags, topic.id)).label }}
            </span>
            <strong>{{ topic.title }}</strong>
            <p>
              <span>热度 {{ topic.hotScore }}</span>
              <span>{{ new Intl.NumberFormat('zh-CN').format(topic.voteCount) }} 票</span>
            </p>
          </button>
        </div>
      </aside>

      <article v-if="activeTopic" class="vote-stage">
        <div class="vote-stage__rim" aria-hidden="true" />
        <div class="vote-stage__glow vote-stage__glow--red" aria-hidden="true" />
        <div class="vote-stage__glow vote-stage__glow--blue" aria-hidden="true" />

        <TopicBanner
          :tags="activeTopic.tags"
          :topic-id="activeTopic.id"
          :hot-score="activeTopic.hotScore"
        />

        <DebateCardHeader :title="activeTopic.title" :has-voted="hasVoted" />

        <p class="vote-stage__description">{{ activeTopic.description }}</p>

        <div v-if="activeTopic.tags.length" class="vote-stage__tags">
          <span v-for="tag in activeTopic.tags" :key="tag">#{{ tag }}</span>
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

        <div v-else-if="isTopicLoading" class="vote-stage__loading">
          <span class="vote-stage__loading-dot" />
          正在同步战局数据…
        </div>

        <template v-if="!hasVoted">
          <div class="vote-flow">
            <section class="vote-flow__step">
              <header class="vote-flow__step-head">
                <span class="vote-flow__step-num">01</span>
                <div>
                  <strong>选择人格</strong>
                  <p>站队前锁定 MBTI，投票后生成专属锐评</p>
                </div>
              </header>
              <MbtiSelector v-model="selectedMbti" />
            </section>

            <section class="vote-flow__step">
              <header class="vote-flow__step-head">
                <span class="vote-flow__step-num">02</span>
                <div>
                  <strong>预选阵营</strong>
                  <p>点击红方或蓝方卡片，再确认入场</p>
                </div>
              </header>
              <StancePanel
                :support-label="activeTopic.sideA.label"
                :oppose-label="activeTopic.sideB.label"
                :selected-side="previewSide"
                interactive
                @select="selectPreviewSide"
              />
            </section>

            <section class="vote-flow__step vote-flow__step--action">
              <header class="vote-flow__step-head">
                <span class="vote-flow__step-num">03</span>
                <div>
                  <strong>确认站队</strong>
                  <p>{{ voteHint }}</p>
                </div>
              </header>

              <div class="vote-confirm-bar">
                <div class="vote-confirm-bar__stat">
                  <span>当前参战人数</span>
                  <strong>{{ formattedVoteCount }}</strong>
                </div>
                <VoteActions
                  :disabled="isVoting || isTopicLoading || !canVote || !hasPreviewSide"
                  :selected-side="previewSide"
                  :support-text="supportButtonText"
                  :oppose-text="opposeButtonText"
                  @vote="handleVote"
                />
              </div>

              <p v-if="!canVote || !hasPreviewSide" class="vote-stage__hint">
                {{ !canVote ? '选好 MBTI 后才能加入红方或蓝方。' : '先点选阵营卡片，再用按钮完成站队。' }}
              </p>

              <section
                v-if="selectedPersona"
                class="vote-stage__persona"
                :style="getPersonaThemeStyle(selectedPersona.mbti)"
              >
                <div
                  class="vote-stage__persona-glow"
                  :style="getPersonaThemeStyle(selectedPersona.mbti)"
                />
                <strong>{{ selectedPersona.mbti }} · {{ selectedPersona.label }}</strong>
                <p>{{ selectedPersona.summary }}</p>
              </section>
            </section>
          </div>
        </template>

        <template v-else>
          <div class="vote-result">
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

          <section
            v-if="selectedMbti"
            class="vote-stage__persona vote-stage__persona--compact"
            :style="getPersonaThemeStyle(selectedMbti)"
          >
            你的人格：<strong>{{ selectedMbti }} · {{ getPersonaConfig(selectedMbti).label }}</strong>
          </section>

          <section class="vote-result-actions">
            <el-button class="vote-cta vote-cta--primary" size="large" round @click="goToPersonaRoast">
              🧠 查看人格锐评
            </el-button>
            <el-button class="vote-cta vote-cta--ghost" size="large" round @click="goToOpinions">
              😤 看对面怎么骂的
            </el-button>
            <el-button class="vote-cta vote-cta--plain" size="large" round plain @click="resetVote">
              换一个议题继续站队
            </el-button>
          </section>
          </div>
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

.vote-arena {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.vote-topic-rail {
  position: sticky;
  top: 12px;
  display: grid;
  gap: 14px;
  padding: 18px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    rgba(8, 12, 22, 0.42);
}

.vote-topic-rail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.vote-topic-rail__eyebrow {
  display: block;
  color: rgba(199, 216, 255, 0.68);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.vote-topic-rail__header strong {
  display: block;
  margin-top: 4px;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}

.vote-topic-rail__count {
  display: grid;
  place-items: center;
  min-width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 109, 69, 0.22), rgba(90, 140, 255, 0.22));
  color: #fff4e5;
  font-size: 0.95rem;
  font-weight: 800;
}

.vote-topic-rail__list {
  display: grid;
  gap: 10px;
  max-height: min(68vh, 640px);
  overflow: auto;
  padding-right: 2px;
  scrollbar-width: thin;
}

.vote-topic-chip {
  position: relative;
  display: grid;
  gap: 6px;
  padding: 14px 14px 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.vote-topic-chip::before {
  content: '';
  position: absolute;
  top: 12px;
  bottom: 12px;
  left: 0;
  width: 3px;
  border-radius: 0 4px 4px 0;
  background: transparent;
  transition: background 0.2s ease;
}

.vote-topic-chip__mood,
.vote-topic-chip strong,
.vote-topic-chip p {
  display: block;
}

.vote-topic-chip__mood {
  color: rgba(199, 216, 255, 0.72);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.vote-topic-chip strong {
  font-size: 0.94rem;
  line-height: 1.38;
}

.vote-topic-chip p {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  color: rgba(247, 241, 232, 0.55);
  font-size: 0.8rem;
}

.vote-topic-chip:hover {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-1px);
}

.vote-topic-chip--active {
  border-color: rgba(255, 138, 93, 0.38);
  background:
    linear-gradient(135deg, rgba(255, 109, 69, 0.12), rgba(90, 140, 255, 0.06)),
    rgba(255, 255, 255, 0.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.vote-topic-chip--active::before {
  background: linear-gradient(180deg, #ff6d45, #5a8cff);
}

.vote-stage {
  position: relative;
  display: grid;
  gap: 20px;
  padding: 22px 22px 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background:
    linear-gradient(165deg, rgba(255, 109, 69, 0.06) 0%, transparent 28%),
    linear-gradient(195deg, rgba(90, 140, 255, 0.08) 0%, transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.vote-stage__rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 109, 69, 0.35),
    rgba(255, 255, 255, 0.06) 42%,
    rgba(90, 140, 255, 0.35)
  );
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.vote-stage__glow {
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(2px);
}

.vote-stage__glow--red {
  top: -100px;
  right: -60px;
  background: radial-gradient(circle, rgba(255, 109, 69, 0.16), transparent 68%);
}

.vote-stage__glow--blue {
  bottom: -120px;
  left: -40px;
  background: radial-gradient(circle, rgba(90, 140, 255, 0.14), transparent 70%);
}

.vote-stage > :not([aria-hidden='true']) {
  position: relative;
  z-index: 1;
}

.vote-stage__description {
  margin: -4px 0 0;
  max-width: 52rem;
  color: rgba(247, 241, 232, 0.74);
  font-size: 0.95rem;
  line-height: 1.55;
}

.vote-stage__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: -6px;
}

.vote-stage__tags span {
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(199, 216, 255, 0.82);
  font-size: 12px;
  font-weight: 600;
}

.vote-stage__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(247, 241, 232, 0.68);
  font-size: 0.9rem;
}

.vote-stage__loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ff9a6d;
  animation: vote-pulse 1s ease-in-out infinite;
}

@keyframes vote-pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.85);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.vote-flow {
  display: grid;
  gap: 16px;
}

.vote-flow__step {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  background: rgba(8, 12, 22, 0.28);
}

.vote-flow__step--action {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02)),
    rgba(8, 12, 22, 0.32);
}

.vote-flow__step-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.vote-flow__step-num {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 109, 69, 0.2), rgba(90, 140, 255, 0.2));
  color: #fff4e5;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.vote-flow__step-head strong {
  display: block;
  font-size: 0.98rem;
}

.vote-flow__step-head p {
  margin: 4px 0 0;
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.84rem;
}

.vote-confirm-bar {
  display: grid;
  gap: 14px;
}

.vote-confirm-bar__stat {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
}

.vote-confirm-bar__stat span {
  color: rgba(199, 216, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.vote-confirm-bar__stat strong {
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  background: linear-gradient(90deg, #ffbc9c, #c7d8ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.vote-stage__hint {
  margin: -4px 0 0;
  color: rgba(255, 196, 164, 0.88);
  font-size: 0.84rem;
  text-align: center;
}

.vote-stage__persona {
  position: relative;
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  overflow: hidden;
  border: 1px solid var(--persona-border, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
  background:
    linear-gradient(135deg, var(--persona-soft, rgba(255, 255, 255, 0.06)), rgba(255, 255, 255, 0.03)),
    rgba(255, 255, 255, 0.03);
}

.vote-stage__persona-glow {
  position: absolute;
  top: -32px;
  right: -20px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: radial-gradient(circle, var(--persona-glow, rgba(255, 255, 255, 0.16)), transparent 68%);
  pointer-events: none;
}

.vote-stage__persona strong {
  color: var(--persona-text, #fff4e5);
  font-size: 0.94rem;
}

.vote-stage__persona p {
  margin: 0;
  color: rgba(247, 241, 232, 0.64);
  font-size: 0.84rem;
}

.vote-stage__persona--compact {
  color: rgba(247, 241, 232, 0.72);
  font-size: 0.9rem;
}

.vote-result {
  display: grid;
  gap: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  background: rgba(8, 12, 22, 0.24);
}

.vote-result-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.vote-result-actions .vote-cta--plain {
  grid-column: 1 / -1;
}

.vote-cta {
  border: 0;
  font-weight: 700;
}

.vote-cta--primary {
  background: linear-gradient(135deg, rgba(255, 109, 69, 0.95), rgba(255, 154, 109, 0.95));
  color: #fff7ee;
}

.vote-cta--ghost {
  background: rgba(90, 140, 255, 0.18);
  border: 1px solid rgba(123, 174, 255, 0.32);
  color: #e8f0ff;
}

.vote-cta--plain {
  justify-self: stretch;
  color: rgba(247, 241, 232, 0.78);
}

@media (max-width: 960px) {
  .vote-arena {
    grid-template-columns: 1fr;
  }

  .vote-topic-rail {
    position: static;
  }

  .vote-topic-rail__list {
    max-height: none;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 640px) {
  .vote-stage {
    padding: 18px 16px 20px;
  }

  .vote-topic-rail__list {
    grid-template-columns: 1fr;
  }

  .vote-result-actions {
    grid-template-columns: 1fr;
  }

  .vote-confirm-bar__stat {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
