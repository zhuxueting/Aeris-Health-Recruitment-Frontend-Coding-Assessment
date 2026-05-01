export type AnalyticsEventName = 'pdp_add_to_cart'

export type AnalyticsEvent = {
  name: AnalyticsEventName
  ts: number
  payload: Record<string, unknown>
}

