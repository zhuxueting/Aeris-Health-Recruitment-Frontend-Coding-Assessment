import type { AnalyticsEvent } from '../types/analytics'

export function track(event: AnalyticsEvent) {
  // demo：输出到 console，真实项目可替换为埋点 SDK / fetch 上报
  // eslint-disable-next-line no-console
  console.info('[analytics]', event.name, event)
}

