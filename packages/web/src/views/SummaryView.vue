<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PageFrame from '../components/common/PageFrame.vue'
import { HttpError } from '../api/client'
import { fetchTopicById } from '../api/topic'
import { useVoteSession } from '../composables/useVoteSession'
import { getPersonaConfig, getRecommendedPersonaTypes } from '../constants/personas'
import type { Topic } from '../types/topic'
import { extractCozeOutput } from '../utils/cozeOutput'

type JourneyStep = {
  key: string
  label: string
  detail: string
  status: 'done' | 'active' | 'pending' | 'error'
  routeName?: 'vote' | 'personaRoast' | 'otherOpinions'
}

const router = useRouter()
const { voteSession, clearVoteSession } = useVoteSession()

const topic = ref<Topic | null>(null)
const topicError = ref('')
const isLoadingTopic = ref(false)

const hasSession = computed(() => voteSession.value !== null)

const roastText = computed(() => {
  const output = voteSession.value?.cozeOutput

  if (!output) {
    return ''
  }

  return extractCozeOutput(output)
})

const cozeStatus = computed(() => voteSession.value?.cozeStatus ?? (roastText.value ? 'done' : 'idle'))

const sideStats = computed(() => topic.value?.sideStats ?? null)

const userSide = computed(() => voteSession.value?.side ?? null)

const isMinority = computed(() => {
  if (!userSide.value || !sideStats.value) {
    return false
  }

  const userIsSupport = userSide.value === 'support'
  const supportWins = sideStats.value.sideA.percent >= sideStats.value.sideB.percent

  return userIsSupport ? !supportWins : supportWins
})

const majorityLabel = computed(() => {
  if (!topic.value || !sideStats.value) {
    return ''
  }

  return sideStats.value.sideA.percent >= sideStats.value.sideB.percent
    ? topic.value.sideA.label
    : topic.value.sideB.label
})

const minorityLabel = computed(() => {
  if (!topic.value || !sideStats.value) {
    return ''
  }

  return sideStats.value.sideA.percent < sideStats.value.sideB.percent
    ? topic.value.sideA.label
    : topic.value.sideB.label
})

const supportRate = computed(() => sideStats.value?.sideA.percent ?? null)
const opposeRate = computed(() => sideStats.value?.sideB.percent ?? null)

const formattedVoteCount = computed(() => {
  if (!topic.value) {
    return '—'
  }

  return new Intl.NumberFormat('zh-CN').format(topic.value.voteCount)
})

const recommendedPersonas = computed(() => {
  const mbti = voteSession.value?.mbti

  if (!mbti) {
    return []
  }

  return getRecommendedPersonaTypes(mbti) ?? []
})

const personaConfig = computed(() =>
  voteSession.value?.mbti ? getPersonaConfig(voteSession.value.mbti) : null
)

const pageDescription = computed(() => {
  if (!hasSession.value) {
    return '完成投票、锐评和他人观点探索后，在这里收拢你的站队路径与争议结论。'
  }

  return '汇总你在本次争议中的立场、战局位置、人格锐评与可继续探索的方向。'
})

const journeySteps = computed<JourneyStep[]>(() => {
  const session = voteSession.value

  if (!session) {
    return []
  }

  const roastStepStatus =
    cozeStatus.value === 'done'
      ? 'done'
      : cozeStatus.value === 'pending'
        ? 'active'
        : cozeStatus.value === 'error'
          ? 'error'
          : 'pending'

  return [
    {
      key: 'vote',
      label: '投票站队',
      detail: `${session.sideLabel} · ${session.mbti} · ${getPersonaConfig(session.mbti).label}`,
      status: 'done',
      routeName: 'vote'
    },
    {
      key: 'roast',
      label: '人格锐评',
      detail:
        roastStepStatus === 'done'
          ? '已生成 Coze 锐评'
          : roastStepStatus === 'active'
            ? '锐评生成中…'
            : roastStepStatus === 'error'
              ? '锐评生成失败，可重试'
              : '等待生成或前往锐评页',
      status: roastStepStatus,
      routeName: 'personaRoast'
    },
    {
      key: 'opinions',
      label: '他人观点',
      detail:
        recommendedPersonas.value.length > 0
          ? `推荐对比 ${recommendedPersonas.value.join(' / ')}`
          : '查看同阵营与对立阵营表达',
      status: roastStepStatus === 'done' ? 'active' : 'pending',
      routeName: 'otherOpinions'
    },
    {
      key: 'summary',
      label: '争议总结',
      detail: '当前页面：归档本次消费路径',
      status: 'active'
    }
  ]
})

