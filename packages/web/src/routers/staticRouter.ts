import type { RouteRecordRaw } from 'vue-router'

import AppShell from '@/components/layout/AppShell.vue'

export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    component: AppShell,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/AuthLandingView.vue'),
        meta: {
          title: '登录注册'
        }
      },
      {
        path: 'vote',
        name: 'vote',
        component: () => import('@/views/VoteView.vue'),
        meta: {
          title: '投票页'
        }
      },
      {
        path: 'persona-roast',
        name: 'personaRoast',
        component: () => import('@/views/PersonaRoastView.vue'),
        meta: {
          title: '性格生成锐评页'
        }
      },
      {
        path: 'other-opinions',
        name: 'otherOpinions',
        component: () => import('@/views/OtherOpinionsView.vue'),
        meta: {
          title: '查看其他观点页'
        }
      },
      {
        path: 'summary',
        name: 'summary',
        component: () => import('@/views/SummaryView.vue'),
        meta: {
          title: '总结页'
        }
      }
    ]
  }
]

export const errorRouter: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]
