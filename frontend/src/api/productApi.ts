import type { ApiResult } from '../types/api'
import type { Product } from '../types/product'
import { mockProduct } from './mockDb'
import { maybeFail, sleep } from './utils'

export async function getProductDetail(
  productId: string,
): Promise<ApiResult<Product>> {
  try {
    await sleep(500)
    // Small probability of failure for demo
    maybeFail({
      probability: 0.12,
      message: 'Failed to load product details. Please try again.',
    })

    if (productId !== mockProduct.id) {
      return { ok: false, message: 'Product not found.', code: 'NOT_FOUND' }
    }

    return { ok: true, data: mockProduct }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Unknown error.' }
  }
}