const verdictHeadline = computed(() => {
  if (!voteSession.value) {
    return ''
  }

  if (!sideStats.value) {
    return `你站在「${voteSession.value.sideLabel}」一侧`
  }

  if (isMinority.value) {
    return `你是少数派：${voteSession.value.sideLabel}`
  }

  return `你与多数派同在：${majorityLabel.value}`
})

const verdictBody = computed(() => {
  const session = voteSession.value

  if (!session) {
    return ''
  }

  const parts: string[] = [
    `围绕「${session.topicTitle}」，你以 ${session.mbti}${personaConfig.value ? `（${personaConfig.value.label}）` : ''} 的身份选择了 ${session.sideLabel}。`
  ]

  if (sideStats.value && topic.value) {
    parts.push(
      `当前全场 ${formattedVoteCount.value} 票，` +
        `${topic.value.sideA.label} ${sideStats.value.sideA.percent}%，` +
        `${topic.value.sideB.label} ${sideStats.value.sideB.percent}%。`
    )

    if (isMinority.value) {
      parts.push(`你所在阵营人数少于 ${majorityLabel.value}，会承受更强的对立火力与表达压力。`)
    } else {
      parts.push(`你的阵营目前占上风，更适合观察少数派如何反驳与自我辩护。`)
    }
  }

  if (roastText.value) {
    const excerpt = roastText.value.length > 120 ? `${roastText.value.slice(0, 120)}…` : roastText.value
    parts.push(`人格锐评摘录：${excerpt}`)
  } else if (cozeStatus.value === 'pending') {
    parts.push('锐评仍在生成，完成后这里会自动补上你的画像摘要。')
  }

  return parts.join('')
})

function goToVote() {
  void router.push({ name: 'vote' })
}

function goTo(routeName: JourneyStep['routeName']) {
  if (!routeName) {
    return
  }

  void router.push({ name: routeName })
}

function restartFlow() {
  clearVoteSession()
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
    topicError.value = error instanceof HttpError ? error.message : '议题战局加载失败'
  } finally {
    isLoadingTopic.value = false
  }
}

onMounted(() => {
  if (hasSession.value) {
    void loadTopic()
  }
})
</script>

