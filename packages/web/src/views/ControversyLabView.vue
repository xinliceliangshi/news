<script setup lang="ts">
import { computed, ref } from 'vue'

import CommentPanel from '../components/controversy/CommentPanel.vue'
import DebateCardHeader from '../components/controversy/DebateCardHeader.vue'
import OutcomeBox from '../components/controversy/OutcomeBox.vue'
import ResultPanel from '../components/controversy/ResultPanel.vue'
import StageHero from '../components/controversy/StageHero.vue'
import StancePanel from '../components/controversy/StancePanel.vue'
import VoteActions from '../components/controversy/VoteActions.vue'
import { controversyComments, controversyTopic } from '../data/controversy'
import type { VoteSide } from '../types/controversy'

const selectedSide = ref<VoteSide | null>(null)

const hasVoted = computed(() => selectedSide.value !== null)
const isMinority = computed(() => selectedSide.value === 'oppose')

function handleVote(side: VoteSide) {
  selectedSide.value = side
}

function resetVote() {
  selectedSide.value = null
}
</script>

<template>
  <div class="page-shell">
    <section class="stage">
      <StageHero />

      <article class="main-card">
        <div class="main-card__glow" />

        <DebateCardHeader :title="controversyTopic.title" :has-voted="hasVoted" />

        <template v-if="!hasVoted">
          <StancePanel
            :support-label="controversyTopic.supportLabel"
            :oppose-label="controversyTopic.opposeLabel"
          />

          <section class="vote-strip">
            <span>当前投票人数</span>
            <strong>{{ controversyTopic.voters }}</strong>
          </section>

          <VoteActions @vote="handleVote" />
        </template>

        <template v-else>
          <ResultPanel
            :support-label="controversyTopic.supportLabel"
            :oppose-label="controversyTopic.opposeLabel"
            :support-rate="controversyTopic.supportRate"
            :oppose-rate="controversyTopic.opposeRate"
            :user-side="selectedSide"
          />

          <OutcomeBox
            :is-minority="isMinority"
            :iq-left="controversyTopic.iqLeft"
            :user-label="isMinority ? controversyTopic.opposeLabel : controversyTopic.supportLabel"
            :majority-label="isMinority ? controversyTopic.supportLabel : controversyTopic.opposeLabel"
          />

          <CommentPanel :comments="controversyComments" />

          <section class="action-row action-row--result">
            <el-button class="watch-button" size="large" round>
              😤 看对面怎么骂的
            </el-button>
            <el-button class="reset-button" size="large" round plain @click="resetVote">
              重新模拟
            </el-button>
          </section>
        </template>
      </article>
    </section>
  </div>
</template>
