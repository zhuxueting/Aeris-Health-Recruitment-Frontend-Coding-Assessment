import type { ApiResult } from '../types/api'
import { addCartLine, getCartCount, mockProduct } from './mockDb'
import { maybeFail, sleep } from './utils'

export type AddToCartRequest = {
  skuId: string
  qty: number
}

export type AddToCartResponse = {
  cartCount: number
}

export async function addToCart(
  req: AddToCartRequest,
): Promise<ApiResult<AddToCartResponse>> {
  try {
    await sleep(450)
    maybeFail({
      probability: 0.1,
      message: 'Failed to add to cart. Please try again.',
    })

    const sku = mockProduct.skus.find((s) => s.id === req.skuId)
    if (!sku) return { ok: false, message: 'SKU not found.', code: 'SKU_NOT_FOUND' }
    if (req.qty < 1) return { ok: false, message: 'Quantity must be >= 1.' }
    if (sku.stock <= 0)
      return { ok: false, message: 'This variant is out of stock.', code: 'OOS' }
    if (req.qty > sku.stock)
      return {
        ok: false,
        message: `Not enough stock. Max available: ${sku.stock}.`,
        code: 'STOCK_NOT_ENOUGH',
      }

    // mock：加购成功后仅更新购物车计数，不扣减库存（真实业务通常会扣减/锁库存）
    addCartLine(req.skuId, req.qty)
    return { ok: true, data: { cartCount: getCartCount() } }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Unknown error.' }
  }
}