<template>
  <PageFrame title="争议总结" :description="pageDescription">
    <div v-if="!hasSession" class="summary-empty">
      <article class="summary-panel summary-panel--center">
        <span class="summary-eyebrow">还没有归档内容</span>
        <h3>先走完投票 → 锐评 → 观点探索</h3>
        <p>完成站队并生成锐评后，总结页会帮你收拢立场、战局位置与可分享的结论摘要。</p>
        <el-button type="primary" round @click="goToVote">去投票页开始</el-button>
      </article>
    </div>

    <div v-else class="summary-layout">
      <section class="summary-panel summary-panel--hero">
        <div>
          <span class="summary-eyebrow">本次争议</span>
          <h3>{{ voteSession?.topicTitle }}</h3>
          <p>
            {{ voteSession?.mbti }} · {{ personaConfig?.label }} ｜ {{ voteSession?.sideLabel }}
            <template v-if="topic?.tags.length"> ｜ {{ topic.tags.join(' · ') }}</template>
          </p>
        </div>

        <div class="summary-hero__badge" :class="{ 'is-minority': isMinority }">
          <span>{{ isMinority ? '少数派' : sideStats ? '多数派' : '立场已锁定' }}</span>
          <strong>{{ verdictHeadline || voteSession?.sideLabel }}</strong>
        </div>
      </section>

      <section class="summary-panel">
        <header class="summary-section__header">
          <div>
            <span class="summary-eyebrow">消费路径</span>
            <h4>你的站队轨迹</h4>
          </div>
        </header>

        <ol class="summary-timeline">
          <li
            v-for="(step, index) in journeySteps"
            :key="step.key"
            class="summary-timeline__item"
            :class="`summary-timeline__item--${step.status}`"
          >
            <div class="summary-timeline__marker">
              <span>{{ index + 1 }}</span>
            </div>
            <div class="summary-timeline__body">
              <div class="summary-timeline__title">
                <strong>{{ step.label }}</strong>
                <span class="summary-timeline__status">{{ step.detail }}</span>
              </div>
              <button
                v-if="step.routeName && step.key !== 'summary'"
                type="button"
                class="summary-timeline__link"
                @click="goTo(step.routeName)"
              >
                前往该步骤
              </button>
            </div>
          </li>
        </ol>
      </section>

      <div class="summary-grid">
        <section class="summary-panel summary-panel--stat">
          <header class="summary-section__header">
            <div>
              <span class="summary-eyebrow">战局快照</span>
              <h4>全场投票分布</h4>
            </div>
            <span v-if="isLoadingTopic" class="summary-meta">加载中…</span>
          </header>

          <p v-if="topicError" class="summary-error">{{ topicError }}</p>

          <template v-else-if="sideStats && topic">
            <div class="summary-meter">
              <div class="summary-meter__bar summary-meter__bar--a" :style="{ width: `${supportRate}%` }" />
              <div class="summary-meter__bar summary-meter__bar--b" :style="{ width: `${opposeRate}%` }" />
            </div>

            <div class="summary-meter__labels">
              <div>
                <span>{{ topic.sideA.label }}</span>
                <strong>{{ supportRate }}%</strong>
              </div>
              <div>
                <span>{{ topic.sideB.label }}</span>
                <strong>{{ opposeRate }}%</strong>
              </div>
            </div>

            <ul class="summary-stat-list">
              <li>
                <span>总票数</span>
                <strong>{{ formattedVoteCount }}</strong>
              </li>
              <li>
                <span>你的阵营</span>
                <strong>{{ voteSession?.sideLabel }}</strong>
              </li>
              <li>
                <span>当前多数</span>
                <strong>{{ majorityLabel || '—' }}</strong>
              </li>
              <li>
                <span>少数派阵营</span>
                <strong>{{ minorityLabel || '—' }}</strong>
              </li>
            </ul>
          </template>

          <p v-else class="summary-muted">战局数据暂不可用，你的站队记录仍然有效。</p>
        </section>

        <section class="summary-panel">
          <header class="summary-section__header">
            <div>
              <span class="summary-eyebrow">人格锐评</span>
              <h4>你的画像摘要</h4>
            </div>
            <button type="button" class="summary-inline-link" @click="goTo('personaRoast')">查看全文</button>
          </header>

          <p v-if="cozeStatus === 'pending'" class="summary-muted">锐评生成中，请稍候或前往锐评页查看进度。</p>
          <p v-else-if="cozeStatus === 'error'" class="summary-error">锐评生成失败，可在锐评页重新触发。</p>
          <p v-else-if="roastText" class="summary-roast">{{ roastText }}</p>
          <p v-else class="summary-muted">尚未生成锐评，完成投票后通常会自动触发 Coze 工作流。</p>
        </section>
      </div>

      <section class="summary-panel summary-panel--verdict">
        <span class="summary-eyebrow">争议结论</span>
        <h4>{{ verdictHeadline }}</h4>
        <p class="summary-verdict">{{ verdictBody }}</p>

        <div class="summary-actions">
          <el-button type="primary" round @click="goTo('otherOpinions')">继续看他人观点</el-button>
          <el-button round @click="goTo('vote')">回到投票页</el-button>
          <el-button round plain @click="restartFlow">清空记录，重新站队</el-button>
        </div>
      </section>
    </div>
  </PageFrame>
