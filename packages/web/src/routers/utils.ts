import type { RouteRecordRaw } from 'vue-router'

export function getRouteTitle(route: RouteRecordRaw) {
  return typeof route.meta?.title === 'string' ? route.meta.title : ''
}
