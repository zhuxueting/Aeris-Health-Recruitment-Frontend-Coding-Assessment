import type { MoneyCny } from '../types/product'

export function formatCny(m: MoneyCny) {
  const yuan = (m.amountFen / 100).toFixed(2)
  return `¥${yuan}`
}

