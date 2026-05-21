<script setup lang="ts">
const highlights = [
  '热点议题快速聚合，第一时间看到争议焦点。',
  '先投票再看阵营反馈，把参与感和留存感做强。',
  '支持后续接入积分、评论对骂页和用户成长体系。'
]
</script>

<template>
  <section class="auth-hero">
    <span class="kicker">Debate News</span>
    <h1>登录后，加入今天最吵的那场公共讨论。</h1>
    <p>
      这是面向用户的初始界面。新用户可以注册进入，老用户可以直接登录，马上参与热点投票和阵营互动。
    </p>

    <div class="auth-hero__stats">
      <div>
        <strong>124,908</strong>
        <span>今日围观</span>
      </div>
      <div>
        <strong>08</strong>
        <span>热议议题</span>
      </div>
      <div>
        <strong>4.8</strong>
        <span>用户活跃度</span>
      </div>
    </div>

    <ul class="auth-hero__highlights">
      <li v-for="item in highlights" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