</template>

<style scoped>
.summary-empty,
.summary-layout {
  display: grid;
  gap: 18px;
}

.summary-panel {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(18px);
  padding: 24px;
}

.summary-panel--center {
  display: grid;
  gap: 14px;
  justify-items: start;
  max-width: 40rem;
}

.summary-panel--hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.summary-panel--hero h3 {
  margin: 10px 0 8px;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  letter-spacing: -0.04em;
}

.summary-panel--hero p,
.summary-muted,
.summary-verdict {
  margin: 0;
  color: rgba(247, 241, 232, 0.72);
  line-height: 1.7;
}

.summary-panel--verdict h4 {
  margin: 12px 0 10px;
  font-size: 1.35rem;
}

.summary-eyebrow {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 110, 69, 0.12);
  color: #ffbc9c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.summary-hero__badge {
  display: grid;
  gap: 8px;
  min-width: 180px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(90, 140, 255, 0.18), rgba(116, 214, 159, 0.12));
  text-align: right;
}

.summary-hero__badge.is-minority {
  background: linear-gradient(135deg, rgba(255, 109, 69, 0.22), rgba(255, 206, 112, 0.12));
}

.summary-hero__badge span {
  color: rgba(247, 241, 232, 0.68);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.summary-hero__badge strong {
  font-size: 1.1rem;
  line-height: 1.4;
}

.summary-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.summary-section__header h4 {
  margin: 10px 0 0;
  font-size: 1.15rem;
}

.summary-meta {
  color: rgba(247, 241, 232, 0.56);
  font-size: 13px;
}

.summary-timeline {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.summary-timeline__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}

.summary-timeline__marker {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(247, 241, 232, 0.72);
  font-weight: 700;
}

.summary-timeline__item--done .summary-timeline__marker {
  background: rgba(116, 214, 159, 0.16);
  color: #b2f0c7;
}

.summary-timeline__item--active .summary-timeline__marker {
  background: rgba(255, 109, 69, 0.18);
  color: #ffbc9c;
}

.summary-timeline__item--error .summary-timeline__marker {
  background: rgba(255, 115, 115, 0.16);
  color: #ffb7b7;
}

.summary-timeline__body {
  display: grid;
  gap: 8px;
  padding-top: 4px;
}

.summary-timeline__title {
  display: grid;
  gap: 6px;
}

.summary-timeline__title strong {
  font-size: 1rem;
}

.summary-timeline__status {
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.92rem;
}

.summary-timeline__link,
.summary-inline-link {
  justify-self: start;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ffbc9c;
  cursor: pointer;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.summary-meter {
  display: flex;
  overflow: hidden;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}

.summary-meter__bar {
  height: 100%;
  min-width: 0;
  transition: width 0.35s ease;
}

.summary-meter__bar--a {
  background: linear-gradient(90deg, #ff6e45, #ff9d73);
}

.summary-meter__bar--b {
  background: linear-gradient(90deg, #5a8cff, #8eb6ff);
}

.summary-meter__labels,
.summary-stat-list {
  display: grid;
  gap: 12px;
}

.summary-meter__labels {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14px;
}

.summary-meter__labels div {
  display: grid;
  gap: 4px;
}

.summary-meter__labels span,
.summary-stat-list span {
  color: rgba(247, 241, 232, 0.62);
  font-size: 0.9rem;
}

.summary-meter__labels strong,
.summary-stat-list strong {
  font-size: 1.05rem;
}

.summary-stat-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.summary-stat-list li {
  display: grid;
  gap: 4px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.summary-roast {
  margin: 0;
  color: rgba(247, 241, 232, 0.84);
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.7;
}

.summary-error {
  margin: 0;
  color: #ffb7b7;
}

.summary-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

@media (max-width: 900px) {
  .summary-panel--hero,
  .summary-section__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-hero__badge {
    width: 100%;
    text-align: left;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
