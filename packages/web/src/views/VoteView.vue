<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import PageFrame from '../components/common/PageFrame.vue'
import DebateCardHeader from '../components/controversy/DebateCardHeader.vue'
import StancePanel from '../components/controversy/StancePanel.vue'
import VoteActions from '../components/controversy/VoteActions.vue'
import { fetchTopics, voteOnTopic } from '../api/topic'
import { HttpError } from '../api/client'
import type { VoteSide } from '../types/controversy'
import type { Topic, TopicSideKey } from '../types/topic'

const topics = ref<Topic[]>([])
const selectedTopicId = ref<number | null>(null)
const selectedSide = ref<VoteSide | null>(null)
const isLoading = ref(true)
const isVoting = ref(false)
const loadError = ref('')

const activeTopic = computed(() => {
  if (!selectedTopicId.value) {
    return null
  }

  return topics.value.find((topic) => topic.id === selectedTopicId.value) ?? null
})

const hasVoted = computed(() => selectedSide.value !== null)

const formattedVoteCount = computed(() => {
  if (!activeTopic.value) {
    return '—'
  }

  return new Intl.NumberFormat('zh-CN').format(activeTopic.value.voteCount)
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

async function handleVote(side: VoteSide) {
  if (!activeTopic.value || isVoting.value) {
    return
  }

  isVoting.value = true

  try {
    const result = await voteOnTopic(activeTopic.value.id, {
      side: mapVoteSideToTopicSide(side)
    })

    replaceTopic(result.data.topic)
    selectedSide.value = mapTopicSideToVoteSide(result.data.side)
    ElMessage.success(result.message)
  } catch (error: unknown) {
    ElMessage.error(error instanceof HttpError ? error.message : '投票失败，请稍后重试')
  } finally {
    isVoting.value = false
  }
}

function resetVote() {
  selectedSide.value = null
}

function selectTopic(id: number) {
  selectedTopicId.value = id
}

watch(selectedTopicId, () => {
  selectedSide.value = null
})

onMounted(() => {
  void loadTopics()
})
</script>

<template>
  <PageFrame
    title="投票页"
    description="从后端拉取已发布议题，完成站队投票并实时更新票数。"
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
          <span>{{ topic.tags[0] ?? '争议' }}</span>
          <strong>{{ topic.title }}</strong>
          <p>热度 {{ topic.hotScore }} · {{ new Intl.NumberFormat('zh-CN').format(topic.voteCount) }} 票</p>
        </button>
      </aside>

      <article v-if="activeTopic" class="vote-card">
        <DebateCardHeader :title="activeTopic.title" :has-voted="hasVoted" />

        <p class="vote-card__description">{{ activeTopic.description }}</p>

        <div class="vote-card__tags">
          <span v-for="tag in activeTopic.tags" :key="tag">{{ tag }}</span>
        </div>

        <template v-if="!hasVoted">
          <StancePanel
            :support-label="activeTopic.sideA.label"
            :oppose-label="activeTopic.sideB.label"
          />

          <section class="vote-strip">
            <span>当前投票人数</span>
            <strong>{{ formattedVoteCount }}</strong>
          </section>

          <VoteActions @vote="handleVote" />
        </template>

        <template v-else>
          <section class="vote-result">
            <span>你的站队</span>
            <strong>
              {{ selectedSide === 'support' ? activeTopic.sideA.label : activeTopic.sideB.label }}
            </strong>
            <p>当前总票数已更新为 {{ formattedVoteCount }}</p>
          </section>

          <el-button class="vote-reset" size="large" round plain :disabled="isVoting" @click="resetVote">
            换一个议题继续站队
          </el-button>
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
  display: grid;
  gap: 18px;
  padding: 22px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.05);
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

.vote-strip,
.vote-result {
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.vote-strip span,
.vote-result span {
  color: rgba(199, 216, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.vote-strip strong,
.vote-result strong {
  font-size: 1.4rem;
}

.vote-result p {
  margin: 0;
  color: rgba(247, 241, 232, 0.68);
}

.vote-reset {
  justify-self: start;
}

.vote-card :deep(.stance-panel) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.vote-card :deep(.stance) {
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.vote-card :deep(.stance span) {
  color: rgba(199, 216, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
}

.vote-card :deep(.stance--support) {
  border: 1px solid rgba(255, 110, 69, 0.28);
}

.vote-card :deep(.stance--oppose) {
  border: 1px solid rgba(90, 140, 255, 0.28);
}

.vote-card :deep(.action-row) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.vote-card :deep(.vote-button) {
  width: 100%;
  height: 52px;
  border: 0;
  font-weight: 700;
}

.vote-card :deep(.vote-button--support) {
  background: linear-gradient(135deg, #ff6d45, #ff9a6d);
  color: #fff7ee;
}

.vote-card :deep(.vote-button--oppose) {
  background: linear-gradient(135deg, #5a8cff, #7baeff);
  color: #fff7ee;
}

@media (max-width: 960px) {
  .vote-layout {
    grid-template-columns: 1fr;
  }
}
</style>
